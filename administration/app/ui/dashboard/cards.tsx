import {
  ClockIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  ChartBarSquareIcon,
} from "@heroicons/react/24/outline";
import { lusitana } from "@/app/ui/fonts";
import { fetchCardData } from "@/app/lib/data";
import { CardDefinition, TypeCard } from "@/app/lib/definitions";

const iconMap = {
  totalAppointemt: CalendarDaysIcon,
  appointmentAtt: ClockIcon,
  totalResults: ChartBarSquareIcon,
  totalTeam: UserGroupIcon,
};

export default async function CardWrapper() {
  const { totalAppointemt, appointmentAtt, totalResults, totalTeam } =
    await fetchCardData();

  return (
    <>
      <Card
      title={"Total des Rendez-vous"}
      value={totalAppointemt}
      type={TypeCard.TOTALAPPOINTEMT}
      />
      <Card
      title="Rendez-vous en Attente"
      value={appointmentAtt}
      type={TypeCard.APPOINTMENTATT}
      />
      <Card
      title="Total des Résultats"
      value={totalResults}
      type={TypeCard.TOTALRESULTS}
      />
      <Card
      title="Total des Équipes"
      value={totalTeam}
      type={TypeCard.TOTALTEAM}
      />
    </>
  );
}

export function Card({ title, value, type }: Readonly<CardDefinition>) {
  const Icon = iconMap[type];

  return (
    <div
      className={`
      rounded-lg p-2 shadow-sm hover:shadow-md transition-shadow duration-200
      ${type === TypeCard.TOTALRESULTS ? "bg-green-100 text-green-800" : ""}
      ${type === TypeCard.TOTALAPPOINTEMT ? "bg-red-100 text-red-800" : ""}
      ${type === TypeCard.APPOINTMENTATT ? "bg-yellow-100 text-yellow-800" : ""}
      ${type === TypeCard.TOTALTEAM ? "bg-blue-100 text-blue-800" : ""}`}
    >
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}
