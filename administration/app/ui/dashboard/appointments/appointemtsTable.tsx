"use client";

import React from "react";
// import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/app/ui/skeletons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/ui/table";
import { Button } from "@/app/ui/button";
import { createClient } from "@/utils/supabase/client";
import { formatDateToLocal } from "@/app/lib/utils";
import { ServiceType } from "@/app/lib/definitions";
import {
  ClipboardDocumentCheckIcon,
  ClockIcon,
  TrashIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

const supabase = createClient();

const TableRowSkeleton = () => (
  <TableRow>
    <TableCell>
      <Skeleton className="h-4 w-[100px]" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-[150px]" />
    </TableCell>
    <TableCell>
      <div className="space-y-2">
        <Skeleton className="h-4 w-[200px]" />
        <Skeleton className="h-4 w-[150px]" />
      </div>
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-[100px]" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-[80px]" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-[100px]" />
    </TableCell>
  </TableRow>
);

export default function AppointemtsTable() {
  // const { toast } = useToast();
  const [appointments, setAppointments] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data, error } = await supabase
          .from("rendez_vous")
          .select(
            `
                    *,
                    patient:patient_id (
                        code,
                        utilisateur:utilisateur_id (
                            nom,
                            email,
                            telephone
                        )
                    ),
                    service:service_id (
                        nom_service
                    )
                `
          )
          .order("date_rendez_vous", { ascending: false })
          .limit(5);
        if (error) throw error;
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleStatusChange = async (
    id: string,
    newStatus: "confirmer" | "enAttente" | "annuler"
  ) => {
    try {
      const { error } = await supabase
        .from("rendez_vous")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      // toast({
      //   title: "Status updated",
      //   description: `Appointment status changed to ${newStatus}`,
      // });

      // Refresh appointments data
      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment.id === id
            ? { ...appointment, status: newStatus }
            : appointment
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
      // toast({
      //   variant: "destructive",
      //   title: "Error",
      //   description: "Failed to update appointment status",
      // });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      if (!confirm("Are you sure you want to delete this appointment?")) {
        return;
      }
      const { error } = await supabase
        .from("rendez_vous")
        .delete()
        .eq("id", id);

      if (error) throw error;

      // toast({
      //   title: "Appointment deleted",
      //   description: "The appointment has been successfully deleted",
      // });

      // Refresh appointments data
      setAppointments((prev) =>
        prev.filter((appointment) => appointment.id !== id)
      );
    } catch (error) {
      console.error("Error deleting appointment:", error);
      // toast({
      //   variant: "destructive",
      //   title: "Error",
      //   description: "Failed to delete appointment",
      // });
    }
  };
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Patient</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Service</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <>
            <TableRowSkeleton />
            <TableRowSkeleton />
            <TableRowSkeleton />
          </>
        ) : (
          appointments?.map((appointment) => (
            <TableRow key={appointment.id}>
              <TableCell>
                {formatDateToLocal(appointment.date_rendez_vous)}
              </TableCell>
              <TableCell>
                {appointment.patient?.utilisateur?.nom || "Unknown"}
                <span className="text-gray-500 text-sm ml-1">
                  ({appointment.patient?.code})
                </span>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {appointment.patient?.utilisateur?.email}
                  {appointment.patient?.utilisateur?.telephone && (
                    <div className="text-gray-500">
                      {appointment.patient?.utilisateur?.telephone}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {appointment.service?.nom_service || "Not specified"}
              </TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium
                        ${
                          appointment.status === ServiceType.CONFIRMER &&
                          "bg-green-100 text-green-800"
                        }
                        ${
                          appointment.status === ServiceType.ANNULER &&
                          "bg-red-100 text-red-800"
                        } 
                        ${
                          appointment.status === ServiceType.ENATTENTE &&
                          "bg-yellow-100 text-yellow-800"
                        }}`}
                >
                  {appointment.status || "enAttente"}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      handleStatusChange(appointment.id, ServiceType.CONFIRMER)
                    }
                    className="h-8 w-8 text-green-600 hover:text-green-700"
                  >
                    <ClipboardDocumentCheckIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      handleStatusChange(appointment.id, ServiceType.ANNULER)
                    }
                    className="h-8 w-8 text-red-600 hover:text-red-700"
                  >
                    <XCircleIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      handleStatusChange(appointment.id, ServiceType.ENATTENTE)
                    }
                    className="h-8 w-8 text-yellow-600 hover:text-yellow-700"
                  >
                    <ClockIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(appointment.id)}
                    className="h-8 w-8 text-gray-600 hover:text-gray-700"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
