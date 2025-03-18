import { z } from 'zod';

export const CreateEntitySchema = z.object({
  name: z.string().min(2,{message:"Name must be at least 2 characters"}),
  email:z.union( [
    z.literal( '' ),
    z.string().email(),
] ),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),  
});
