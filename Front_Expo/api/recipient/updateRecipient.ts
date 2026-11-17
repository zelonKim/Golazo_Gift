import { client } from "@/api/client";
import { Recipient } from "@/types/Recipient";

export async function updateRecipient({
  id,
  updatedData,
}: {
  id: number;
  updatedData: Partial<Recipient>;
}) {
  const response = await client.patch(`gift/recipient/${id}/`, updatedData);
  return response.data;
}
