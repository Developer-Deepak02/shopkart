"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { WEBSITE_HOME, WEBSITE_REGISTER } from "@/routers/WebsiteRoute";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { use, useEffect, useState } from "react";
import verifiedImg from "@/public/assets/verified.gif";
import verificationFailedImg from "@/public/assets/verification-failed.gif";

const EmailVerification = ({ params }) => {
	const { token } = use(params);
	const [isVerified, setIsVerified] = useState(false);
	useEffect(() => {
		const verify = async () => {
			const { data: verificationResponse } = await axios.post(
				"/api/auth/verify-email",
				{ token }
			);
			if (verificationResponse.success) {
				setIsVerified(true);
			}
		};
		verify();
	}, [token]);
	return (
		<Card className="w-[400px]">
			<CardContent>
				{isVerified ? (
					<div>
						<div className="flex items-center justify-center">
							<Image
								src={verifiedImg}
								height={verifiedImg.height}
								width={verifiedImg.width}
								className="h-[100px] w-auto"
								alt="Verified"
							/>
						</div>
						<div className="text-center">
							<h1 className="text-2xl font-bold my-5 text-green-500">
								Email Verified Successfully
							</h1>
							<Button asChild>
								<Link href={WEBSITE_HOME}>Continue Shopping</Link>
							</Button>
						</div>
					</div>
				) : (
					<div>
						<div className="flex items-center justify-center">
							<Image
								src={verificationFailedImg}
								height={verificationFailedImg.height}
								width={verificationFailedImg.width}
								className="h-[100px] w-auto"
								alt="verification failed"
							/>
						</div>
						<div className="text-center">
							<h1 className="text-2xl font-bold my-5 text-red-500">
								Email Verified Failed!
							</h1>
							<Button asChild>
								<Link href={WEBSITE_REGISTER}>
									Try again 
								</Link>
							</Button>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
};

export default EmailVerification;
