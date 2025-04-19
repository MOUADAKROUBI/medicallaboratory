import CardWrapper from "@/app/ui/dashboard/cards";
import DataChart from "@/app/ui/dashboard/dataChart";
import RecentActivity from "@/app/ui/dashboard/recentActivity";
import { Suspense } from "react";
import { CardSkeleton, DataChartSkeleton, RecentActivityListSkeleton } from "@/app/ui/skeletons";
import Header from "@/app/ui/header";
import { fetchMonthlyAppointments } from "@/app/lib/data";

export default async function Page() {
  const monthlyAppointments = await fetchMonthlyAppointments();

  if (!monthlyAppointments || monthlyAppointments.length === 0) {
    return <p className="mt-4 text-gray-400">No data available.</p>;
  }

  return (
    <main>
      <Header titleSection="Tableau de bord" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>
      <div className="mt-6 flex gap-6 flex-col md:flex-row">
        <Suspense fallback={<DataChartSkeleton />}>
          <DataChart />
        </Suspense>
        <Suspense fallback={<RecentActivityListSkeleton />}>
          <RecentActivity />
        </Suspense>
      </div>
    </main>
  );
}
