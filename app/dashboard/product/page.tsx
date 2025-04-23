"use client"

import PageTitleComponent from "@/app/components/page-title.component"
import { AxiosErrorObject } from "@/app/interfaces/axios-error-object";
import { Product } from "@/app/interfaces/product";
import { useServiceStore } from "@/app/store/service.store";
import { AxiosError } from "axios";
import { useEffect, useRef, useState } from "react"
import { toast } from "react-toastify";
import { catchError, EMPTY, Subscription, tap } from "rxjs";

export default function ProductPage() {

	const [searchControl, setSearchControl] = useState("");
	const [debounceSearch, setDebounceSearch] = useState(searchControl);

	const [nameControl, setNameControl] = useState("");
	const [descriptionControl, setDescriptionControl] = useState("");
	const [purchasePriceControl, setPurchasePriceControl] = useState("");
	const [sellingPriceControl, setSellingPriceControl] = useState("");
	const [stockControl, setStockControl] = useState(0);
	const [discountControl, setDiscountControl] = useState("");
	const [imageFile, setImageFile] = useState<File | null>(null);

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

  	const checkFormValidity: () => boolean = () => {
  		if(nameControl && descriptionControl && purchasePriceControl && sellingPriceControl && stockControl
  		&& imageFile) {
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
  		setImageFile(null);
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


	return (
		<PageTitleComponent title="Product" subtitle="Dashboard" />
	)
} 