"use client"

import { useEffect, useRef, useState } from "react";
import OverlayLoading from "../components/overlay-loading";
import { useRouter } from "next/navigation";
import { catchError, EMPTY, Subscription, tap } from "rxjs";
import { useServiceStore } from "../store/service.store";
import { useAuthenticatedStore } from "../store/authenticated.store";
import { toast, ToastContainer } from "react-toastify";
import { AxiosError } from "axios";
import { AxiosErrorObject } from "../interfaces/axios-error-object";
import Image from "next/image";

export default function LoginPage() {
	const [usernameControl, setUsernameControl] = useState("");
	const [passwordControl, setPasswordControl] = useState("");
	const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);

	const router = useRouter();

	const subscriptionRef = useRef(new Subscription());

	const authService = useServiceStore((state) => state.authService);
	const setAuthenticatedState = useAuthenticatedStore((state) => state.setUserState);

	useEffect(() => {
		const jwt = localStorage.getItem("rust-jwt");

		const currentSubscription = subscriptionRef.current;

		if(jwt) {
			router.replace("/dashboard/main");
		}

		return () => {
			currentSubscription.unsubscribe();
		}
	}, [router]);

	const login = () => {
		setIsLoadingSubmit(true);

		const loginSubscription = authService.login(usernameControl, passwordControl).pipe(
			tap(data => {
				setIsLoadingSubmit(false);

				localStorage.setItem("rust-jwt", data.token);

				setAuthenticatedState(data.data);

				router.push("/dashboard/main");
			}),
			catchError((e: AxiosError) => {	
				toast((e.response?.data as AxiosErrorObject).message, {
					autoClose: 5000,
					theme: "colored",
					type: "error",

				});
				setUsernameControl("");
				setPasswordControl("");
				setIsLoadingSubmit(false);
				return EMPTY;
			})
		).subscribe();

		subscriptionRef.current.add(loginSubscription);
	}

	return (
		<>	
			<ToastContainer />
			<div className="w-full h-screen flex flex-row items-center justify-center">
				<div className="card bg-white shadow-sm p-8 w-full md:w-128">
					<div className="flex flex-row justify-content-center mb-10">
		                <Image alt="logo" src="/images/next-logo.png" className="m-auto"
		                width={ 96 } height={ 0 } />
					</div>
					<div className="text-base font-bold mb-5">
						Login
					</div>
					<label className="input w-full mb-5">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
						  <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
						</svg>
					  	<input type="text" className="grow" placeholder="Username" value={ usernameControl }
					  	onChange={
					  		(e) => setUsernameControl(e.target.value)
					  	} />
					</label>
					<label className="input w-full mb-5">
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
						  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
						</svg>
					  	<input type="password" className="grow" placeholder="Password" value={ passwordControl }
					  	onChange={
					  		(e) => setPasswordControl(e.target.value)
					  	} />
					</label>
					<button className="btn btn-soft btn-primary w-full" onClick={
						() => {
							login();
						}
					}>
						Login
					</button>
				</div>
			</div>
			{
				isLoadingSubmit ? <OverlayLoading title="Proses Login..." /> : <></>
			}
		</>
	);
}