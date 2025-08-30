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
import { WEBSITE_LOGIN } from "@/routers/WebsiteRoute";
import axios from "axios";
import { showToast } from "@/lib/showToast";
const RegisterPage = () => {
	const [loading, setLoading] = useState(false);
	const [isTypePassword, setIsTypePassword] = useState(true);

	const formSchema = zSchema
		.pick({
			name: true,
			email: true,
			password: true,
		})
		.extend({
			confirmPassword: z.string(),
		})
		.refine((data) => data.password === data.confirmPassword, {
			message: "Password and Confirm Password must be same",
			path: ["confirmPassword"],
		});

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	const handleRegisterSubmit = async (values) => {
		try {
			setLoading(true);
			const { data: registerResponse } = await axios.post(
				"/api/auth/register",
				values
			);
			if (!registerResponse.success) {
				throw new Error(registerResponse.message);
			}

			form.reset();
			showToast('success', registerResponse.message);

		} catch (error) {
			showToast('error', error.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Card className="w-[400px]">
			<CardContent>
				<div className="flex items-center justify-center mb-2">
					<Image src={Logo.src} alt="logo" height={150} width={150} />
				</div>
				<div className="text-center">
					<h1 className="text-3xl font-bold mb-2">Create account</h1>
					<p>Create new account by filling out the form below</p>
				</div>
				<div className="mt-5">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(handleRegisterSubmit)}>
							<div className="mb-5">
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Full Name</FormLabel>
											<FormControl>
												<Input type="text" placeholder="John Doe" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
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
													type="password"
													placeholder="***********"
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
									name="confirmPassword"
									render={({ field }) => (
										<FormItem className="relative">
											<FormLabel>Confirm Password</FormLabel>
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
									text={"Create Account"}
									loading={loading}
									className={"w-full cursor-pointer"}
								/>
							</div>
							<div className="text-center">
								<div className="flex justify-center items-center gap-2">
									<p>Already have an account?</p>
									<Link href={WEBSITE_LOGIN} className="text-primary underline">
										Login
									</Link>
								</div>
							</div>
						</form>
					</Form>
				</div>
			</CardContent>
		</Card>
	);
};

export default RegisterPage;
