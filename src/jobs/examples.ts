import { client } from "@/trigger";
import { Database } from "@/utils/supabase/types";
import { Supabase, SupabaseManagement } from "@trigger.dev/supabase";

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
    await io.logger.info(`File uploaded: ${payload.record.name}`);
  },
});
