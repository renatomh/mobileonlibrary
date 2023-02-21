import { Document } from './document';
import { User } from '../users/user';

export interface DocumentSharing {
  id: number;
  created_at?: string | null;
  updated_at?: string | null;
  // Relationships
  shared_user_id: number;
  shared_user?: User | undefined;
  document_id: number;
  document?: Document | undefined;
}
