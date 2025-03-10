"use client"

interface SidebarProps {
	isOpenedSidebar: boolean;
}

export default function SidebarComponent(props: SidebarProps) {
	return (
		<div className={ props.isOpenedSidebar ? 'sidebar' : 'sidebar-close' }>
			<div className="logo-details">
				<img src="/images/next-logo.png" className="logo-image" />
				<span className="logo_name">
					DASHBOARD
				</span>
			</div>
			<ul className="nav-links"></ul>
		</div>
	)
}