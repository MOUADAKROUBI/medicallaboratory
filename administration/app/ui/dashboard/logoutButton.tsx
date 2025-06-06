"use client";

import React from "react";
import { createClient } from "@/utils/supabase/client";
import { PowerIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const supabase = createClient();
  const route = useRouter();

  const handleLogOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    route.push("/auth/login");
  };

  return (
    <button
      className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
      onClick={handleLogOut}
    >
      <PowerIcon className="w-6" />
      <div className="hidden md:block">Déconnexion</div>
    </button>
  );
}
