import axios, { AxiosInstance } from "axios";
import {maskitoNumberOptionsGenerator} from '@maskito/kit';

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

export const maskitoCurrencyOptions = maskitoNumberOptionsGenerator({
    decimalZeroPadding: false,
    precision: 1,
    thousandSeparator: '.',
    decimalSeparator: ",",
    min: 0,
    prefix: 'Rp. ',
});

export const maskitoPercentOptions = maskitoNumberOptionsGenerator({
    postfix: "%",
    min: 0,
    max: 100,
    precision: 2
});