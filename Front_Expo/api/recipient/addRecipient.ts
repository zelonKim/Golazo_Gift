import { client } from "@/api/client";
import { Recipient } from "@/types/Recipient";

export async function addRecipient(newData: Omit<Recipient, "id">) {
  const response = await client.post("gift/recipient/", newData);
  return response.data;
}
