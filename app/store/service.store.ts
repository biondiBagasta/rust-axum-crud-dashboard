import { create } from "zustand";
import { AuthService } from "../services/auth.service";
import { CategoryService } from "../services/category.service";

interface ServiceState {
	authService: AuthService;
	categoryService: CategoryService;
}

export const useServiceStore = create<ServiceState>(() => ({
	authService: new AuthService(),
	categoryService: new CategoryService()
}));