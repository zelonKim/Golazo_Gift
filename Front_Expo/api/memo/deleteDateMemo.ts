import { client } from "@/api/client"; 

export async function deleteDateMemo(memoId: number) {
  const response = await client.delete(`gift/date-memo/${memoId}/`);
  return response.data;
}
