import { connectToDB } from "@/lib/databaseConnection";
import { catchErrors, response } from "@/lib/helperFunction";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    await connectToDB()
    const cookieStore = await cookies()
    cookieStore.delete("access_token")
    return response(true , 200 , 'Logout Successfully')
  } catch (error) {
    catchErrors(error)
  }
}