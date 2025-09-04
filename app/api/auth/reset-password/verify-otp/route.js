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

   

    // remove otp after verification
    await getOtpData.deleteOne();

    return response(true, 200, "OTP verified successfully.");
  } catch (error) { 
    return catchErrors(error);
  }
}
