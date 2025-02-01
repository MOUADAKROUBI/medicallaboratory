"use client";

import React from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { createClient } from "@/utils/supabase/client";
import { TableCell } from "../../table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/ui/dialog";
import { Input } from "@/app/ui/input";
import { Label } from "@/app/ui/label";
import { Button } from "@/app/ui/button";
import { Patient } from "@/app/lib/definitions";

const supabase = createClient();

export default function PatientActions({
  patient,
}: {
  readonly patient: Patient
}) {
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    nom: "",
    email: "",
    telephone: "",
  });

  const handleEdit = (
    patient: Patient
  ) => {
    setFormData({
      nom: patient?.utilisateur?.nom ?? "",
      email: patient?.utilisateur?.email ?? "",
      telephone: patient?.utilisateur?.telephone?.toString() ?? ""
    });
    setIsEditOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data: utilisateurs, error: patientError } = await supabase
      .from("utilisateur")
      .update({
        nom: formData.nom,
        email: formData.email,
        telephone: Number(formData.telephone),
      })
      .eq("id", patient.utilisateur_id ?? '')
      .select()
      .single();

    if (patientError) throw patientError;

    return utilisateurs;
  };

  async function deletepatient(patientId: string | null) {
    const { error } = await supabase
      .from("utilisateur")
      .delete()
      .eq("id", patientId ?? '');
    if (error) throw error;
  }

  return (
    <TableCell>
      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le membre du personnel</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Same form fields as Add Dialog */}
            <div className="space-y-2">
              <Label htmlFor="code">Code</Label>
              <Input
                id="code"
                value={patient.code}
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-nom">Nom</Label>
              <Input
                id="edit-nom"
                value={formData.nom}
                onChange={(e) =>
                  setFormData({ ...formData, nom: e.target.value })
                }
                autoFocus
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-telephone">Téléphone</Label>
              <Input
                id="edit-telephone"
                type="tel"
                value={`0${formData.telephone}`}
                onChange={(e) =>
                  setFormData({ ...formData, telephone: e.target.value })
                }
              />
            </div>
            <Button type="submit" className="w-full">
              Mettre à jour le Patient
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Button
        variant="ghost"
        size="icon"
        className="mr-2"
        onClick={() => handleEdit(patient)}
      >
        <PencilIcon className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="text-destructive"
        onClick={() => {
          if (window.confirm("Are you sure you want to delete this patient?")) {
            deletepatient(patient.utilisateur_id);
          }
        }}
      >
        <TrashIcon className="h-4 w-4" />
      </Button>
    </TableCell>
  );
}
