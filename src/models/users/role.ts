export interface Role {
  id: number;
  created_at?: string | null;
  updated_at?: string | null;
  name: string;
  web_actions?: Array<string> | undefined;
  mobile_actions?: Array<string> | undefined;
}
