import React from "react";
import { Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "../../lib/utils";

const ButtonLoading = ({
	type,
	text,
	loading,
	onclick,
	className,
	...props
}) => {
	return (
		<div>
			<Button
				type={type}
				onClick={onclick}
				disabled={loading}
				className={cn("", className)}
				{...props}
			>
				{loading && <Loader2Icon className="animate-spin" />}
				{text}
			</Button>
		</div>
	);
};

export default ButtonLoading;
