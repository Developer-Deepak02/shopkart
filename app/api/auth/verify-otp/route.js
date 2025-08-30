import { connectToDB } from "@/lib/databaseConnection";
import { catchErrors, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import OTPModel from "@/models/Otp.model";
import UserModel from "@/models/User.model";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

export async function POST(request) {
	try {
		await connectToDB();
		const payload = await request.json();
		const validationSchema = zSchema.pick({
			otp: true,
			email: true,
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

		const { otp, email } = validateData.data;
		const getOtpData = await OTPModel.findOne({ email, otp });
		if (!getOtpData) {
			return response(false, 400, "Invalid OTP.");
		}
		const getUser = await UserModel.findOne({ deletedAt: null, email }).lean();
		if (!getUser) {
			return response(false, 400, "User not found.");
		}

		const loggedInUserData = {
			_id: getUser._id,
			name: getUser.name,
			email: getUser.email,
			role: getUser.role,
			avatar: getUser.avatar,
		};

		const sercret = new TextEncoder().encode(process.env.SECRET_KEY);
		const token = await new SignJWT({ loggedInUserData })
			.setIssuedAt()
			.setExpirationTime("7d")
			.setProtectedHeader({ alg: "HS256" })
			.sign(sercret);

		const cookieStore = await cookies();
		cookieStore.set({
			name: "accessToken",
			value: token,
			httpOnly: process.env.NODE_ENV === "production",
			path: "/",
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
		});

		// remove otp after verification
		await getOtpData.deleteOne();

		return response(true, 200, "OTP verified successfully.", loggedInUserData);
	} catch (error) { 
		return catchErrors(error);
	}
}
