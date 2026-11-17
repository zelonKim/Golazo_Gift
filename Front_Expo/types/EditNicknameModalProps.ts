export interface EditNicknameModalProps {
  visible: boolean;
  onClose: () => void;
  inputNickname: string;
  setInputNickname: (text: string) => void;
  onSubmit: () => void;
  isPending: boolean;
  t: any;
  styles: any;
}
