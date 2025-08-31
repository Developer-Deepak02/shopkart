import React from "react";
import loading from "@/public/assets/loading.svg";
import Image from "next/image";

const Loading = () => {
	return (
		<div className="w-screen h-screen flex justify-center items-start mt-12">
			<Image src={loading} alt="loading" height={100} width={100} />
		</div>
	);
};

export default Loading;
