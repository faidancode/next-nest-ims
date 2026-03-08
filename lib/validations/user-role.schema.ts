import { z } from "zod";

export const userRoleSchema = z.object({
    id: z.uuid().optional(),

    userId: z

        .uuid("Invalid user ID"),

    roleId: z

        .uuid("Invalid role ID"),

    // Audit Fields
    createdAt: z.date().optional().nullable(),
    updatedAt: z.date().optional().nullable(),
    deletedAt: z.date().optional().nullable(),

    createdBy: z.uuid().optional().nullable(),
    updatedBy: z.uuid().optional().nullable(),
    deletedBy: z.uuid().optional().nullable(),
});

export type UserRoleFormValues = z.infer<typeof userRoleSchema>;