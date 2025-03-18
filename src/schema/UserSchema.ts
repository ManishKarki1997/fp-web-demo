import { z } from 'zod';

export const UserRegistrationSchema = z.object({
  name: z.string(),
  avatar: z.string().optional(),
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be minimum 8 characters" })
    .max(32, { message: "Password must be maximum 32 characters" }),
});

export const UserLoginSchema = z.object({  
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be minimum 8 characters" })
    .max(32, { message: "Password must be maximum 32 characters" }),
});

export const UpdateUserSchema = z.object({
  name: z.string(),
  avatar: z.string().optional(),
  email: z.string().email(),
  password: z
  .string()
  .optional() 
  .refine((val) => !val || (val.length >= 8 && val.length <= 32), {
    message: "Password must be between 8 and 32 characters if provided",
  }),
});