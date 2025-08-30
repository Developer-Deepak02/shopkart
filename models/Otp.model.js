import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
		},
		otp: {
			type: String,
			required: true,
		},
		expiredAt: {
			type: Date,
			required: true,
			default: () => Date.now() + 10 * 60 * 1000, // 10 minutes from now
		},
	},
	{ timestamps: true }
);

otpSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });
const OTPModel =
	mongoose.models.OTP || mongoose.model("OTP", otpSchema, "otps");
export default OTPModel;
