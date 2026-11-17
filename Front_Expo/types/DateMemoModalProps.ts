export interface DateMemoModalProps {
  visible: boolean;
  onClose: () => void;
  memoContent: string;
  setMemoContent: (text: string) => void;
  memoDate: string;
  setMemoDate: (date: string) => void;
  isCalendarVisible: boolean;
  setIsCalendarVisible: (visible: boolean) => void;
  onSubmit: () => void;
  isPending: boolean;
  t: any;
  styles: any;
}