import { User } from '../users/user';

export interface Notification {
  id: number;
  created_at?: string | null;
  updated_at?: string | null;
  title: string;
  description: string;
  web_action: string | null;
  mobile_action: string | null;
  read_at: string | null;
  user_id: number;
  user?: User;
  is_read: 0 | 1;
}
