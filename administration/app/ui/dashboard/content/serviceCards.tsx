import React from "react";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";
import ServiceActions from "./serviceActions";

export default async function ServiceCards() {
  const supabase = await createClient();

  const { data: services, error } = await supabase
    .from("services")
    .select("*")
    .order("nom_service", { ascending: true });

  if (error) throw error;

  return (
    <>
      {services?.map((service) => (
        <div
          key={service.id}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
        >
          {service.image && (
            <Image
              src={service.image}
              alt={service.nom_service}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
          )}
          <h3 className="font-medium text-gray-900">{service.nom_service}</h3>
          <div
            className="text-sm text-gray-500 mt-1 prose prose-sm"
            dangerouslySetInnerHTML={{ __html: service.description ?? "" }}
          />
          <div className="mt-4 flex items-center justify-between">
            <span className="text-primary font-medium">{service.prix} DH</span>
            
            <ServiceActions service={service} />
          </div>
        </div>
      ))}
    </>
  );
}
