"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/ui/dialog";
import { Button } from "@/app/ui/button";
import { PlusIcon } from "@heroicons/react/24/outline";
import { ServiceForm } from "./serviceForm";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const uploadImage = async (file: File) => {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const { error: uploadError } = await supabase.storage
    .from("services")
    .upload(fileName, file);

  if (uploadError) throw uploadError;

  const {
    data: { publicUrl },
  } = supabase.storage.from("services").getPublicUrl(fileName);

  return publicUrl;
};

export default function AddNewContent() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    nom_service: "",
    description: "",
    prix: "",
    image: null as File | null,
  });

  const resetForm = () => {
    setFormData({
      nom_service: "",
      description: "",
      prix: "",
      image: null as File | null,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let imageUrl = null;
    if (formData.image) {
      imageUrl = await uploadImage(formData.image);
    }

    const { error } = await supabase.from("services").insert([
      {
        nom_service: formData.nom_service,
        description: formData.description,
        prix: parseFloat(formData.prix),
        image: imageUrl,
      },
    ]);

    if (error) throw error;

    setIsOpen(false);
    resetForm();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) resetForm();
      }}
    >
      <DialogTrigger asChild className="flex justify-end">
        <Button onClick={() => setIsOpen(true)}>
          <PlusIcon className="mr-2 h-4 w-4" /> Add Service
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Service</DialogTitle>
        </DialogHeader>
        <ServiceForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
