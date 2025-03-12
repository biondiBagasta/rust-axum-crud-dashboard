"use client"

import { useState } from "react"
import SidebarComponent from "../components/sidebar.component"
import TopNavbarComponent from "../components/top-navbar.component";
import { UserSystem } from "../interfaces/user-system";

export default function DashboardLayout({
	children
}: { children: React.ReactNode }) {

	const [isOpenedSidebar, setIsOpenedSidebar] = useState(true);

	const user: UserSystem = {
		id: 0,
		username: "biondi_bagasta",
		password: "",
		full_name: "Biondi Bagasta Wiko Putra",
		address: "Jln. Industri, GG. Gurita no.5, Gatep Permai, Taman Sari, Ampenan Selatan, Mataram, NTB",
		phone_number: "082236343053",
		role: "SUPER ADMIN",
		photo: "default_user.png",
		created_at: "",
		updated_at: ""
	};

	return (
		<>
			<SidebarComponent isOpenedSidebar={ isOpenedSidebar } />
			<div className="home-section">
				<TopNavbarComponent isOpenedSidebar={ isOpenedSidebar } onClickSidebarIcon={
					() => {
						setIsOpenedSidebar(!isOpenedSidebar)
					}
				} user={ user } />

				<div className="p-8">
					{ children }
				</div>
			</div>
		</>
	)
}