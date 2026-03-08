import { z } from "zod";
import { LoginResponse as LoginResponseType } from "@/types";

export const MOBILE_CLIENTId = "mobile-client";

export enum ClientType {
  WEB = "WEB",
  MOBILE = "MOBILE",
}

export const clientTypeSchema = z.nativeEnum(ClientType);

export const loginSchema = z.object({
  email: z.email("Email is not valid"),
  password: z
    .string({ message: "Password is required" })
    .min(8, "Password must be at least 8 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type LoginResponse = LoginResponseType;
