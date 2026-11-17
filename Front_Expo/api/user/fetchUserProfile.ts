import { UserProfile } from "@/types/UserProfile";
import { client } from "../client";

export async function fetchUserProfile(): Promise<UserProfile> {
  const response = await client.get("user/me/");
  return response.data;
}
