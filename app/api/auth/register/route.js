import { emailVerificationLink } from "@/email/emailVerificationLink";
import { connectToDB } from "@/lib/databaseConnection";
import { catchErrors, response } from "@/lib/helperFunction";
import { sendEmail } from "@/lib/sendMail";
import { zSchema } from "@/lib/zodSchema";
import UserModel from "@/models/User.model";
import { SignJWT } from "jose";

export async function POST(request) {
	try {
		await connectToDB();

		const validationSchema = zSchema.pick({
			name: true,
			email: true,
			password: true,
		});

		const payload = await request.json();
		const validatedData = validationSchema.safeParse(payload);

		if (!validatedData.success) {
			return response(
				false,
				400,
				"Invalid or missing input fields",
				validatedData.error.format()
			);
		}

		const { name, email, password } = validatedData.data;

		// Check if user already exists
		const checkUser = await UserModel.exists({ email });
		if (checkUser) {
			return response(false, 409, "User already exists with this email");
		}

		// Create new user
		const newRegistration = new UserModel({ name, email, password });
		await newRegistration.save();

		// Generate JWT
		const secret = new TextEncoder().encode(process.env.SECRET_KEY);
		const token = await new SignJWT({ userId: newRegistration._id.toString() })
			.setIssuedAt()
			.setExpirationTime("1h")
			.setProtectedHeader({ alg: "HS256" })
			.sign(secret);

		// Send verification email
		await sendEmail(
			"Email Verification",
			email,
			emailVerificationLink(
				`${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`
			)
		);

		return response(
			true,
			200,
			"Registration successful! Please verify your email."
		);
	} catch (error) {
		console.error("Register API Error:", error);
		return response(false, 500, "Internal Server Error", error.message);
	}
}
