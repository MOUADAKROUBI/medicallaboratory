import React from "react";
import {
  TableBody,
  TableCell,
  TableRow,
} from "@/app/ui/table";
import { createClient } from "@/utils/supabase/server";
import PatientActions from "./patientActions";

export default async function PatientTable() {
  const supabase = await createClient();

  //   const { toast } = useToast();

  const { data: patients, error: errorP } = await supabase.from("patient")
    .select(`
        *,
        profile: utilisateur_id(
            *
        )
    `);

  if (errorP) throw errorP;

  return (
    <TableBody>
      {patients?.map((patient) => (
        <TableRow key={patient.id}>
          <TableCell>{patient.code}</TableCell>
          <TableCell>{patient?.profile?.nom}</TableCell>
          <TableCell>{patient?.profile?.email}</TableCell>
          <TableCell>{patient?.profile?.telephone}</TableCell>
          <PatientActions patient={patient} />
        </TableRow>
      ))}
    </TableBody>
  );
}
