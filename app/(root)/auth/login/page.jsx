"use client";
import { Card, CardContent } from "@/components/ui/card";
import React, { useState } from "react";
import Logo from "@/public/assets/logo-black.png";
import Image from "next/image";
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
import { z } from "zod";
import ButtonLoading from "@/components/Application/ButtonLoading";
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa6";
import Link from "next/link";
import { WEBSITE_REGISTER } from "@/routers/WebsiteRoute";
import axios from "axios";
import { showToast } from "@/lib/showToast";
import OTPVerification from "@/components/Application/OTPVerification";

const Loginpage = () => {
	const [loading, setLoading] = useState(false);
	const [otpVerificationLoading, setOtpVerificationLoading] = useState(false);
	const [isTypePassword, setIsTypePassword] = useState(true);
	const [otpEmail, setOtpEmail] = useState();

	const formSchema = zSchema
		.pick({
			email: true,
		})
		.extend({
			password: z.string().min(3, "Password field is required"),
		});

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const handleLoginSubmit = async (values) => {
		try {
			setLoading(true);
			const { data: loginResponse } = await axios.post(
				"/api/auth/login",
				values
			);
			if (!loginResponse.success) {
				throw new Error(loginResponse.message);
			}

			setOtpEmail(values.email);
			form.reset();
			showToast("success", loginResponse.message);
		} catch (error) {
			showToast("error", error.message);
		} finally {
			setLoading(false);
		}
	};

	// otp verification
	const handleOtpVerification = async (values) => {
		try {
			setOtpVerificationLoading(true);
			const { data: otpResponse } = await axios.post(
				"/api/auth/verify-otp",
				values
			);
			if (!otpResponse.success) {
				throw new Error(otpResponse.message);
			}

			setOtpEmail('');
			form.reset();
			showToast("success", otpResponse.message);
		} catch (error) {
			showToast("error", error.message);
		} finally {
			setOtpVerificationLoading(false);
		}

	};
	return (
		<Card className="w-[400px]">
			<CardContent>
				<div className="flex items-center justify-center mb-2">
					<Image src={Logo.src} alt="logo" height={150} width={150} />
				</div>

				{!otpEmail ? (
					<>
						<div className="text-center">
							<h1 className="text-3xl font-bold mb-2">Login into account</h1>
							<p>Login into your account by filling out the form below</p>
						</div>
						<div className="mt-5">
							<Form {...form}>
								<form onSubmit={form.handleSubmit(handleLoginSubmit)}>
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
										<FormField
											control={form.control}
											name="password"
											render={({ field }) => (
												<FormItem className="relative">
													<FormLabel>Password</FormLabel>
													<FormControl>
														<Input
															type={isTypePassword ? "password" : "text"}
															placeholder="***********"
															{...field}
														/>
													</FormControl>
													<button
														type="button"
														onClick={() => setIsTypePassword(!isTypePassword)}
														className="absolute top-1/2 right-2 cursor-pointer"
													>
														{isTypePassword ? <FaRegEyeSlash /> : <FaRegEye />}
													</button>
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
									<div className="mb-5">
										<ButtonLoading
											type={"submit"}
											text={"Login"}
											loading={loading}
											className={"w-full cursor-pointer"}
										/>
									</div>
									<div className="text-center">
										<div className="flex justify-center items-center gap-2">
											<p>Don't have an account?</p>
											<Link
												href={WEBSITE_REGISTER}
												className="text-primary underline"
											>
												Register
											</Link>
										</div>
										<div className="mt-2">
											<Link href={""} className="text-primary underline">
												Forget Password
											</Link>
										</div>
									</div>
								</form>
							</Form>
						</div>
					</>
				) : (
					<>
						<OTPVerification
							email={otpEmail}
							loading={otpVerificationLoading}
							onSubmit={handleOtpVerification}
						/>
					</>
				)}
			</CardContent>
		</Card>
	);
};

export default Loginpage;
