export type User = {
  address: string | null;
  email: string;
  id: string;
  nom: string | null;
  password: string;
  telephone: number | null;
};

export enum TypeCard {
  TOTALAPPOINTEMT = 'totalAppointemt',
  APPOINTMENTATT = 'appointmentAtt',
  TOTALRESULTS = 'totalResults',
  TOTALTEAM = 'totalTeam',
}

export type CardDefinition = {
  title: string;
  value: number | string;
  type: TypeCard;
}

export enum ServiceType {
  CONFIRMER = 'confirmer',
  ENATTENTE = 'enAttente',
  ANNULER = 'annuler',
}

export type Appointment = {
  id: string;
  patient_id: string;
  date_rendez_vous: string;
  service_id: string;
  status: ServiceType;
}

export type MonthlyAppointment = {
  countapp: number | null;
  month: string | null;
  month_name: string | null;
}

export type Activity = {
  id: string;
  title: string;
  description: string;
  time: string;
};

export interface TestResult {
  id: string;
  patient_id: string;
  service_id: string;
  resultat_test: string | null;
  telecharger_date: string | null;
  patient: {
    code: string;
    utilisateur: {
      nom: string;
    };
  };
  service: {
    nom_service: string;
  };
}

export interface Patient {
  code: string;
  id: string;
  utilisateur_id: string | null;
  utilisateur: {
      address: string | null;
      email: string;
      id: string;
      nom: string | null;
      telephone: number | null;
  } | null;
}

export interface SiteSettings {
  id: string;
  lang: string | null;
  theme: string | null;
  notifications: boolean | null;
  default_currency: string | null;
  timezone: string | null;
}