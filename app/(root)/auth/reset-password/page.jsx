"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zSchema } from "@/lib/zodSchema";
import ButtonLoading from "@/components/Application/ButtonLoading";
import Link from "next/link";
import { WEBSITE_LOGIN } from "@/routers/WebsiteRoute";
import axios from "axios";
import { showToast } from "@/lib/showToast";
import OTPVerification from "@/components/Application/OTPVerification";
import { useDispatch } from "react-redux";
import { login } from "@/store/reducer/authReducer";
import UpdatePassword from "@/components/Application/UpdatePassword";

const ResetPassword = () => {
	const dispatch = useDispatch();

	const [otpVerificationLoading, setOtpVerificationLoading] = useState(false);
	const [emailVerificationLoading, setEmailVerificationLoading] =
		useState(false);
	const [OtpEmail, setOtpEmail] = useState();
	const [isOtpVerified, setIsOtpVerified] = useState(false);

	const formSchema = zSchema.pick({
		email: true,
	});

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
		},
	});

	// Send OTP to user's email
	const handleEmailVerification = async (values) => {
		try {
			setEmailVerificationLoading(true);
			const { data: SendOtpResponse } = await axios.post(
				"/api/auth/reset-password/send-otp",
				values
			);
			if (!SendOtpResponse.success) {
				throw new Error(SendOtpResponse.message);
			}
			setOtpEmail(values.email); // set email to show OTP form
			showToast("success", SendOtpResponse.message);
		} catch (error) {
			showToast(
				"error",
				error.message || "Failed to send OTP. Please try again."
			);
		} finally {
			setEmailVerificationLoading(false);
		}
	};

	// Handle OTP verification
	const handleOtpVerification = async (values) => {
		try {
			setOtpVerificationLoading(true);
			const { data: otpResponse } = await axios.post(
				"/api/auth/reset-password/verify-otp",
				values
			);

			if (!otpResponse.success) {
				throw new Error(otpResponse.message);
			}
			showToast("success", otpResponse.message);
			setIsOtpVerified(true);
			71;
		} catch (error) {
			showToast("error", error.message || "OTP verification failed");
		} finally {
			setOtpVerificationLoading(false);
		}
	};

	return (
		<div>
			<Card className="w-[400px]">
				<CardContent>
					{!OtpEmail ? (
						<>
							<div className="text-center">
								<h1 className="text-3xl font-bold mb-2">Reset Password</h1>
								<p>Enter your email to reset your password</p>
							</div>
							<div className="mt-5">
								<Form {...form}>
									<form onSubmit={form.handleSubmit(handleEmailVerification)}>
										<div className="mb-5">
											<FormField
												control={form.control}
												name="email"
												render={({ field }) => (
													<FormItem>
														<FormLabel>Email</FormLabel>
														<FormControl>
															<Input
																type="email"
																placeholder="example@gmail.com"
																{...field}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>

										<div className="mb-5">
											<ButtonLoading
												type="submit"
												text="Send OTP"
												loading={emailVerificationLoading}
												className="w-full cursor-pointer"
											/>
										</div>
										<div className="text-center">
											<div className="mt-2">
												<Link
													href={WEBSITE_LOGIN}
													className="text-primary underline"
												>
													Back to Login
												</Link>
											</div>
										</div>
									</form>
								</Form>
							</div>
						</>
					) : (
						<>
							{!isOtpVerified ? (
								<OTPVerification
									email={OtpEmail}
									loading={otpVerificationLoading}
									onSubmit={handleOtpVerification}
								/>
							) : (
								<UpdatePassword  email={OtpEmail} />
							)}
						</>
					)}
				</CardContent>
			</Card>
		</div>
	);
};

export default ResetPassword;
