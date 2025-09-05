"use client"
import React from "react";
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	useSidebar,
} from "@/components/ui/sidebar";
import logoBlack from "@/public/assets/logo-black.png";
import logoWhite from "@/public/assets/logo-white.png";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LuChevronRight } from "react-icons/lu";
import { IoMdClose } from "react-icons/io";
import { adminAppSidebarMenu } from "@/lib/adminSidebarMenu";
import {
	Collapsible,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Link from "next/link";
import { CollapsibleContent } from '@radix-ui/react-collapsible';


const AppSidebar = () => {
	const {toggleSidebar} = useSidebar();
	return (
		<Sidebar className="">
			<SidebarHeader className="border-b h-17 mb-2 p-0">
				<div className="flex items-center justify-between gap-6 px-2">
					<Image
						src={logoBlack}
						height={70}
						className="block dark:hidden"
						alt="logo"
					/>
					<Image
						src={logoWhite}
						height={70}
						className="hidden dark:block"
						alt="logo"
					/>
					<Button onClick={toggleSidebar} type="button" size="icon" className="md:hidden">
						<IoMdClose />
					</Button>
				</div>
			</SidebarHeader>

			<SidebarContent className="p-3">
				<SidebarMenu>
					{adminAppSidebarMenu.map((menu, index) => (
						<Collapsible key={index} className="group/collapsible">
							<SidebarMenuItem>
								<CollapsibleTrigger asChild>
									<SidebarMenuButton
										asChild
										className="font-semibold px-2 py-5"
									>
										<Link href={menu?.url}>
											<menu.icon />
											{menu.title}
											{menu.submenu && menu.submenu.length > 0 && (
												<LuChevronRight className="ml-auto transition-transform duration-200 group-[state=open]/collapsible:rotate-90" />
											)}
										</Link>
									</SidebarMenuButton>
								</CollapsibleTrigger>
								{menu.submenu && menu.submenu.length > 0 && (
									<CollapsibleContent>
										<SidebarMenuSub>
											{menu.submenu.map((subMenu, subIndex) => (
												<SidebarMenuItem key={subIndex}>
													<SidebarMenuSubButton asChild className="px-2 py-5">
														<Link href={subMenu.url}>{subMenu.title}</Link>
													</SidebarMenuSubButton>
												</SidebarMenuItem>
											))}
										</SidebarMenuSub>
									</CollapsibleContent>
								)}
							</SidebarMenuItem>
						</Collapsible>
					))}
				</SidebarMenu>
			</SidebarContent>
		</Sidebar>
	);
};

export default AppSidebar;
