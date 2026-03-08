import { z } from "zod";

export const rolePermissionSchema = z.object({
    id: z.string().uuid().optional(),

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

    createdBy: z.string().uuid().optional().nullable(),
    updatedBy: z.string().uuid().optional().nullable(),
    deletedBy: z.string().uuid().optional().nullable(),
});

export type RolePermissionFormValues = z.infer<typeof rolePermissionSchema>;