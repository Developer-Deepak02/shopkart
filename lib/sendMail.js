import nodemailer from "nodemailer";

export const sendEmail = async (subject, receiver, body) => {
	const transporter = nodemailer.createTransport({
		host: process.env.NODEMAILER_HOST,
		port: process.env.NODEMAILER_PORT,
		secure: false,
		auth: {
			user: process.env.NODEMAILER_USER,
			pass: process.env.NODEMAILER_PASSWORD,
		},
	});

	const options = {
		from: `"ShopKart" ${process.env.NODEMAILER_USER}`,
		to: receiver,
		subject: subject,
		html: body,
	};

	try {
		await transporter.sendMail(options);
		return { success: true, message: "Email sent successfully" };
	} catch (error) {
		return { success: false, message: "Failed to send email", error };
	}
};
