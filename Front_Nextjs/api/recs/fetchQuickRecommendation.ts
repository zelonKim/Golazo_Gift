import { Product } from "@/types/Product";
import { RecommendRequest } from "@/types/RecommendRequest";
import { client } from "../client";

export const fetchQuickRecommendation = async (
  payload: RecommendRequest,
): Promise<Product[]> => {
  const response = await client.post("gift/quick/recommend/", payload);
  return response.data.recommendations || [];
};
