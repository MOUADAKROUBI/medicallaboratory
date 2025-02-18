import { MonthlyAppointment } from './definitions';
import { createClient } from '@/utils/supabase/server';

const supabase = await createClient();

export async function fetchMonthlyAppointments(): Promise<MonthlyAppointment[]> {
  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)
    const { data, error } = await supabase
    .from('monthly_appointments')
    .select('*');

    if (error) {
      console.error('Error fetching data:', error);
      throw new Error('Failed to fetch appointments data.');
    }
    return data;
    
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch appointments data.');
  }
}

export async function fetchCardData() {
  try {
    const totalAppointment = await supabase.from('rendez_vous').select('*', {head: true, count: "exact"});
    const appointmentAtt = await supabase.from('rendez_vous').select('status', {head: true, count: 'exact'}).eq('status', 'enAttente');
    const totalResults = await supabase.from('resultats_analyse').select('*', {head: true, count: 'exact'});
    const totaladmin = await supabase.from('administration').select('*', {head: true, count: 'exact'});
    const totalsecu = await supabase.from('reception').select('*', {head: true, count: 'exact'});
    const totalTeam = (totaladmin.count ?? 0)+(totalsecu.count ?? 0);

    return {
      totalAppointemt: totalAppointment.count ?? 0,
      appointmentAtt: appointmentAtt.count ?? 0,
      totalResults: totalResults.count ?? 0,
      totalTeam: totalTeam,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

