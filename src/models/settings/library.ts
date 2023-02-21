import { City } from './city';

export interface Library {
  id: number;
  created_at?: string | null;
  updated_at?: string | null;
  name: string;
  cnpj: string | null;
  cpf: string | null;
  city_id: number | null;
  city?: City | undefined;
}
