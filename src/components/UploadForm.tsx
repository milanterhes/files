"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/client";
import { Label } from "@radix-ui/react-label";
import { FormEvent, useEffect, useRef, useState } from "react";

export function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const supabase = createClient();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      file &&
      file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
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

  useEffect(() => {
    if (
      file &&
      file.type !==
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      fileInputRef.current?.setCustomValidity(
        "Please upload an excel file (.xlsx)"
      );
      fileInputRef.current?.reportValidity();
    } else {
      fileInputRef.current?.setCustomValidity("");
    }
  }, [file]);

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
            ref={fileInputRef}
          />
          <p className="text-sm text-muted-foreground">The excel file.</p>
        </div>
        {/* <FormDescription>The excel file.</FormDescription> */}
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}
