export interface UserProfile {
  id: number;
  username: string;
  email: string;
  nickname?: string | null;
  recipients?: any[];
}
