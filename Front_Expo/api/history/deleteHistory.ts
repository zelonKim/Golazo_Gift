import { client } from "@/api/client";

export async function deleteHistory(eventId: number) {
  const response = await client.delete(`gift/event/${eventId}/`);
  return response.data;
}
