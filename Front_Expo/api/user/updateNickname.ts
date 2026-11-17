import { client } from "@/api/client";

export async function updateNickname(nickname: string) {
  const response = await client.patch("user/me/", { nickname });
  return response.data;
}
