export const toRefineNumber = (text: string) => {
  const cleanNumber = text.replace(/[^0-9]/g, ""); // 쉼표 및 문자 제거
  if (!cleanNumber) return 0;

  const num = Number(cleanNumber);
  return num > 999999 ? 999999 : num; 
};
