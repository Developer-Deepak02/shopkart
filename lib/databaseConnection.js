import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

let cached = global.mongoose;

if(!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");  
}

if (!cached) {
	cached = global.mongoose = { conn: null, promise: null };
}

export const connectToDB = async () => {
	if (cached.conn) {
		return cached.conn;
	}
	if (!cached.promise) {
    console.log("MONGODB_URI:", process.env.MONGODB_URI);
		cached.promise = mongoose.connect(MONGODB_URI, {
			dbName: "ShopKart",
			bufferCommands: false,
		});
	}

	cached.conn = await cached.promise;
	return cached.conn;
};
