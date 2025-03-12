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
			<div className="bx-menu" onClick={
				props.onClickSidebarIcon
			}>
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
				  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
				</svg>
			</div>
			<div className="header-user cursor-pointer" onClick={
				() => {
					setUserDropdown(!showUserDropdown)
				}
			}>
				<div className="avatar avatar-online">
				  <div className="w-12 rounded-full">
				    <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
				  </div>
				</div>
		        <div className="name-text hidden md:block" style={
		          {
		            marginRight: "2vw"
		          }
		        }>
		          { props.user.full_name }
		        </div>
			</div>
	      	{
		        showUserDropdown ? 
		        <div className="dropdown-user">
					<div className="avatar">
					  <div className="w-24 rounded-full">
					    <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
					  </div>
					</div>
			          <div className="name-dropdown-text mb-2">
			            { props.user.full_name }
			          </div>
			          <div className="job-text mb-5">
			            { props.user.role }
			          </div>
			          <div className="dropdown-user-button">
			            <button className="btn btn-primary mr-3">Edit Profil</button>
			            <button className="btn btn-soft btn-error">Logout</button>
			          </div>
		        </div> :
		        <></>
	        }
		</div>
	)
}