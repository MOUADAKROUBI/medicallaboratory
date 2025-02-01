"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { PlusIcon } from "@heroicons/react/24/outline";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export function AddNewTeam() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    password: "",
    telephone: "",
    role: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data: user, error: userError } = await supabase
      .from("utilisateur")
      .insert([
        {
          nom: formData.nom,
          email: formData.email,
          telephone: Number(formData.telephone),
        },
      ])
      .select()
      .single();

    if (userError) throw userError;

    if (formData.role === "admin") {
      const { error: adminError } = await supabase
        .from("administration")
        .insert([
          {
            utilisateur_id: user.id,
            password: formData.password,
          },
        ]);
      if (adminError) throw adminError;
    } else if (formData.role === "security") {
      const { error: securityError } = await supabase.from("securite").insert([
        {
          utilisateur_id: user.id,
          password: formData.password,
        },
      ]);
      if (securityError) throw securityError;
    }

    setIsOpen(false);
    setFormData({
      nom: "",
      email: "",
      password: "",
      telephone: "",
      role: "",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Ajouter du personnel
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau membre du personnel</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nom">Nom</Label>
            <Input
              id="nom"
              value={formData.nom}
              onChange={(e) =>
                setFormData({ ...formData, nom: e.target.value })
              }
              autoFocus
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telephone">Téléphone</Label>
            <Input
              id="telephone"
              type="tel"
              value={formData.telephone}
              onChange={(e) =>
                setFormData({ ...formData, telephone: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Rôle</Label>
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
            Ajouter un membre du personnel
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
