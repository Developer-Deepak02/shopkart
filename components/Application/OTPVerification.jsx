import { zSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import ButtonLoading from "./ButtonLoading";
import { Input } from "../ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { showToast } from "@/lib/showToast";
import axios from "axios";

const OTPVerification = ({ email, onSubmit, loading }) => {
	const [isresendingOtp, setIsResendingOtp] = useState(false);
	const formSchema = zSchema.pick({
		otp: true,
		email: true,
	});
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			otp: "",
			email: email,
		},
	});

	const handaleOtpVerification = async (values) => {
		onSubmit(values);
	};

	// resending otp
	const resendOTP = async () => {
		try {
			setIsResendingOtp(true);
			const { data: resendOtpResponse } = await axios.post(
				"/api/auth/resend-otp",
				{email}
			);
			if (!resendOtpResponse.success) {
				throw new Error(resendOtpResponse.message);
			}

			showToast("success", resendOtpResponse.message);
		} catch (error) {
			showToast("error", error.message);
		} finally {
			setIsResendingOtp(false);
		}
	};

	return (
		<div>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handaleOtpVerification)}>
					<div className="text-center">
						<h1 className="text-3xl font-bold mb-2">OTP Verification</h1>
						<p className="text-sm">
							We have sent an one time password (OTP) to your registered email
							address . the OTP is valid for 10 minutes only.
						</p>
					</div>
					<div className="mb-5 mt-5 flex justify-center">
						<FormField
							control={form.control}
							name="otp"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="font-semibold mx-auto">
										One-Time-Password (OTP)
									</FormLabel>
									<FormControl>
										<InputOTP maxLength={6} {...field}>
											<InputOTPGroup>
												<InputOTPSlot className="text-xl size-10" index={0} />
												<InputOTPSlot className="text-xl size-10" index={1} />
												<InputOTPSlot className="text-xl size-10" index={2} />
												<InputOTPSlot className="text-xl size-10" index={3} />
												<InputOTPSlot className="text-xl size-10" index={4} />
												<InputOTPSlot className="text-xl size-10" index={5} />
											</InputOTPGroup>
										</InputOTP>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<div className="mb-5">
						<ButtonLoading
							type={"submit"}
							text={"Verify OTP"}
							loading={loading}
							className={"w-full cursor-pointer"}
						/>
						<div className="text-center mt-5">
            {!isresendingOtp ? (
              <div className="text-sm">
                <span>Didn't receive the OTP? </span>
                <button
                  type="button"
                  className="text-primary cursor-pointer hover:underline"
                  onClick={resendOTP}
                >
                  Resend OTP
                </button>
              </div>
            ) : (
              <div className="text-sm text-gray-500">Resending OTP...</div>
            )}
							
						</div>
					</div>
				</form>
			</Form>
		</div>
	);
};

export default OTPVerification;
