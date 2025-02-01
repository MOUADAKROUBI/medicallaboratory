"use client";

import React, { useEffect, useState } from "react";
import { Label } from "../../label";
import { Card } from "../../card";
import { createClient } from "@/utils/supabase/client";
import { SiteSettings } from "@/app/lib/definitions";
import { CurrencyDollarIcon } from "@heroicons/react/24/outline";

const supabase = createClient();

export default function CurrenSetting({
  setting,
}: Readonly<{
  setting: SiteSettings;
}>) {
  const [currency, setCurrency] = useState(setting.default_currency ?? "MAD");

  useEffect(() => {
    async function changeCurrency() {
      if (setting.id) {
        const { error } = await supabase
          .from("parametres_du_site")
          .update({
            ...setting,
            default_currency: currency,
          })
          .eq("id", setting.id);

        if (error) throw error;
      }
    }

    changeCurrency();
  }, [currency]);

  return (
    <Card className="p-6">
      {/* Paramètres de devise */}
      <div className="flex items-center gap-2 mb-4">
        <CurrencyDollarIcon className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-medium">Paramètres de devise</h2>
      </div>
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="currency">Devise par défaut</Label>
          <select
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full p-2 border rounded-md"
            disabled
          >
            <option value="MAD">MAD (Dirham marocain)</option>
            <option value="USD">USD (Dollar américain)</option>
            <option value="EUR">EUR (Euro)</option>
          </select>
        </div>
      </div>
    </Card>
  );
}
