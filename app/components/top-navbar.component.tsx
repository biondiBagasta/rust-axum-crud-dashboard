"use client"

import { useState } from "react";
import { UserSystem } from "../interfaces/user-system";

interface TopNavbarProps {
	isOpenedSidebar: boolean;
	onClickSidebarIcon: () => void;
	user: UserSystem;
}

export default function TopNavbarComponent(props: TopNavbarProps) {
	const [showUserDropdown, setUserDropdown] = useState(false);

	return (
		<div className="top-navbar">
			<div className="bx-menu">
				{
					props.isOpenedSidebar ? <></>
				}
			</div>
		</div>
	)
}