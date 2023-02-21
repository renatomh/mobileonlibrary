import { Role } from './role';
import { Library } from '../settings/library';

export interface User {
  id: number;
  created_at?: string | null;
  updated_at?: string | null;
  name: string;
  username: string;
  email: string | null;
  avatar_url: string | null;
  avatar_thumbnail_url: string | null;
  socketio_sid: string | null;
  fcm_token: string | null;
  unread_notifications_count: number;
  last_login_at: string | null;
  // Status flags
  is_active: 0 | 1;
  is_verified: 0 | 1;
  // Relationships
  role_id: number;
  role?: Role | undefined;
  library_id: number | null;
  library?: Library | undefined;
}
