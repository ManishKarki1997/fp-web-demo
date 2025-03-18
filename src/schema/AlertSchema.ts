import { z } from 'zod';

export const CreateAlertSchema = z.object({
  name: z.string().min(2,{message:"Name must be at least 2 characters"}),
  keyword: z.string().min(2,{message:"Keyword must be at least 2 characters"}),
  website: z.string().default("tcbscans.me"),
  notifyEmail: z.string().email(),
  sendAttachment: z.boolean().default(true), 
});
