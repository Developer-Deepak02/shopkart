import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const uri = process.env.MONGODB_URI;
		if (!uri) {
			throw new Error("MONGODB_URI is not defined in .env.local");
		}

		await mongoose.connect(uri, {
			dbName: "ShopKart", 
		});

		return NextResponse.json({
			success: true,
			message: "Connected to database",
		});
	} catch (error) {
		console.error("DB Connection Error:", error);
		return NextResponse.json(
			{ success: false, message: error.message },
			{ status: 500 }
		);
	}
}
