import { client } from "@/api/client";
import { CreateEventDto } from "@/types/CreateEventDto";

export async function createEvent({
  recipientId,
  newEventPayload,
}: {
  recipientId: number;
  newEventPayload: CreateEventDto;
}) {
  const response = await client.post(
    `gift/recipient/${recipientId}/event/`,
    newEventPayload,
  );
  return response.data;
}
