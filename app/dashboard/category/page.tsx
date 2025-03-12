"use client"

import PageTitleComponent from "@/app/components/page-title.component"
import { useState } from "react"

export default function CategoryPage() {

	const [searchControl, setSearchControl] = useState("");

	const [nameControl, setNameControl] = useState("");

	return (
		<>
			<PageTitleComponent title="Category" subtitle="Dashboard" />
			<div className="mt-3">
				<div className="card bg-white w-full shadow-sm p-5">
					<div className="flex flex-row justify-between items-center mb-3">
						<button className="btn btn-soft btn-primary" onClick={
							() => document.getElementById("create_modal")!.showModal()
						}>
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
							  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
							</svg>
							Add
						</button>
						<div className="w-75 input">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
							  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
							</svg>
						  	<input type="text" className="grow" placeholder="Search..." value={ searchControl }
						  	onChange={
						  		(e) => setSearchControl(e.target.value)
						  	} />
						</div>
					</div>
				</div>
			</div>


			{/* Create Modal */}
			<dialog id="create_modal" className="modal modal-bottom sm:modal-middle">
			  <div className="modal-box w-11/12 max-w-5xl">
			    <h3 className="font-bold text-lg mb-5">Create Category Data</h3>

			    <div className="flex flex-col gap-2">
			    	<div className="text-sm">
			    		Name
			    	</div>
			    	<div className="w-full input">
					  	<input type="text" className="grow" placeholder="Search..." value={ nameControl }
					  	onChange={
					  		(e) => setNameControl(e.target.value)
					  	} />
					</div>
			    </div>

			    <div className="modal-action">
			      <form method="dialog">
			        {/* if there is a button in form, it will close the modal */}
			      	<button className="btn btn-info btn-sm mr-3">
				        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
						  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
						</svg>
			        	Submit
			        </button>
			        <button className="btn btn-error btn-soft btn-sm">
				        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
						  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
						</svg>

			        	Close
			        </button>
			      </form>
			    </div>
			  </div>
			</dialog>
		</>
	)
}