import { client } from "@/api/client";

export async function deleteRecipient(id: number) {
  const response = await client.delete(`gift/recipient/${id}/`);
  return response.data;
}
