import { Country } from './country';

export interface City {
  id: number;
  created_at?: string | null;
  updated_at?: string | null;
  name: string;
  uf: string;
  country_id: number;
  country?: Country | undefined;
}
