import { z } from "zod";

export const CookieResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  access_token_expiration: z.number(),
  refresh_token_expiration: z.number()
})
export type CookieResponse = z.infer<typeof CookieResponseSchema>