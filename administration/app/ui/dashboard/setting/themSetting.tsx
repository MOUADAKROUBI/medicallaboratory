"use client";

import { SiteSettings } from "@/app/lib/definitions";
import React, { useEffect, useState } from "react";
import { Card } from "../../card";
import { SunIcon } from "@heroicons/react/24/outline";
import { Label } from "../../label";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export default function ThemSetting({
  setting,
}: Readonly<{
  setting: SiteSettings;
}>) {
  const [theme, setTheme] = useState(setting.theme ?? "light");
  useEffect(() => {
    async function changetheme() {
      if (setting.id) {
        const { error } = await supabase
          .from("parametres_du_site")
          .update({
            ...setting,
            theme: theme,
          })
          .eq("id", setting.id);

        if (error) throw error;
      }
    }

    changetheme();
  }, [theme]);

  return (
    <Card className="p-6">
      {/* Paramètres du thème */}
      <div className="flex items-center gap-2 mb-4">
        <SunIcon className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-medium">Paramètres du thème</h2>
      </div>
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="theme">Thème</Label>
          <select
            id="theme"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="w-full p-2 border rounded-md"
            disabled
          >
            <option value="light">Clair</option>
            <option value="dark">Sombre</option>
            <option value="system">Système</option>
          </select>
        </div>
      </div>
    </Card>
  );
}
