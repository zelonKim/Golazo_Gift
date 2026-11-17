import { client } from "../client";

export async function generateRecommendation(eventId: number) {
  const response = await client.post(`gift/event/${eventId}/recommend/`);
  return response.data.recommendations;
}
