"use client"

import { useEffect, useState } from "react"
import SidebarComponent from "../components/sidebar.component"
import TopNavbarComponent from "../components/top-navbar.component";
import { useServiceStore } from "../store/service.store";
import { catchError, EMPTY, tap } from "rxjs";
import { useAuthenticatedStore } from "../store/authenticated.store";
import { toast, ToastContainer } from "react-toastify";
import { AxiosError } from "axios";
import { AxiosErrorObject } from "../interfaces/axios-error-object";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
	children
}: { children: React.ReactNode }) {

	const [isOpenedSidebar, setIsOpenedSidebar] = useState(true);

	const authService = useServiceStore((state) => state.authService);

	const userState = useAuthenticatedStore((state) => state.userState);
	const setUserState = useAuthenticatedStore((state) => state.setUserState);

	const router = useRouter();

	useEffect(() => {
		const jwt = window.localStorage.getItem("rust-jwt");

		if(!jwt) {
			router.replace("/login");
		} else {
			const authSubscription = authService.authenticated().pipe(
				tap(data => {
					localStorage.setItem("rust-jwt", data.token);
					setUserState(data.data);

				}),
				catchError((e: AxiosError) => {
					console.log(e);
					console.log(e.status);
					const errorMessage = (e.response?.data as AxiosErrorObject).message;

					console.log(errorMessage);	
					
					toast(errorMessage, {
						autoClose: 5000,
						theme: "colored",
						type: "error",

					});

					if(errorMessage == "Session Was Expired") {
						localStorage.removeItem("rust-jwt");
						router.replace("/login");
					}
					return EMPTY;
				})
			).subscribe();

			return () => {
				authSubscription.unsubscribe();
			}
		}
	}, [])

	return (
		<>
			<ToastContainer />
			<SidebarComponent isOpenedSidebar={ isOpenedSidebar } />
			<div className="home-section">
				<TopNavbarComponent isOpenedSidebar={ isOpenedSidebar } onClickSidebarIcon={
					() => {
						setIsOpenedSidebar(!isOpenedSidebar)
					}
				} user={ userState } />

				<div className="p-8">
					{ children }
				</div>
			</div>
		</>
	)
}