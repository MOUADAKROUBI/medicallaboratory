import React, { Suspense } from "react";
import Header from "@/app/ui/header";
import { LabTestsTable } from "@/app/ui/dashboard/results/labTestsTable";
import { Metadata } from "next";
import {
  ChartBarSquareIcon,
} from "@heroicons/react/24/outline";
import AddNewResult from "@/app/ui/dashboard/results/addNewResultTest";
import { TableSkeleton } from "@/app/ui/skeletons";

export const metadata: Metadata = {
  title: "Résultats d'analyses",
};

const Page = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [testResults, setTestResults] = useState<any[]>([]);

//   useEffect(() => {
//     const fetchTestResults = async () => {
//       try {
//         let query = supabase.from("resultats_analyse").select(`
//               *,
//               patient:patient_id (
//                 code,
//                 utilisateur (
//                   nom
//                 )
//               ),
//               service:service_id (
//                 nom_service
//               )
//             `);

//         if (searchQuery) {
//           query = query.or(
//             `patient.utilisateur.nom.ilike.%${searchQuery}%,service.nom_service.ilike.%${searchQuery}%`
//           );
//         }

//         const { data, error } = await query;
//         if (error) throw error;
//         setTestResults(data);
//       } catch (error) {
//         console.error("Failed to fetch test results:", error);
//       }
//     };

//     fetchTestResults();
//   }, [searchQuery]);

  return (
    <main>
      <Header titleSection="gestion des résultats d'analyses" />
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          <div className="flex-1">
            <main className="p-6">
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <ChartBarSquareIcon className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-semibold">gestion des résultats d'analyses</h2>
                    </div>
                    <AddNewResult />
                  </div>
                  {/* <div className="relative">
                    <MagnifyingGlassCircleIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by patient name or test type..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div> */}
                </div>
                <Suspense fallback={<TableSkeleton />}>
                  <LabTestsTable />
                </Suspense>
              </div>
            </main>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Page;
