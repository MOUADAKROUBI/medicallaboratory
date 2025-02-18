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
import { ExclamationCircleIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export function AddNewTeam() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    role: "",
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true)
    try {
      setErrorMessage(null); // Reset error message
  
      if (formData.email && formData.role) {
        const { data: {user}, error: userError } = await supabase.auth.admin.inviteUserByEmail(formData.email)
    
        if (userError) {
          setErrorMessage(userError.message);
          return;
        }
    
        if (formData.role === "admin") {
          const { error: adminError } = await supabase
            .from("administration")
            .insert([
              {
                utilisateur_id: user?.id!,
              },
            ]);
          if (adminError) throw adminError;
        } else if (formData.role === "reception") {
          const { error: receptionError } = await supabase.from("reception").insert([
            {
              utilisateur_id: user?.id!,
            },
          ]);
          if (receptionError) throw receptionError;
        }
    
        setSuccessMessage(`L'invitation a été Envoyer avec succès`)
        setFormData({
          email: "",
          role: "",
        });
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)}>
          <PaperAirplaneIcon className="h-4 w-4 mr-2" />
          Envoyer une invitation
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Envoyer un nouveau invitation</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Label htmlFor="role">Rôle</Label>
            <Select
              value={formData.role}
              onValueChange={(value) =>
                setFormData({ ...formData, role: value })
              }
              required
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
          <Button type="submit" className="w-full" disabled={loading}>
            Envoyer l'invitation
          </Button>
          <div className="flex h-8 items-end space-x-1 text-center">
            {/* Add form errors here */}
            {(errorMessage || successMessage) && (
              <>
                <ExclamationCircleIcon className={`h-5 w-5 ${errorMessage? 'text-red-500' : 'text-green-500'}`} />
                <p className={`text-sm ${errorMessage? 'text-red-500' : 'text-green-500'}`}>{errorMessage ?? successMessage}</p>
              </>
            )}
        </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
