import { Category } from "./category";

export interface Product {
	id: number;
	name: string;
	purchase_price: number;
	selling_price: number;
	stock: number;
	discount: number;
	image: string;
	category_id: number;
	category: Category;
	created_at: string;
	updated_at: string;
}