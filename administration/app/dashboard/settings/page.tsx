import React from 'react'
import Header from '@/app/ui/header'
import { CogIcon } from '@heroicons/react/24/outline'
import LangSetting from '@/app/ui/dashboard/setting/langSetting';
import ThemSetting from '@/app/ui/dashboard/setting/themSetting';
import NotifSetting from '@/app/ui/dashboard/setting/notifSetting';
import CurrenSetting from '@/app/ui/dashboard/setting/currenSetting';
import TimeZoneSetting from '@/app/ui/dashboard/setting/timeZoneSetting';
import type { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';

export const metaData: Metadata = {
  title: 'Paramètre du Site'
}

export default async function Page() {
  const supabase = await createClient();

  // Fetch current settings
  const { data: settings, error } = await supabase
    .from('parametres_du_site')
    .select('*')
    .single();
  
  if (error) throw error;

  return (
    <main>
      <Header titleSection="Paramètre du Site" />
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          <div className="flex-1">
            <main className="p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold flex items-center gap-2">
                <CogIcon className="h-6 w-6 text-primary" />
                Settings
              </h1>
              <p className="text-muted-foreground">Manage your application settings</p>
            </div>

            <div className="grid gap-6">
              <LangSetting setting={settings} />

              <ThemSetting setting={settings} />

              <NotifSetting setting={settings} />

              <CurrenSetting setting={settings} />

              <TimeZoneSetting setting={settings} />
            </div>
          </main>
          </div>
        </div>
      </div>
    </main>
  )
}
