import { z } from "zod";

export const roleSchema = z.object({
    id: z.uuid().optional(),

    name: z
        .string()
        .min(3, "Name required")
        .max(100, "Name cannot exceed 100 characters"),

    description: z
        .string()
        .optional()
        .nullable()
        .or(z.literal("")),

    isActive: z.boolean().default(true),

    // Audit Fields
    createdAt: z.date().optional().nullable(),
    updatedAt: z.date().optional().nullable(),
    deletedAt: z.date().optional().nullable(),

    createdBy: z.string().uuid().optional().nullable(),
    updatedBy: z.string().uuid().optional().nullable(),
    deletedBy: z.string().uuid().optional().nullable(),
});

export type RoleFormValues = z.infer<typeof roleSchema>;