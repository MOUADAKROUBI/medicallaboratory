import React, { Suspense } from "react";

import Header from "@/app/ui/header";
import { UsersIcon } from "@heroicons/react/24/outline";
import { AddNewTeam } from "@/app/ui/dashboard/users/addNewTeam";
import { TableSkeleton } from "@/app/ui/skeletons";
import TeamTable from "@/app/ui/dashboard/users/teamTable";
import { Metadata } from "next";
import PatientTable from "@/app/ui/dashboard/users/patientTable";

export const metadata: Metadata = {
  title: "gestion des utilisateur",
};

export default function Page() {
  return (
    <main>
      <Header titleSection="gestion des utilisateur" />
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          <div className="flex-1">
            <main className="p-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <UsersIcon className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-semibold">Gestion du utilisateur</h2>
                  </div>
                  <AddNewTeam />
                </div>

                <Suspense fallback={<TableSkeleton />}>
                  <TeamTable />
                </Suspense>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200 mt-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <UsersIcon className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-semibold">Gestion des Patient</h2>
                  </div>
                </div>

                <Suspense fallback={<TableSkeleton />}>
                  <PatientTable />
                </Suspense>
              </div>
            </main>
          </div>
        </div>
      </div>
    </main>
  );
}
