"use client"

interface OverlayLoadingProps {
	title: string;
}

export default function OverlayLoading(props: OverlayLoadingProps) {
	return (
		<div className="w-full h-full fixed top-0 left-0 bg-white opacity-75 z-50">
		  <div className="flex flex-column gap-3 justify-center items-center mt-[50vh]">
		    <div className="loading loading-ring loading-xl"></div>
		    <div className="text-base font-semibold">
		    	{ props.title }
		    </div>
		  </div>
		</div>
	)
}