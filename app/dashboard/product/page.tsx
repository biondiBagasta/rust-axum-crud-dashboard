"use client"

import { Product } from "@/app/interfaces/product";
import { useServiceStore } from "@/app/store/service.store";
import { useRef, useState } from "react"
import { Subscription } from "rxjs";

export default function ProductPage() {
	const [searchControl, setSearchControl] = useState("");
	const [debounceSearch, setDebounceSearch] = useState(searchControl);

	const [nameControl, setNameControl] = useState("");
	const [purchasePriceControl, setPurchasePriceControl] = useState(0);
	const [sellingPriceControl, setSellingPriceControl] = useState(0);
	const [stockControl, setStockControl] = useState(0);
	const [discountControl, setDiscountControl] = useState(0);
	const [imageFileControl, setImageFileControl] = useState<File| null>(null);
	const [categoryIdControl, setCategoryIdControl] = useState(0);

	const [isLoadingInitialize, setIsLoadingInitialize] = useState(false);

	const [selectedData, setSelectedData] = useState<Product>({} as Product);

	const subscriptionRef = useRef(new Subscription());

	const categoryService = useServiceStore((state) => state.categoryService);

	const productService = useServiceStore((state) => state.productService);

	const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);

	const [currentPage, setCurrentPage] = useState(0);

	const [totalPage, setTotalPage] = useState(0);

	const resetFormControl = () => {
		setNameControl("");
		setPurchasePriceControl(0);
		setSellingPriceControl(0);
		setStockControl(0);
		setDiscountControl(0);
		setImageFileControl(null);
		setCategoryIdControl(0);
	}

	const resetPaginate = () => {
		setCurrentPage(0);
		setSearchControl("");
	}
} 