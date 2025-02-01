"use client";

import React, { useState } from "react";
import { TableCell } from "@/app/ui/table";
import { Button } from "@/app/ui/button";
import { Dialog, DialogTrigger } from "@/app/ui/dialog";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { createClient } from "@/utils/supabase/client";
import { EditResultDialog } from "./editResultDialog";
import { Database } from "@/utils/supabase/types";

const supabase = createClient();

export default function ResultActions({
  result,
}: Readonly<{
  result: Database["public"]["Tables"]["resultats_analyse"]["Row"];
}>) {
  const [editingResult, setEditingResult] = useState<
    Database["public"]["Tables"]["resultats_analyse"]["Row"] | null
  >(null);

  async function deleteMutation(id: string) {
    const { error } = await supabase
      .from("resultats_analyse")
      .delete()
      .eq("id", id);
    if (error) {
      console.error("Failed to delete test result:", error);
    }
  }

  return (
    <TableCell>
      <div className="flex gap-2">
        <Dialog
          open={editingResult?.id === result.id}
          onOpenChange={(open) => !open && setEditingResult(null)}
        >
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setEditingResult(result)}
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          {editingResult && (
            <EditResultDialog
              result={editingResult}
              onClose={() => setEditingResult(null)}
            />
          )}
        </Dialog>
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            if (
              window.confirm(
                "Are you sure you want to delete this test result?"
              )
            ) {
              deleteMutation(result.id);
            }
          }}
        >
          <TrashIcon className="h-4 w-4" />
        </Button>
      </div>
    </TableCell>
  );
}
