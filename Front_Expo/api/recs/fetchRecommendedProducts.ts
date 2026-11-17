import { client } from "@/api/client";

export async function fetchRecommendedProducts(eventId: number) {
  const response = await client.get(
    `gift/event/${eventId}/recommended-products/`,
  );
  return response.data;
}
