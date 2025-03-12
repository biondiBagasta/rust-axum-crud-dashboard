import axios, { AxiosInstance } from "axios";

export const baseUrl = "http://localhost:7878/api";

export const axiosClientJsonContent = axios.create({
    baseURL: baseUrl,
	headers: {
	  "Content-Type": "application/json"
	}
});

export const axiosClientSecuredJsonContent: (data: string) => AxiosInstance = (jwt: string) => axios.create({
	baseURL: baseUrl,
	headers: {
		"Content-Type": "application/json",
		"Authorization": `Bearer ${jwt}`
	}
});