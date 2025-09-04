import { connectToDB } from "@/lib/databaseConnection";
import { catchErrors, response } from "@/lib/helperFunction";
import { zSchema } from "@/lib/zodSchema";
import UserModel from "@/models/User.model";

export async function PUT(request) {
	try {
		await connectToDB();
		const payload = await request.json();
		const validationSchema = zSchema.pick({
			email: true,
			password: true,
		});

		const validateData = validationSchema.safeParse(payload);
		if (!validateData.success) {
			return response(
				false,
				401,
				"Invalid or missing input fields",
				validateData.error
			);
		}
		const { email, password } = validateData.data;
		const getUser = await UserModel.findOne({ deletedAt: null, email }).select(
			"+password"
		);
		if (!getUser) {
			return response(false, 404, "User not found with this email");
		}

		getUser.password = password;
		await getUser.save();
		return response(true, 200, "Password updated successfully.");
	} catch (error) {
		const errorMessage = catchErrors(error);
		return response(false, 500, "Internal Server Error", errorMessage);
	}
}
