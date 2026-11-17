import { NewMemoDto } from "@/types/NewMemoDto";
import { client } from "../client";

export async function addDateMemo(newMemo: NewMemoDto) {
  const response = await client.post("gift/date-memo/", newMemo);
  return response.data;
}
