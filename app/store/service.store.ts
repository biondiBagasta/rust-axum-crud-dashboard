import { create } from "zustand";
import { AuthService } from "../services/auth.service";

interface ServiceState {
	authService: AuthService;
}

export const useServiceStore = create<ServiceState>(() => ({
	authService: new AuthService()
}));