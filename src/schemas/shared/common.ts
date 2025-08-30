import { z } from "zod";

export const dateSchema = z.string().datetime({ offset: true }).brand<"ISO8601">();
export const urlSchema = z.url("Not a valid URL").brand<"Url">();
export const uuidSchema = z.uuid("Not a valid UUID").brand<"Uuid">();
export const nonEmptyStringSchema = z.string().min(1, "String cannot be empty").brand<"NonEmptyString">();

export type DateType = z.infer<typeof dateSchema>;
export type UrlType = z.infer<typeof urlSchema>;
export type UuidType = z.infer<typeof uuidSchema>;