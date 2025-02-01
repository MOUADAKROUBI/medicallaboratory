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
import ResultActions from "./resultActions";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";

export const LabTestsTable = async () => {
  const supabase = await createClient();

  const { data: testResults, error } = await supabase
    .from("resultats_analyse")
    .select(
      `
        *,
        patient:patient_id (
          code,
          utilisateur:utilisateur_id (
            nom
          )
        ),
        service:service_id (
          nom_service
        )
      `
    )
    .order("telecharger_date", { ascending: false })
    .limit(10);

  if (error) {
    throw error;
  }

  return (
    <div className="bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Patient</TableHead>
            <TableHead>Type de test</TableHead>
            <TableHead>Résultat</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {testResults?.map((result) => (
            <TableRow key={result.id}>
              <TableCell className="font-medium">
                {result.patient?.utilisateur?.nom ?? "Inconnu"} (
                {result.patient?.code})
              </TableCell>
              <TableCell>{result.service?.nom_service}</TableCell>
              <TableCell>
                {result.resultat_test ? (
                  <a 
                    href={result.resultat_test}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-800"
                  >
                    <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                    Voir PDF
                  </a>
                ) : "-"}
              </TableCell>
              <TableCell>
                {result.telecharger_date
                  ? new Date(result.telecharger_date).toLocaleDateString()
                  : "-"}
              </TableCell>

              <ResultActions result={result} />
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
