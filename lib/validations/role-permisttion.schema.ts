import { z } from "zod";

export const rolePermissionSchema = z.object({
    id: z.uuid().optional(),

    roleId: z
        .string()
        .uuid("Invalid role ID"),

    permissionId: z
        .string()
        .uuid("Invalid permission ID"),

    // Audit Fields
    createdAt: z.date().optional().nullable(),
    updatedAt: z.date().optional().nullable(),
    deletedAt: z.date().optional().nullable(),

    createdBy: z.uuid().optional().nullable(),
    updatedBy: z.uuid().optional().nullable(),
    deletedBy: z.uuid().optional().nullable(),
});

export type RolePermissionFormValues = z.infer<typeof rolePermissionSchema>;