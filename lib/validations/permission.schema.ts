import { z } from "zod";

export const permissionSchema = z.object({
    id: z.string().uuid().optional(),

    name: z
        .string()
        .min(3, "Name required")
        .max(150, "Name cannot exceed 150 characters"),

    action: z.enum(
        ["CREATE", "READ", "UPDATE", "DELETE", "APPROVE", "EXPORT", "IMPORT"],
        {
            error: () => ({ message: "Invalid action type" }),
        }
    ),

    resource: z
        .string()
        .min(1, "Resource required")
        .max(100, "Resource cannot exceed 100 characters"),

    description: z
        .string()
        .optional()
        .nullable()
        .or(z.literal("")),

    // Audit Fields
    createdAt: z.date().optional().nullable(),
    updatedAt: z.date().optional().nullable(),
    deletedAt: z.date().optional().nullable(),

    createdBy: z.string().uuid().optional().nullable(),
    updatedBy: z.string().uuid().optional().nullable(),
    deletedBy: z.string().uuid().optional().nullable(),
});

export type PermissionFormValues = z.infer<typeof permissionSchema>;