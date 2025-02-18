"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/app/ui/button";
import { Input } from "@/app/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/ui/select";
import { Label } from "@/app/ui/label";
import { PlusIcon } from "@heroicons/react/24/outline";
import { createClient } from "@/utils/supabase/client";

export default function AddNewResult() {
  const supabase = createClient();

  const [selectedPatient, setSelectedPatient] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  // const { toast } = useToast();
  const [patients, setPatients] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const { data, error } = await supabase.from("patient").select(`
            id,
            code,
            profile:utilisateur_id (
              id,
              nom
            )
          `);
        if (error) throw error;
        setPatients(data);
      } catch (error) {
        console.log(error);
        // toast({
        //   variant: "destructive",
        //   title: "Error",
        //   description: "Failed to fetch patients: " + error.message,
        // });
      }
    };

    const fetchServices = async () => {
      try {
        const { data, error } = await supabase.from("services").select("*");
        if (error) throw error;
        setServices(data);
      } catch (error) {
        console.log(error);
        // toast({
        //   variant: "destructive",
        //   title: "Error",
        //   description: "Failed to fetch services: " + error.message,
        // });
      }
    };

    fetchPatients();
    fetchServices();
  }, []);

  const addResult = async ({
    patientId,
    serviceId,
    file,
  }: {
    patientId: string;
    serviceId: string;
    file: File;
  }) => {
    // Upload file to storage
    const fileExt = file.name.split(".").pop();
    const filePath = `${crypto.randomUUID()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("test_results")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Get the public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("test_results").getPublicUrl(filePath);

    // Save test result record
    const { error } = await supabase.from("resultats_analyse").insert([
      {
        patient_id: patientId,
        service_id: serviceId,
        resultat_test: publicUrl,
        telecharger_date: new Date().toISOString(),
      },
    ]);
    if (error) throw error;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPatient || !serviceId || !pdfFile) {
      // toast({
      //   variant: "destructive",
      //   title: "Error",
      //   description: "Please fill in all fields",
      // });
      return;
    }

    if (!pdfFile.type.includes("pdf")) {
      // toast({
      //   variant: "destructive",
      //   title: "Error",
      //   description: "Please upload a PDF file",
      // });
      return;
    }

    addResult({ patientId: selectedPatient, serviceId, file: pdfFile });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="h-4 w-4 mr-2" />
          Ajouter un nouveau résultat
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau résultat de test</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="patient">Patient</Label>
            <Select value={selectedPatient} onValueChange={setSelectedPatient}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un patient" />
              </SelectTrigger>
              <SelectContent>
                {patients?.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.profile.nom} ({patient.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="service">Type de test</Label>
            <Select value={serviceId} onValueChange={setServiceId}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type de test" />
              </SelectTrigger>
              <SelectContent>
                {services?.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.nom_service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="result">Résultat PDF</Label>
            <Input
              id="result"
              type="file"
              accept=".pdf"
              onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
            />
          </div>
          <Button type="submit" className="w-full">
            Enregistrer le résultat
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
