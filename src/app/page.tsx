import { UploadForm } from "@/components/UploadForm";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function Home() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  const files = await supabase.storage.from("excel-files").list("private", {
    limit: 100,
    offset: 0,
    sortBy: { column: "name", order: "asc" },
  });
  console.log({ files });
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col w-full gap-6 items-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
        {data.user?.email ? (
          `Logged in as ${data.user.email}`
        ) : (
          <Link href="/login">
            <Button>Login</Button>
          </Link>
        )}
        <p>Files in bucket: {files.data?.length}</p>
        {data.user?.email && <UploadForm />}
      </div>
    </main>
  );
}
