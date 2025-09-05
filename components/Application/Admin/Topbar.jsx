"use client"
import React from "react";
import ThemeSwitch from "./ThemeSwitch";
import UserDropdown from "./UserDropdown";
import { Button } from "@/components/ui/button";
import { RiMenu4Fill } from "react-icons/ri";
import { useSidebar } from "@/components/ui/sidebar";

const Topbar = () => {
	const {toggleSidebar} = useSidebar();
	return (
		<div className="fixed top-0 left-0 md:left-64 w-full md:w-[calc(100%-16rem)] h-17 z-30 border-b flex justify-between items-center px-5  bg-white dark:bg-card">
			<div>Search comp</div>
			<div className="flex items-center gap-2">
				<ThemeSwitch />
				<UserDropdown />
        <Button onClick={toggleSidebar} type="button" size="icon" className="ms-2 md:hidden">
					<RiMenu4Fill/>
        </Button>
			</div>
		</div>
	);
};

export default Topbar;
