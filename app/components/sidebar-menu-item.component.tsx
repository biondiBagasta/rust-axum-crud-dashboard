"use client"

import { usePathname, useRouter } from "next/navigation";

interface SidebarMenuItemProps {
	icon: React.ReactNode;
	name: string;
	redirectRoute: string;
}

export default function SidebarMenuItemComponent(props: SidebarMenuItemProps) {
	const router = useRouter();
	const pathName = usePathname();

	return (
		<li onClick={
			() => router.push("/dashboard/" + props.redirectRoute)
		} style={
			{
				cursor: "pointer"
			}
		} className={
			pathName == `/dashboard/${props.redirectRoute}` ? 'menu-active' : ''
		}>
			<a>
				{ props.icon }
				<span className="link_name">{ props.name }</span>
			</a>
			<ul className="sub-menu blank">
				<li>
					<a className="link_name">
						{ props.name }
					</a>
				</li>
			</ul>
		</li>
	)
}