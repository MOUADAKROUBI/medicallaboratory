"use client";

import React, { useState, useEffect } from 'react'
import { Label } from "../../label";
import { Card } from "../../card";
import { createClient } from "@/utils/supabase/client";
import { SiteSettings } from '@/app/lib/definitions';
import { BellIcon } from '@heroicons/react/24/outline';
import { Switch } from '../../switch';

const supabase = createClient();

export default function NotifSetting({
    setting,
  }: Readonly<{
    setting: SiteSettings;
  }>) {
  const [notifications, setNotifications] = useState(setting.notifications ?? true);

  useEffect(() => {
    async function changeNotif() {
      if (setting.id) {
        const { error } = await supabase
          .from("parametres_du_site")
          .update({
            ...setting,
            notifications: notifications,
          })
          .eq("id", setting.id);

        if (error) throw error;
      }
    }

    changeNotif();
  }, [notifications]);

  return (
    <Card className="p-6">
        {/* Paramètres de notification */}
        <div className="flex items-center gap-2 mb-4">
            <BellIcon className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-medium">Paramètres de notification</h2>
        </div>
        <div className="flex items-center space-x-2">
            <Switch
            id="notifications"
            checked={notifications}
            onCheckedChange={setNotifications}
            />
            <Label htmlFor="notifications">Activer les notifications</Label>
        </div>
    </Card>
  )
}
