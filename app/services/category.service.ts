import { defer, map, Observable } from "rxjs";
import { Category } from "../interfaces/category";
import { Paginate } from "../interfaces/paginate";
import { axiosClientSecuredJsonContent } from "../utils/utils";
import { QueryMessage } from "../interfaces/query-message";

interface CategoryPaginate {
	data: Category[];
	paginate: Paginate;
}

interface CategoryBody {
	name: string;
}

export class CategoryService {
	searchPaginate(page: number, term: string): Observable<CategoryPaginate> {
		const jwt = localStorage.getItem("rust-jwt") ?? "";
		return defer(() => {
			return axiosClientSecuredJsonContent(jwt).post<CategoryPaginate>(
				`/category/search-paginate`,
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

	create(data: CategoryBody): Observable<QueryMessage> {
		const jwt = localStorage.getItem("rust-jwt") ?? "";
		return defer(() => {
			return axiosClientSecuredJsonContent(jwt).post<QueryMessage>(
				`/category`,
				data
			)
		}).pipe(
			map((response) => response.data)
		)
	}

	update(id: number, data: CategoryBody): Observable<QueryMessage> {
		const jwt = localStorage.getItem("rust-jwt") ?? "";
		return defer(() => {
			return axiosClientSecuredJsonContent(jwt).put<QueryMessage>(
				`/category/${id}`,
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
				`category/${id}`
			)
		}).pipe(
			map((response) => {
				return response.data;
			})
		)
	}
}