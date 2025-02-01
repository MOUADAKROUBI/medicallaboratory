import { PresentationChartLineIcon } from "@heroicons/react/24/outline";
import { Activity } from "@/app/lib/definitions";
import { createClient } from "@/utils/supabase/server";

const supabase = await createClient();

const RecentActivity = async () => {
  const { data: appointments } = await supabase
    .from("rendez_vous")
    .select(
      `
      id,
      date_rendez_vous,
      patient:patient_id (
        code,
        utilisateur:utilisateur_id (
          nom
        )
      )
    `
    )
    .order("date_rendez_vous", { ascending: false })
    .limit(3);

  const { data: testResults } = await supabase
    .from("resultats_analyse")
    .select(
      `
      id,
      telecharger_date,
      patient:patient_id (
        code,
        utilisateur:utilisateur_id (
          nom
        )
      )
    `
    )
    .order("telecharger_date", { ascending: false })
    .limit(2);

  const { data: stockAlerts } = await supabase.rpc("get_low_stock_items");

  const activities: Activity[] = [
    ...(appointments?.map((app) => ({
      id: `app-${app.id}`,
      title: "Nouveau rendez-vous programmé",
      description: `Patient: ${app.patient?.utilisateur?.nom ?? "Inconnu"} (${
        app.patient?.code
      })`,
      time: new Date(app.date_rendez_vous).toLocaleDateString(),
    })) || []),
    ...(testResults?.map((test) => ({
      id: `test-${test.id}`,
      title: "Résultats de test mis à jour",
      description: `Patient: ${test.patient?.utilisateur?.nom ?? "Inconnu"} (${
        test.patient?.code
      })`,
      time: test.telecharger_date
        ? new Date(test.telecharger_date).toLocaleDateString()
        : "En attente",
    })) || []),
    ...(stockAlerts?.map((item) => ({
      id: `stock-${item.id}`,
      title: "Alerte d'inventaire",
      description: `Stock faible sur ${item.nom_article}`,
      time: `${item.quantity} unités restantes`,
    })) || []),
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  return (
    <div className="w-full bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <PresentationChartLineIcon className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold text-gray-900">Activité Récente</h2>
      </div>
      <div className="space-y-4 bg-white rounded-lg">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-3 group hover:bg-gray-50 p-2 rounded-lg transition-colors"
          >
            <div className="w-2 h-2 mt-2 rounded-full bg-primary/60 group-hover:bg-primary transition-colors" />
            <div>
              <p className="font-medium text-gray-900">{activity.title}</p>
              <p className="text-sm text-gray-600">{activity.description}</p>
              <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
