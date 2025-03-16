import { Observable, defer, map } from "rxjs";
import { UserSystem } from "../interfaces/user-system";
import { axiosClientJsonContent } from "../utils/utils";
import { axiosClientSecuredJsonContent } from  "../utils/utils";

interface LoginResponse {
	data: UserSystem;
	token: string;
}

export class AuthService {
	login(username: string, password: string): Observable<LoginResponse> {
		return defer(() => axiosClientJsonContent.post<LoginResponse>(`/auth/login`, {
			username, password
		})).pipe(
			map((response) => {
				return response.data;
			})
		)
	}

	authenticated(): Observable<LoginResponse> {
		const jwt = localStorage.getItem("rust-jwt") ?? "";

		return defer(() => axiosClientSecuredJsonContent(jwt).post<LoginResponse>(`/auth/authenticated`)).pipe(
			map((response) => {
				return response.data
			})
		)
	}
}