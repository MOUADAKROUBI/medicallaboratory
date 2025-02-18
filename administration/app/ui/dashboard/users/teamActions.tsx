"use client";

import React, { useEffect, useState } from "react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Database } from "@/utils/supabase/types";
import { createClient } from "@/utils/supabase/client";
import { TableCell } from "../../table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/ui/dialog";
import { Input } from "@/app/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/ui/select";
import { Label } from "@/app/ui/label";
import { Button } from "@/app/ui/button";

const supabase = createClient();

export default function TeamActions({
  user,
}: {
  readonly user: Database["public"]["Tables"]["profile"]["Row"] & {
    role: string;
  };
}) {
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    nom: "",
    email: "",
    telephone: "",
    role: "",
  });
  const [userFetched, setUserFetched] = useState<Database["public"]["Tables"]["profile"]["Row"]>({
    email: "",
    id: "",
    nom: "",
    telephone: NaN,
    email_verified: false
  });
  
  useEffect( () => {
    async function getUserByID() {
      const {data, error} = await supabase.auth.admin.getUserById(user.id);
      if (error) {
        throw error;
      };

      setUserFetched({
        email: data.user.email ?? null,
        id: data.user.id,
        nom: data.user.user_metadata?.nom ?? "",
        telephone: Number(data.user.phone),
        email_verified: data.user.user_metadata?.email_verified ?? false,
      })
    }

    getUserByID()
  }, [])

  const handleEdit = (
    user: Database["public"]["Tables"]["profile"]["Row"] & {
      role: string;
    }
  ) => {
    setFormData({
      nom: user.nom ?? "",
      email: user.email ?? "",
      telephone: user.telephone?.toString() ?? "",
      role: user.role ?? "",
    });
    setIsEditOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data: utilisateurs, error: userError } = await supabase
      .from("profile")
      .update({
        nom: formData.nom,
        email: formData.email,
        telephone: Number(formData.telephone),
        email_verified: userFetched.email_verified
      })
      .eq("id", user.id)
      .select()
      .single();

    if (userError) throw userError;

    // Update role if changed
    if (formData.role === "admin") {
      // Remove from reception if exists
      await supabase.from("reception").delete().eq("utilisateur_id", user.id);

      // Add to admin if not exists
      const { data: existingAdmin } = await supabase
        .from("administration")
        .select()
        .eq("utilisateur_id", user.id)
        .single();

      if (!existingAdmin) {
        const { error: adminError } = await supabase
          .from("administration")
          .insert([
            {
              utilisateur_id: user.id,
            },
          ]);
        if (adminError) throw adminError;
      }
    } else if (formData.role === "reception") {
      // Remove from admin if exists
      await supabase
        .from("administration")
        .delete()
        .eq("utilisateur_id", user.id);

      // Add to Reception if not exists
      const { data: existingReception } = await supabase
        .from("reception")
        .select()
        .eq("utilisateur_id", user.id)
        .single();

      if (!existingReception) {
        const { error: ReceptionError } = await supabase
          .from("reception")
          .insert([
            {
              utilisateur_id: user.id,
            },
          ]);
        if (ReceptionError) throw ReceptionError;
      }
    }

    return utilisateurs;
  };

  async function deleteUser(userId: string) {
    const { error } = await supabase
      .from("profile")
      .delete()
      .eq("id", userId);
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
            <div className="space-y-2">
              <Label htmlFor="edit-role">Rôle</Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData({ ...formData, role: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="reception">Reception</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">
              Mettre à jour le membre du personnel
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Button
        variant="ghost"
        size="icon"
        className="mr-2"
        onClick={() => handleEdit(user)}
      >
        <PencilIcon className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="text-destructive"
        onClick={() => {
          if (window.confirm("Are you sure you want to delete this user?")) {
            deleteUser(user.id);
          }
        }}
      >
        <TrashIcon className="h-4 w-4" />
      </Button>
    </TableCell>
  );
}
