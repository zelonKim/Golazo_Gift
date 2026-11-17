export const getGenderLabel = (g: string, t: any) => {
  if (g === "M") return t.genderMaleShort;
  if (g === "F") return t.genderFemaleShort;
  if (g === "N") return t.genderNonbinaryShort;
  return t.genderPrivateShort;
};
