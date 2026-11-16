export const toDisplayValue = (value: number | string) => {
  if (value === 0 || value === "0") return "";
  const num = String(value).replace(/[^0-9]/g, "");
  return num ? Number(value).toLocaleString() : "";
};
