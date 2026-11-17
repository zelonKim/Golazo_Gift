import { client } from "@/api/client";

export async function deleteAccount() {
  const response = await client.delete("user/me/");
  return response.data;
}
