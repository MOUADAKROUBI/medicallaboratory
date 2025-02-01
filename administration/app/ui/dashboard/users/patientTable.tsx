import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/ui/table";
import { createClient } from "@/utils/supabase/server";
import PatientActions from "./patientActions";

export default async function PatientTable() {
  const supabase = await createClient();
  
  //   const { toast } = useToast();

  const { data: patients, error: errorP } = await supabase
    .from("patient")
    .select(`
        *,
        utilisateur: utilisateur_id(
            *
        )
    `);

  if (errorP) throw errorP;

  return (
    <div className="relative overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Nom</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Téléphone</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients?.map((patient) => (
            <TableRow key={patient.id}>
              <TableCell>{patient.code}</TableCell>
              <TableCell>{patient?.utilisateur?.nom}</TableCell>
              <TableCell>{patient?.utilisateur?.email}</TableCell>
              <TableCell>0{patient?.utilisateur?.telephone}</TableCell>
              <PatientActions patient={patient} />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
