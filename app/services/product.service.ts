import { defer, map, Observable } from "rxjs";
import { Paginate } from "../interfaces/paginate";
import { axiosClientSecuredJsonContent } from "../utils/utils";
import { QueryMessage } from "../interfaces/query-message";
import { Product } from "../interfaces/product";
import { FileResponse } from "../interfaces/file-response";

interface ProductPaginate {
	data: Product[];
	paginate: Paginate;
}

interface ProductBody {
	name: string;
	description: string;
	purchase_price: number;
	selling_price: number;
	stock: number;
	discount: number;
	image: string;
	category_id: number;
}

export class ProductService {
	searchPaginate(page: number, term: string): Observable<ProductPaginate> {
		const jwt = localStorage.getItem("rust-jwt") ?? "";
		return defer(() => {
			return axiosClientSecuredJsonContent(jwt).post<ProductPaginate>(
				`/product/search-paginate`,
				{
					page,
					term
				}
			)
		}).pipe(
			map((response) => {
				return response.data;
			})
		);
	}

	create(data: ProductBody): Observable<QueryMessage> {
		const jwt = localStorage.getItem("rust-jwt") ?? "";
		return defer(() => {
			return axiosClientSecuredJsonContent(jwt).post<QueryMessage>(
				`/product`,
				data
			)
		}).pipe(
			map((response) => response.data)
		)
	}

	update(id: number, data: ProductBody): Observable<QueryMessage> {
		const jwt = localStorage.getItem("rust-jwt") ?? "";
		return defer(() => {
			return axiosClientSecuredJsonContent(jwt).put<QueryMessage>(
				`/product/${id}`,
				data
			)
		}).pipe(
			map((response) => {
				return response.data;
			})
		)
	}

	delete(id: number): Observable<QueryMessage> {
		const jwt = localStorage.getItem("rust-jwt") ?? "";
		return defer(() => {
			return axiosClientSecuredJsonContent(jwt).delete<QueryMessage>(
				`product/${id}`
			)
		}).pipe(
			map((response) => {
				return response.data;
			})
		)
	}

  uploadImage(image: FormData): Observable<FileResponse> {
  	const jwt = localStorage.getItem("rust-jwt") ?? "";

  	return defer(() => {
  		return axiosClientSecuredJsonContent(jwt).post<FileResponse>(
  			`files/product/`,
  			image
  		)
  	}).pipe(
  		map((response) => {
  			return response.data;
  		})
  	);
  }

  deleteImage(image: string): Observable<void> {
  	const jwt = localStorage.getItem("rust-jwt") ?? "";

  	return defer(() => {
  		return axiosClientSecuredJsonContent(jwt).delete<void>(
  			`files/product/delete.${image}`
  		)
  	}).pipe(
  		map((response) => {
  			return response.data;
  		})
  	)
  }
}