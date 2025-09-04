import { otpEmail } from "@/email/otpEmail";
import { connectToDB } from "@/lib/databaseConnection";
import { catchErrors, generateOTP, response } from "@/lib/helperFunction";
import { sendEmail } from "@/lib/sendMail";
import { zSchema } from "@/lib/zodSchema";
import OTPModel from "@/models/Otp.model";
import UserModel from "@/models/User.model";

export async function POST(request) {
  try {
		await connectToDB();
		const payload = await request.json();
		const validationSchema = zSchema.pick({
			email: true,
		});

		const validateData = validationSchema.safeParse(payload);
		if (!validateData.success) {
			return response(
				false,
				401,
				"Invalid or missing input fields",
				validateData.error
			);
		}

		const { email } = validateData.data;
		const getUser = await UserModel.findOne({ deletedAt: null, email }).lean();
		if (!getUser) {
			return response(false, 404, "User not found with this email");
		}

		// remove old otps
		await OTPModel.deleteMany({ email });
		const otp = generateOTP();
		const newOtpData = new OTPModel({
			email,
			otp,
		});

		await newOtpData.save();
		// send otp email
		const otpSendStatus = await sendEmail(
			"Your login verification code",
			email,
			otpEmail(otp)
		);

		if (!otpSendStatus.success) {
			return response(
				false,
				500,
				"Failed to send OTP email. Please try again later."
			);
		}
		return response(true, 200, "OTP sent successfully to your email.");
	} catch (error) {
    catchErrors(error);
  }
}