import { Library } from '../settings/library';

export interface DocumentCategory {
  id: number;
  created_at?: string | null;
  updated_at?: string | null;
  code: string;
  name: string;
  // Relationships
  library_id: number;
  library?: Library | undefined;
}
