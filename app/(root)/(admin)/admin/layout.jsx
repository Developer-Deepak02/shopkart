import AppSidebar from "@/components/Application/Admin/AppSidebar";
import Topbar from "@/components/Application/Admin/Topbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

const layout = ({ children }) => {
	return (
		<SidebarProvider>
			<AppSidebar />

			{/* Main content area beside sidebar */}
			<main className="md:ms-64 w-full">
				{" "}
				{/* ms-64 = margin-left same as sidebar width */}
				{/* Topbar sits above the page content */}
				<Topbar />
				{/* Page Content */}
				<div className="pt-[70px] px-5 min-h-[calc(100vh-40px)] pb-10">
					{children}
				</div>
				{/* Footer */}
				<div className="border-t h-[40px] flex items-center justify-center bg-gray-50 dark:bg-background text-sm">
					@ 2025 ShopKart all rights Reserved
				</div>
			</main>
		</SidebarProvider>
	);
};

export default layout;
