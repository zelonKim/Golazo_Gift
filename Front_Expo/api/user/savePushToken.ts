import { client } from "@/api/client"; 

export async function savePushToken(token: string) {
  const response = await client.post("user/push-token/", { token });
  return response.data;
}