"use client";

import React from "react";
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
  readonly user: Database["public"]["Tables"]["utilisateur"]["Row"] & {
    role: string;
    password: string | undefined;
  };
}) {
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [formData, setFormData] = React.useState({
    nom: "",
    email: "",
    password: "",
    telephone: "",
    role: "",
  });

  const handleEdit = (
    user: Database["public"]["Tables"]["utilisateur"]["Row"] & {
      role: string;
      password: string | undefined;
    }
  ) => {
    setFormData({
      nom: user.nom ?? "",
      email: user.email ?? "",
      telephone: user.telephone?.toString() ?? "",
      password: user.password ?? "",
      role: user.role ?? "",
    });
    setIsEditOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data: utilisateurs, error: userError } = await supabase
      .from("utilisateur")
      .update({
        nom: formData.nom,
        email: formData.email,
        telephone: Number(formData.telephone),
      })
      .eq("id", user.id)
      .select()
      .single();

    if (userError) throw userError;

    // Update role if changed
    if (formData.role === "admin") {
      // Remove from security if exists
      await supabase.from("securite").delete().eq("utilisateur_id", user.id);

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
              password: formData.password || user.password!,
            },
          ]);
        if (adminError) throw adminError;
      }
    } else if (formData.role === "security") {
      // Remove from admin if exists
      await supabase
        .from("administration")
        .delete()
        .eq("utilisateur_id", user.id);

      // Add to security if not exists
      const { data: existingSecurity } = await supabase
        .from("securite")
        .select()
        .eq("utilisateur_id", user.id)
        .single();

      if (!existingSecurity) {
        const { error: securityError } = await supabase
          .from("securite")
          .insert([
            {
              utilisateur_id: user.id,
              password: formData.password || user.password!,
            },
          ]);
        if (securityError) throw securityError;
      }
    }

    return utilisateurs;
  };

  async function deleteUser(userId: string) {
    const { error } = await supabase
      .from("utilisateur")
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
              <Label htmlFor="edit-password">
                Mot de passe (laisser vide pour conserver l'actuel)
              </Label>
              <Input
                id="edit-password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
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
                  <SelectItem value="security">Sécurité</SelectItem>
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
