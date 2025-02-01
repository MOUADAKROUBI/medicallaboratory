import React from "react";
import Header from "@/app/ui/header";
import AppointemtsTable from "@/app/ui/dashboard/appointments/appointemtsTable";
import { CalendarIcon } from "@heroicons/react/24/outline";

export default function Page() {
  return (
    <main>
      <Header titleSection="gestion des rendez-vous" />
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          <div className="flex-1">
            <main className="p-6">
              <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">
                    Rendez-vous récents
                  </h2>
                </div>

                <AppointemtsTable />
              </div>
            </main>
          </div>
        </div>
      </div>
    </main>
  );
}
