import { z } from "zod";

export const zSchema = z.object({
	email: z.string().email({ message: "Invalid email" }),

	name: z
		.string()
		.min(3, { message: "Name must be at least 3 characters long" })
		.max(64, { message: "Name must be at most 64 characters long" })
		.regex(/^[a-zA-Z\s]+$/, {
			message: "Name can only contain letters and spaces",
		}),

	password: z
		.string()
		.min(8, { message: "Password must be at least 8 characters long" })
		.max(64, { message: "Password must be at most 64 characters long" })
		.regex(/[A-Z]/, {
			message: "Password must contain at least one uppercase letter",
		})
		.regex(/[a-z]/, {
			message: "Password must contain at least one lowercase letter",
		})
		.regex(/[0-9]/, { message: "Password must contain at least one number" })
		.regex(/[^a-zA-Z0-9]/, {
			message: "Password must contain at least one special character",
		}),

	otp: z.string().regex(/^\d{6}$/, { message: "OTP must be a 6-digit number" }),
});
