"use client";

import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Database } from "@/utils/supabase/types";
import { Button } from "@/app/ui/button";
import { Input } from "@/app/ui/input";
import { DialogContent, DialogHeader, DialogTitle } from "@/app/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";

const supabase = createClient();

export const EditResultDialog = ({
  result,
  onClose,
}: {
  result: Database["public"]["Tables"]["resultats_analyse"]["Row"];
  onClose: () => void;
}) => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function updateMutation() {
    if (!pdfFile) {
        alert("Veuillez sélectionner un fichier");
        throw new Error("Veuillez sélectionner un fichier");
    }

    setIsPending(true);
    // Télécharger le fichier vers le stockage
    const fileExt = pdfFile.name.split(".").pop();
    const filePath = `${crypto.randomUUID()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("test_results")
      .upload(filePath, pdfFile);

    if (uploadError) throw uploadError;

    // Obtenir l'URL publique
    const {
      data: { publicUrl },
    } = supabase.storage.from("test_results").getPublicUrl(filePath);

    // Mettre à jour l'enregistrement du résultat de test
    const { error } = await supabase
      .from("resultats_analyse")
      .update({
        resultat_test: publicUrl,
        telecharger_date: new Date().toISOString(),
      })
      .eq("id", result.id);

    if (error) throw error;
    setIsPending(false);
    onClose();
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit Test Result</DialogTitle>
        <DialogDescription>
          Upload a PDF file containing the test results
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <label htmlFor="result-file" className="text-sm font-medium">
            Result PDF
          </label>
          <Input
            id="result-file"
            type="file"
            accept=".pdf"
            onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
          />
        </div>
        <Button
          onClick={() => updateMutation()}
          disabled={isPending || !pdfFile}
          className={`w-full ${isPending ? "cursor-none opacity-50" : ""}`}
        >
          Save Changes
        </Button>
      </div>
    </DialogContent>
  );
};
