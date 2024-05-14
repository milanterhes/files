import { client } from "@/trigger";
import { Database } from "@/utils/supabase/types";
import { Supabase, SupabaseManagement } from "@trigger.dev/supabase";
import { z } from "zod";
import xlsx from "node-xlsx";
import prisma from "@/utils/db";
import { Prisma } from "@prisma/client";

const supabase = new Supabase({
  id: "supabase",
  supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
});

const supabaseManagement = new SupabaseManagement({
  id: "supabase-management",
});

const db = supabaseManagement.db<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!
);

const ProductSchema = z
  .tuple([
    z.string(),
    z.string(),
    z.number(),
    z.number(),
    z.number(),
    z.string(),
    z.number(),
    z.string(),
    z.number(),
    z.string(),
  ])
  .transform((obj) => ({
    productId: obj[0],
    productName: obj[1],
    listedPrice: obj[2],
    discount: obj[3],
    nettoPrice: obj[4],
    currency: obj[5],
    packageSize: obj[6],
    unit: obj[7],
    unitPrice: obj[8],
    unitName: obj[9],
  }));

type Product = z.infer<typeof ProductSchema>;

function sliceIntoChunks(arr: Array<Product>, chunkSize: number) {
  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
}

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}

// creates a line for the VALUES part of the query
const productToValueLine = (product: Product) => {
  return `( '${product.productId}', '${product.productName}', ${product.listedPrice}, ${product.discount}, ${product.nettoPrice}, '${product.currency}', ${product.packageSize}, '${product.unit}', ${product.unitPrice}, '${product.unitName}' )`;
};

client.defineJob({
  id: "excel-parser",
  name: "Excel Parser",
  version: "0.0.1",
  trigger: db.onInserted({
    schema: "storage",
    table: "objects",
    filter: {
      record: {
        bucket_id: ["excel-files"],
      },
    },
  }),
  integrations: {
    supabase,
  },
  run: async (payload, io, ctx) => {
    const fileName = payload.record.name;
    if (!fileName) {
      throw new Error("where name");
    }
    const { data: fileData, error } = await io.supabase.client.storage
      .from("excel-files")
      .download(fileName);
    if (error) {
      throw error;
    }
    await io.logger.info(`File downloaded, size: ${fileData.size}`);

    const products = await io.runTask(`parse-file-${fileName}`, async () => {
      const workSheetsFromFile = xlsx.parse(await fileData.arrayBuffer());
      const rows = workSheetsFromFile[0].data.slice(1);
      return rows
        .map((row) => {
          const parsed = ProductSchema.safeParse(row);
          if (parsed.error) {
            return null;
          } else {
            return parsed.data;
          }
        })
        .filter(notEmpty);
    });

    await io.logger.info(
      `Parsed products #${products.length}, ${JSON.stringify(products[0])}`
    );

    const chunks = sliceIntoChunks(products, 250);
    let idx = 0;

    for (const chunk of chunks) {
      const newUpdates = await io.runTask(`chunk-${idx}`, async () => {
        const values = chunk.map(productToValueLine).join(",\n");

        const query = `
          WITH new_data ("productId", "productName", "listedPrice", "discount", "nettoPrice", "currency", "packageSize", "unit", "unitPrice", "unitName") AS (
            VALUES
                ${values}
          )
          INSERT INTO public.products ("productId", "productName", "listedPrice", "discount", "nettoPrice", "currency", "packageSize", "unit", "unitPrice", "unitName")
          SELECT "productId", "productName", "listedPrice", "discount", "nettoPrice", "currency", "packageSize", "unit", "unitPrice", "unitName"
          FROM new_data
          ON CONFLICT ("productId")
          DO UPDATE SET
              "productName" = EXCLUDED."productName",
              "listedPrice" = EXCLUDED."listedPrice",
              "discount" = EXCLUDED."discount",
              "nettoPrice" = EXCLUDED."nettoPrice",
              "currency" = EXCLUDED."currency",
              "packageSize" = EXCLUDED."packageSize",
              "unit" = EXCLUDED."unit",
              "unitPrice" = EXCLUDED."unitPrice",
              "unitName" = EXCLUDED."unitName";
        `;
        await io.logger.info(`Running query: ${query}`);

        await prisma.$executeRaw`${Prisma.raw(query)}`;
      });
      idx++;
    }

    await io.logger.info(`Updated products: ${idx}}`);
  },
});
