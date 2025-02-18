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

export const uploadImage = async (file: File, setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>) => {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const { error: uploadError } = await supabase.storage
    .from("services")
    .upload(fileName, file, {
      contentType: "image/*"
    });

  if (uploadError) {
    setErrorMessage(uploadError.message);
  } 

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

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

    setErrorMessage(null)
    setLoading(true)
    try {
      let imageUrl: string | null = null;
      if (formData.image) {
        imageUrl = await uploadImage(formData.image, setErrorMessage);
      }
  
      const { error } = await supabase.from("services").insert([
        {
          nom_service: formData.nom_service,
          description: formData.description,
          prix: parseFloat(formData.prix),
          image: imageUrl,
        },
      ]);
  
      if (error) throw setErrorMessage(error.message);
  
      setSuccess(true);
      resetForm();

    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
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
          <PlusIcon className="mr-2 h-4 w-4" /> Ajouter un service
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau service</DialogTitle>
        </DialogHeader>
        <ServiceForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          isLoading={loading}
          isSuccess={success}
          errorMessage={errorMessage}
        />
      </DialogContent>
    </Dialog>
  );
}
