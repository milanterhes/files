import { client } from "@/trigger";
import { Database } from "@/utils/supabase/types";
import { Supabase, SupabaseManagement } from "@trigger.dev/supabase";
import { z } from "zod";
import xlsx from "node-xlsx";
import prisma from "@/utils/db";

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
    z.string().optional(),
    z.string().optional(),
    z.number().optional(),
    z.number().optional(),
    z.number().optional(),
    z.string().optional(),
    z.number().optional(),
    z.string().optional(),
    z.number().optional(),
    z.string().optional(),
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

function sliceIntoChunks(arr: Array<Product | null>, chunkSize: number) {
  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
}

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

    const result = await io.runTask(`parse-file-${fileName}`, async () => {
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
        .filter((x) => x !== null);
    });

    await io.logger.info(
      `Parse result #${result.length}, ${JSON.stringify(result[0])}`
    );

    const chunks = sliceIntoChunks(result, 250);
    const updates = [];
    let idx = 0;

    for (const chunk of chunks) {
      const newUpdates = await io.runTask(`chunk-${idx}`, async () => {
        const promises = chunk.map((newProduct) =>
          prisma.product.upsert({
            where: {
              productId: newProduct!.productId, // TODO: fix "!"
            },
            create: {
              ...newProduct,
            },
            update: {
              ...newProduct,
            },
          })
        );
        const updateResult = await prisma.$transaction(promises);
        return updateResult;
      });
      updates.push(...newUpdates);
      idx++;
    }

    await io.logger.info(`Updated products: ${JSON.stringify(updates.length)}`);
  },
});
