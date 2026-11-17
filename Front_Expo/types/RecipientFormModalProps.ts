import { GenderChoices } from "./GenderChoices";
import { Recipient } from "./Recipient";

export interface RecipientFormModalProps {
  visible: boolean;
  onClose: () => void;
  editingRecipient: Recipient | null;
  name: string;
  setName: (text: string) => void;
  gender: string;
  setGender: (gender: GenderChoices) => void;
  ageGroup: string;
  setAgeGroup: (age: string) => void;
  hobbies: string;
  setHobbies: (text: string) => void;
  notes: string;
  setNotes: (text: string) => void;
  onSubmit: () => void;
  isPending: boolean;
  t: any;
  ageGroupsList: string[];
  styles: any;
}
