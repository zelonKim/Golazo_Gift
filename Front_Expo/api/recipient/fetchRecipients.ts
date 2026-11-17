import { client } from "@/api/client";
import { Recipient } from "@/types/Recipient";

export async function fetchRecipients(): Promise<Recipient[]> {
  const response = await client.get("gift/recipient/");
  return response.data;
}
