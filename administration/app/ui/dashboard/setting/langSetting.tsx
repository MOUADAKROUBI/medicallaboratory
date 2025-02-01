"use client";

import React, { useEffect, useState } from "react";
import { Label } from "../../label";
import { Card } from "../../card";
import { createClient } from "@/utils/supabase/client";
import { SiteSettings } from "@/app/lib/definitions";
import { GlobeAltIcon } from "@heroicons/react/24/outline";

const supabase = createClient();

export default function LangSetting({
  setting,
}: Readonly<{
  setting: SiteSettings;
}>) {
  const [language, setLanguage] = useState<string>(setting.lang ?? "fr");

  useEffect(() => {
    async function changeLang() {
      if (setting.id) {
        const { error } = await supabase
          .from("parametres_du_site")
          .update({
            ...setting,
            lang: language,
          })
          .eq("id", setting.id);

        if (error) throw error;
      }
    }

    changeLang();
  }, [language]);

  return (
    <Card className="p-6">
      {/* Paramètres de langue */}
      <div className="flex items-center gap-2 mb-4">
      <GlobeAltIcon className="h-5 w-5 text-primary" />
      <h2 className="text-lg font-medium">Paramètres de langue</h2>
      </div>
      <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="language">Langue par défaut</Label>
        <select
        id="language"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="w-full p-2 border rounded-md"
        disabled
        >
        <option value="fr">Français</option>
        <option value="en">English</option>
        <option value="ar">العربية</option>
        </select>
      </div>
      </div>
    </Card>
  );
}
