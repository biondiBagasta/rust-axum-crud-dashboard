"use client"

import InfoAlertComponent from "@/app/components/info-alert.component";
import PageTitleComponent from "@/app/components/page-title.component"
import PaginationComponent from "@/app/components/pagination-component";
import { AxiosErrorObject } from "@/app/interfaces/axios-error-object";
import { Product } from "@/app/interfaces/product";
import { useServiceStore } from "@/app/store/service.store";
import { maskitoCurrencyOptions, maskitoPercentOptions } from "@/app/utils/utils";
import { maskitoTransform } from "@maskito/core";
import { AxiosError } from "axios";
import { useEffect, useRef, useState } from "react"
import { toast, ToastContainer } from "react-toastify";
import { catchError, EMPTY, retry, Subscription, switchMap, tap } from "rxjs";
import { useQuill } from 'react-quilljs';
import 'quill/dist/quill.snow.css';

export default function ProductPage() {

	const { quill, quillRef } = useQuill();

	const [searchControl, setSearchControl] = useState("");
	const [debounceSearch, setDebounceSearch] = useState(searchControl);

	const [nameControl, setNameControl] = useState("");
	const [descriptionControl, setDescriptionControl] = useState("");
	const [purchasePriceControl, setPurchasePriceControl] = useState("");
	const [sellingPriceControl, setSellingPriceControl] = useState("");
	const [stockControl, setStockControl] = useState(0);
	const [discountControl, setDiscountControl] = useState("");
	const [imageFileControl, setImageFileControl] = useState<File | null>(null);
	const [categoryIdControl, setCategoryIdControl] = useState(0);

	const [dataList, setDataList] = useState<Product[]>([]);

	const [selectedData, setSelectedData] = useState<Product>({} as Product);

	const subscriptionRef = useRef(new Subscription());

	const categoryService = useServiceStore((state) => state.categoryService);
	const productService = useServiceStore((state) => state.productService);

	const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
	const [isLoadingInitialize, setIsLoadingInitialize] = useState(false);

	const [currentPage, setCurrentPage] = useState(1);

	const [totalPage, setTotalPage] = useState(1);
	
	useEffect(() => {
		const currentSubscription = subscriptionRef.current;

		return () => {
			currentSubscription.unsubscribe();
		}
	});

  	// Debounce Effect
  	useEffect(() => {
  		// Set a timeout to update debounced value after 500ms
  		const handler = setTimeout(() => {
  			setDebounceSearch(searchControl);
  		}, 500);

  		// Cleanup the timeout if `query` changes before 500ms
  		return () => {
  			clearTimeout(handler);
  		};
  	}, [searchControl]);

  	useEffect(() => {
  		searchPaginate();
  	}, [currentPage, debounceSearch]);

  	useEffect(() => {
  		if(quill) {
  			quill.on('text-change', (delta, oldDelta, source) => {
  				// console.log(quill.getText())
  				// console.log(quill.get)
  				// console.log(quill.getContents());
  				console.log(quill.root.innerHTML);
  			})
  		}
  	}, [quill]);

  	const checkFormValidity: () => boolean = () => {
  		if(nameControl && descriptionControl && purchasePriceControl && sellingPriceControl && stockControl
  		&& imageFileControl) {
  			return false;
  		} else {
  			return true;
  		}
  	};

  	const resetFormControl = () => {
  		setNameControl("");
  		setDescriptionControl("");
  		setPurchasePriceControl("");
  		setSellingPriceControl("")
  		setStockControl(0);
  		setDiscountControl("");
  		setImageFileControl(null);
  	}

  	const resetPaginate = () => {
  		setCurrentPage(1);
  		setSearchControl("");
  	}

  	const searchPaginate = () => {
  		setIsLoadingInitialize(true);

  		const searchSubscription = productService.searchPaginate(currentPage, searchControl).pipe(
  			tap(response => {
				setTotalPage(response.paginate.total_page);
				setDataList(response.data);
				setIsLoadingInitialize(false);
  			}),
			catchError((e: AxiosError) => {	
				toast((e.response?.data as AxiosErrorObject).message, {
					autoClose: 5000,
					theme: "colored",
					type: "error",

				});
				setIsLoadingInitialize(false);
				return EMPTY;
			})
  		).subscribe();

  		subscriptionRef.current.add(searchSubscription);
  	}

  	const openCreateModal = () => {
  		document.getElementById("create_modal_product")!.showModal();
  		resetFormControl();
  	}

  	const createData = () => {
  		setIsLoadingSubmit(true);

  		const formData = new FormData();

  		formData.append("product_image", imageFileControl!);

  		const purchase_price = Number(purchasePriceControl.replaceAll(/[^0-9]/g, ""));
  		const selling_price = Number(sellingPriceControl.replaceAll(/[^0-9]/g, ""));
  		const discount = Number(discountControl.replaceAll(/[^0-9]/g, ""));

  		const createSubscription = productService.uploadImage(formData).pipe(
  			retry(5),
  			switchMap(fileResponse => {
  				return productService.create({
  					name: nameControl,
  					description: descriptionControl,
  					purchase_price: purchase_price,
  					selling_price: selling_price,
  					stock: stockControl,
  					discount: discount,
  					image: fileResponse.file_name,
  					category_id: categoryIdControl
  				}).pipe(
  					tap(response => {
  						setIsLoadingSubmit(false);

  						resetPaginate();

  						searchPaginate();

  						resetFormControl();

						toast(response.message, {
							autoClose: 5000,
							theme: "colored",
							type: response.success ? "info" : "error"
						})
  					}),
  					catchError((e) => {
						toast((e.response?.data as AxiosErrorObject).message, {
							autoClose: 5000,
							theme: "colored",
							type: "error",

						});
						setIsLoadingSubmit(false);
						return EMPTY;
  					})
  				)
  			}),
  			catchError((e) => {
				toast((e.response?.data as AxiosErrorObject).message, {
					autoClose: 5000,
					theme: "colored",
					type: "error",

				});
				setIsLoadingSubmit(false);
				return EMPTY;
  			})
  		).subscribe();

  		subscriptionRef.current.add(createSubscription);
  	}

  	const openEditModal = (data: Product) => {
  		setSelectedData(data);
  		setNameControl(data.name);
  		setDescriptionControl(data.description);
  		setPurchasePriceControl(maskitoTransform(data.purchase_price.toString(), maskitoCurrencyOptions));
  		setSellingPriceControl(maskitoTransform(data.selling_price.toString(), maskitoCurrencyOptions));
  		setStockControl(data.stock);
  		setDiscountControl(maskitoTransform(data.discount.toString(), maskitoPercentOptions));
  		setCategoryIdControl(data.category_id);

  		document.getElementById("edit_modal")!.showModal();
  	};

  	const update = () => {
  		setIsLoadingSubmit(true);

  		const purchase_price = Number(purchasePriceControl.replaceAll(/[^0-9]/g, ""));
  		const selling_price = Number(sellingPriceControl.replaceAll(/[^0-9]/g, ""));
  		const discount = Number(discountControl.replaceAll(/[^0-9]/g, ""));

  		if(imageFileControl) {
  			const formData = new FormData();

  			formData.append("product_image", imageFileControl);

  			const updateSubscription = productService.deleteImage(selectedData.image).pipe(
  				switchMap(() => {
  					return productService.uploadImage(formData).pipe(
  						retry(5),
  						switchMap((fileResponse) => {
  							return productService.update(
  								selectedData.id,
  							{
			  					name: nameControl,
			  					description: descriptionControl,
			  					purchase_price: purchase_price,
			  					selling_price: selling_price,
			  					stock: stockControl,
			  					discount: discount,
			  					image: fileResponse.file_name,
			  					category_id: categoryIdControl
			  				}).pipe(
			  					tap(response => {
			  						setIsLoadingSubmit(false);

			  						resetPaginate();

			  						searchPaginate();

			  						resetFormControl();

									toast(response.message, {
										autoClose: 5000,
										theme: "colored",
										type: response.success ? "info" : "error"
									})
			  					}),
			  					catchError((e) => {
									toast((e.response?.data as AxiosErrorObject).message, {
										autoClose: 5000,
										theme: "colored",
										type: "error",

									});
									setIsLoadingSubmit(false);
									return EMPTY;
			  					})
			  				)
  						}),
			  			catchError((e) => {
							toast((e.response?.data as AxiosErrorObject).message, {
								autoClose: 5000,
								theme: "colored",
								type: "error",

							});
							setIsLoadingSubmit(false);
							return EMPTY;
			  			})
  					)
  				}),
	  			catchError((e) => {
					toast((e.response?.data as AxiosErrorObject).message, {
						autoClose: 5000,
						theme: "colored",
						type: "error",

					});
					setIsLoadingSubmit(false);
					return EMPTY;
	  			})
  			).subscribe();

  			subscriptionRef.current.add(updateSubscription);
  		} else {
  			return productService.update(
				selectedData.id,
			{
				name: nameControl,
				description: descriptionControl,
				purchase_price: purchase_price,
				selling_price: selling_price,
				stock: stockControl,
				discount: discount,
				image: selectedData.image,
				category_id: categoryIdControl
			}).pipe(
				tap(response => {
					setIsLoadingSubmit(false);

					resetPaginate();

					searchPaginate();

					resetFormControl();

					toast(response.message, {
						autoClose: 5000,
						theme: "colored",
						type: response.success ? "info" : "error"
					})
				}),
				catchError((e) => {
					toast((e.response?.data as AxiosErrorObject).message, {
						autoClose: 5000,
						theme: "colored",
						type: "error",

					});
					setIsLoadingSubmit(false);
					return EMPTY;
				})
			)
  		}
  	}

  	const openDeleteModal = (data: Product) => {
		document.getElementById("delete_modal")!.showModal();
		setSelectedData(data);
  	}

  	const deleteData = () => {
  		setIsLoadingSubmit(true);

  		const deleteSubscription = productService.deleteImage(selectedData.image).pipe(
  			switchMap(() => {
  				return productService.delete(selectedData.id).pipe(
  					tap(response => {
  						setIsLoadingSubmit(false);

						resetPaginate();

						searchPaginate();

						toast(response.message, {
							autoClose: 5000,
							theme: "colored",
							type: response.success ? "warning" : "error"
						});
  					}),
					catchError((e) => {
						toast((e.response?.data as AxiosErrorObject).message, {
							autoClose: 5000,
							theme: "colored",
							type: "error",

						});
						setIsLoadingSubmit(false);
						return EMPTY;
					})
  				)
  			}),
			catchError((e) => {
				toast((e.response?.data as AxiosErrorObject).message, {
					autoClose: 5000,
					theme: "colored",
					type: "error",

				});
				setIsLoadingSubmit(false);
				return EMPTY;
			})
  		).subscribe();

  		subscriptionRef.current.add(deleteSubscription);
  	}


	return (
		<>	
			<ToastContainer />
			<PageTitleComponent title="Product" subtitle="Dashboard" />

			{/* Table */}
			<div className="mt-3">
				<div className="card bg-white w-full shadow-sm p-5">
					<div className="flex flex-row justify-between items-center mb-3">
						<button className="btn btn-soft btn-primary" onClick={
							() => {
								openCreateModal();
							}
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
					<div className="overflow-x-auto mb-5">
						<table className="table table-zebra">
							<thead>
								<tr>
									<th>
										Name
									</th>
									<th>
										Category
									</th>
									<th>
										Purchase Price
									</th>
									<th>
										Selling Price
									</th>
									<th>
										Action
									</th>
								</tr>
							</thead>
							<tbody>
								{
									dataList.map((d, index) => (
										<tr key={ index }>
											<td>
												{ d.name }
											</td>
											<td>
												<div className="flex flex-row gap-2 items-center">
													<button className="btn btn-soft btn-info btn-sm"
													onClick={
														() => {
															openEditModal(d);
														}
													}>
														<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
														  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
														</svg>
													</button>
													<button className="btn btn-soft btn-error btn-sm"
													onClick={
														() => {
															openDeleteModal(d);
														}
													}>
														<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
														  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
														</svg>
													</button>
												</div>
											</td>
										</tr>
									))
								}
							</tbody>
						</table>
						{
							dataList.length == 0 ? <InfoAlertComponent message="No Product Data!!!" /> : <></>
						}
					</div>

					<div className="flex flex-row justify-center">
						<PaginationComponent totalPage={ totalPage } page={ currentPage }
							onPaginate={
								(paginationPage) => {
									setCurrentPage(paginationPage);
								}
							}
						 />
					</div>
				</div>
			</div>

			{/* Create Modal */}
			<dialog id="create_modal_product" className="modal modal-bottom sm:modal-middle">
			  <div className="modal-box w-11/12 max-w-5xl">
			    <h3 className="font-bold text-lg mb-5">Create Product Data</h3>

			    <div className="flex flex-col gap-2">
			    	<div className="text-sm">
			    		Name
			    	</div>
			    	<div className="w-full input">
					  	<input type="text" className="grow" placeholder="Name" value={ nameControl }
					  	onChange={
					  		(e) => setNameControl(e.target.value)
					  	} />
					</div>
			    </div>

			    <div className="flex flex-col gap-2">
			    	<div className="text-sm">
			    		Description
			    	</div>
			    	<div className="w-full">
					  	<div ref={ quillRef }></div>
					</div>
			    </div>

			    <div className="modal-action">
			      <form method="dialog">
			        {/* if there is a button in form, it will close the modal */}
			      	<button className="btn btn-info btn-sm mr-3" disabled={ checkFormValidity() }
			      	onClick={
			      		() => {
			      			createData();
			      		}
			      	}>
				        {
				        	isLoadingSubmit ? <span className="loading loading-spinner"></span> :
				        	<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
							  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
							</svg>
				        }
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