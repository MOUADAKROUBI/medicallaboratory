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
    profile: {
      nom: string;
    };
  };
  service: {
    nom_service: string;
  };
}

export interface Patient {
  address: string | null;
  adomicile: boolean;
  code: string;
  id: string;
  utilisateur_id: string;
  profile: {
    email: string | null;
    id: string;
    nom: string | null;
    telephone: string | null;
  };
}

export interface ServiceFormProps {
  formData: {
    nom_service: string;
    description: string;
    prix: string;
    image: File | null;
  };
  setFormData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  isEditing?: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  errorMessage?: string | null;
}

export interface SiteSettings {
  id: string;
  lang: string | null;
  theme: string | null;
  notifications: boolean | null;
  default_currency: string | null;
  timezone: string | null;
}