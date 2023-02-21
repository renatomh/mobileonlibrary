import { Library } from '../settings/library';
import { User } from '../users/user';
import { DocumentCategory } from './document_category';

export interface Document {
  id: number;
  created_at?: string | null;
  updated_at?: string | null;
  code: string;
  description: string;
  observations: string | null;
  expires_at: string | null;
  alert_email: string | null;
  alert: 0 | 1;
  days_to_alert: number;
  // File
  file_url: string;
  file_name: string;
  file_content_type: string;
  file_size: string;
  file_updated_at: string;
  file_thumbnail_url: string | null;
  file_thumbnail_file_size: string | null;
  // Relationships
  library_id: number;
  library?: Library | undefined;
  user_id: number;
  user?: User | undefined;
  document_category_id: number | null;
  document_category?: DocumentCategory | undefined;
}
