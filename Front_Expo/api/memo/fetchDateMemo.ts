import { client } from "@/api/client";
import { DateMemo } from "@/types/DateMemo";


export async function fetchDateMemo(): Promise<DateMemo[]> {
  const response = await client.get("gift/date-memo/");
  return response.data;
}
