import ProductTable from "@/components/ProductTable";
import { UploadForm } from "@/components/UploadForm";
import { Button } from "@/components/ui/button";
import prisma from "@/utils/db";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { json } from "stream/consumers";

export default async function Home() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  if (!data.user) redirect("/login")

  const { data : user } = await supabase.from("users").select("*").single();

  if (user?.role !== "admin") redirect ("/")

  const files = await supabase.storage.from("excel-files").list("private", {
    limit: 100,
    offset: 0,
    sortBy: { column: "name", order: "asc" },
  });
  const products = await prisma.product.findMany({
    take: 5,
  });
  const total = await prisma.product.count();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col w-full gap-6 items-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
        {data.user?.email? (
          `Logged in as ${data.user.email} ${JSON.stringify(user, null, 2)}`
        ) : (
          <Link href="/login">
            <p>{JSON.stringify(user, null, 2)}</p>
            <Button>Login</Button>
          </Link>
        )}
        <p>Files in bucket: {files.data?.length}</p>
        {data.user?.email && <UploadForm />}
      </div>
      <ProductTable products={products} total={total} />
    </main>
  );
}