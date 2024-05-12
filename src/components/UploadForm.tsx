"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/client";
import { Label } from "@radix-ui/react-label";
import { FormEvent, useState } from "react";

export function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState<string>("");

  const supabase = createClient();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (file) {
      const { data, error } = await supabase.storage
        .from("excel-files")
        .upload(`private/${name}`, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (!error) {
        setName("");
        setFile(null);
      }
      console.log({ data, error });
    }
  }

  return (
    <div className="flex flex-col">
      <form onSubmit={onSubmit} className="space-y-8">
        <div className="space-y-1">
          <Label>Name</Label>
          <Input
            placeholder="data.xlsx"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            This is the name of the file.
          </p>
        </div>

        <div className="space-y-1">
          <Label>File</Label>
          <Input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          <p className="text-sm text-muted-foreground">The excel file.</p>
        </div>
        {/* <FormDescription>The excel file.</FormDescription> */}
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}
