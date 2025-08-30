import { z } from "zod";
import { WorkoutSchema } from "./workout";
import { dateSchema } from "../shared/common";


const UpdatedEventSchema = z.object({
  type: z.literal("updated"),
  workout: WorkoutSchema
});

const DeletedEventSchema = z.object({
  type: z.literal("deleted"),
  id: z.string(),
  deleted_at: dateSchema
});

const EventSchema = z.discriminatedUnion("type", [
  UpdatedEventSchema,
  DeletedEventSchema,
]);

export const EventsResponseSchema = z.object({
  page: z.number(),
  page_count: z.number(),
  events: z.array(EventSchema),
});

export type EventsResponse = z.infer<typeof EventsResponseSchema>;