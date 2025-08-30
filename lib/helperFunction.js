import { NextResponse } from "next/server";
import { success } from "zod";

// try response helper
export const response = (success, statusCode, message, data = {}) => {
	return NextResponse.json({
		success,
		statusCode,
		message,
		data,
	});
};

// catch errors helper
export const catchErrors = (error, customMessage) => {
	// handling dulicate key error
	if (error.code && error.code === 11000) {
		const keys = Object.keys(error.keypattern).join(", ");
		error.message = `Duplicate fields: ${keys}. these fields must be unique.`;
	}

	let errorObj = {};
	if (process.env.NODE_ENV === "development") {
		errorObj = {
			message: error.message || customMessage || "Something went wrong",
			error,
		};
	} else {
		errorObj = {
			message: customMessage || "Internal server error",
		};
	}

	return NextResponse.json({
		success: false,
		statusCode: error.statusCode || 500,
		...errorObj,
	});
};


// generate random 6 digit otp
export const generateOTP = () => {
	const otp = Math.floor(100000 + Math.random() * 900000).toString();
	return otp;
};
