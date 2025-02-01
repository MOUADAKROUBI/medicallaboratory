import React, { Suspense } from "react";
import ServiceCards from "@/app/ui/dashboard/content/serviceCards";
import Header from "@/app/ui/header";
import { ServiceCardSkeleton } from "@/app/ui/skeletons";
import AddNewContent from "@/app/ui/dashboard/content/addNewContent";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

export default function Page() {
  return (
    <main>
      <Header titleSection="gestion du contenu" />

      <div className="h-screen bg-gray-50">
        <div className="flex-1">
          <main className="p-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-2">
                  <PencilSquareIcon className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">gestion du contenu</h2>
                </div>
                <AddNewContent />
              </div>

              {
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Suspense fallback={<ServiceCardSkeleton />}>
                    <ServiceCards />
                  </Suspense>
                </div>
              }
            </div>
          </main>
        </div>
      </div>
    </main>
  );
}
