import { emailVerificationLink } from "@/email/emailVerificationLink";
import { otpEmail } from "@/email/otpEmail";
import { connectToDB } from "@/lib/databaseConnection";
import { catchErrors, generateOTP, response } from "@/lib/helperFunction";
import { sendEmail } from "@/lib/sendMail";
import { zSchema } from "@/lib/zodSchema";
import UserModel from "@/models/User.model";
import { SignJWT } from "jose";
import z from "zod";
import bcrypt from "bcryptjs";
import OTPModel from "@/models/Otp.model";


export async function POST(request) {
	try {
		await connectToDB();
		const payload = await request.json();

		const validationSchema = zSchema
			.pick({
				email: true,
			})
			.extend({
				password: z.string(),
			});

		const validateData = validationSchema.safeParse(payload);
		if (!validateData.success) {
			return response(
				false,
				401,
				"Invalid or missing input feild.",
				validateData.error
			);
		}

		const { email, password } = validateData.data;

		// get user data from db
		const getUser = await UserModel.findOne({ deletedAt : null , email }).select("+password");
		if (!getUser) {
			return response(false, 400, "Invalid email or password.");
		}
		// resend verification email if not verified
		if (!getUser.isEmailVerified) {
			// Generate JWT
			const secret = new TextEncoder().encode(process.env.SECRET_KEY);
			const token = await new SignJWT({
				userId: getUser._id.toString(),
			})
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
				false,
				401,
				"Your email is not verified. We have sent you the verification email again please verify your email."
			);
		}

		
		// compare password
		const isPasswordVarified = await getUser.comparePassword(password);

		if (!isPasswordVarified) {
			return response(false, 400, "Invalid email or password.");
		}

		// OTP generation

		await OTPModel.deleteMany({ email }); // Delete any existing OTPs for the email
		const otp = generateOTP();

		// Save OTP to database
		const mewOtpData = new OTPModel({
			email,
			otp,
		});

		await mewOtpData.save();

		const otpEmailStatus = await sendEmail(
			"Your Login verification code",
			email,
			otpEmail(otp)
		);

		if (!otpEmailStatus.success) {
			return response(
				false,
				500,
				"Failed to send OTP email. Please try again."
			);
		}
		return response(
			true,
			200,
			"OTP sent to your email. Please verify to login."
		);
	} catch (error) {
		return catchErrors(error);
	}
}
