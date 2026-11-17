export interface RecommendRequest {
  purpose: string;
  age_group: string;
  gender: string;
  min_budget: number;
  max_budget: number;
  hobbies: string | null;
  notes: string | null;
}
