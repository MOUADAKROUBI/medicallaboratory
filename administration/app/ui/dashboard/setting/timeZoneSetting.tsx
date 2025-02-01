"use client";

import React, { useEffect, useState } from "react";
import { Label } from "../../label";
import { Card } from "../../card";
import { createClient } from "@/utils/supabase/client";
import { SiteSettings } from "@/app/lib/definitions";
import { ClockIcon } from "@heroicons/react/24/outline";

const supabase = createClient();

export default function TimeZoneSetting({
  setting,
}: Readonly<{
  setting: SiteSettings;
}>) {
  const [timezone, setTimezone] = useState(
    setting.timezone ?? "Africa/Casablanca"
  );
  useEffect(() => {
    async function changeTimezone() {
      if (setting.id) {
        const { error } = await supabase
          .from("parametres_du_site")
          .update({
            ...setting,
            timezone: timezone,
          })
          .eq("id", setting.id);

        if (error) throw error;
      }
    }

    changeTimezone();
  }, [timezone]);

  return (
    <Card className="p-6">
      {/* Paramètres de fuseau horaire */}
      <div className="flex items-center gap-2 mb-4">
        <ClockIcon className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-medium">Paramètres de fuseau horaire</h2>
      </div>
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="timezone">Fuseau horaire</Label>
          <select
            id="timezone"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full p-2 border rounded-md"
            disabled
          >
            <option value="Africa/Casablanca">Africa/Casablanca</option>
            <option value="Europe/Paris">Europe/Paris</option>
            <option value="America/New_York">America/New_York</option>
          </select>
        </div>
      </div>
    </Card>
  );
}
