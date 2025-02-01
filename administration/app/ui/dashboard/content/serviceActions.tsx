"use client";

import React, { useState } from "react";
import { Database } from "@/utils/supabase/types";
import { Button } from "@/app/ui/button";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/ui/dialog";
import { createClient } from "@/utils/supabase/client";
import { ServiceForm } from "./serviceForm";
import { uploadImage } from "./addNewContent";

const supabase = createClient();

export default function ServiceActions({
  service,
}: {
  readonly service: Database["public"]["Tables"]["services"]["Row"];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [formData, setFormData] = useState({
    nom_service: "",
    description: "",
    prix: "",
    image: null as File | null,
  });

  const handleEdit = () => {
    setEditingService(service);

    setFormData({
      nom_service: service.nom_service,
      description: service.description ?? "",
      prix: String(service.prix),
      image: null,
    });
    setIsOpen(true);
  };

  const resetForm = () => {
    setFormData({
      nom_service: "",
      description: "",
      prix: "",
      image: null as File | null,
    })
    setEditingService(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let imageUrl = editingService.image;
      if (formData.image) {
        imageUrl = await uploadImage(formData.image);
      }

      const { error } = await supabase
        .from("services")
        .update({
          nom_service: formData.nom_service,
          description: formData.description,
          prix: parseFloat(formData.prix),
          image: imageUrl,
        })
        .eq("id", service.id);

      if (error) throw error;

      setIsOpen(false);
      resetForm();
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      const { error } = await supabase.from("services").delete().eq("id", id);
      if (error) throw error;
    }
  };

  return (
    <div className="space-x-2">
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le service</DialogTitle>
          </DialogHeader>
          <ServiceForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            isEditing={!!editingService}
          />
        </DialogContent>
      </Dialog>
      <Button variant="outline" size="sm" onClick={() => handleEdit()}>
        <PencilIcon className="h-4 w-4" />
      </Button>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => handleDelete(service.id)}
      >
        <TrashIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
