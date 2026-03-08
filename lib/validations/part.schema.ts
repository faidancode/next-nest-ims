import { z } from "zod";

export const partTypeEnum = z.enum(["RAW", "FINISHED"]);

export const partSchema = z.object({
  partNumber: z.string().min(1, "Part number is required").max(100),
  name: z.string().min(1, "Name is required").max(255),
  description: z.string().optional().or(z.literal("")),
  type: partTypeEnum,
  unit: z.string().min(1, "Unit is required").max(50),
});

export type PartFormValues = z.infer<typeof partSchema>;