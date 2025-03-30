import { create } from "zustand";
import { AuthService } from "../services/auth.service";
import { CategoryService } from "../services/category.service";
import { ProductService } from "../services/product.service";

interface ServiceState {
	authService: AuthService;
	categoryService: CategoryService;
	productService: ProductService;
}

export const useServiceStore = create<ServiceState>(() => ({
	authService: new AuthService(),
	categoryService: new CategoryService(),
	productService: new ProductService()
}));