import { Document } from './document';

export interface DocumentModel {
  id: number;
  created_at?: string | null;
  updated_at?: string | null;
  model_name: string;
  model_id: number;
  // Relationships
  document_id: number;
  document?: Document | undefined;
}
