import { GenderChoices } from "./GenderChoices";

export interface Recipient {
  id: number;
  name: string;
  gender: GenderChoices; 
  age_group: string;
  mbti?: string | null;
  hobbies?: string | null;
  notes?: string | null;
}
