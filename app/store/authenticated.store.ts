import { create } from "zustand";
import { UserSystem } from "../interfaces/user-system";

interface AuthenticatedState {
	userState: UserSystem;
	setUserState: (user: UserSystem) => void;
}

export const useAuthenticatedStore = create<AuthenticatedState>((set) => ({
	userState: {} as UserSystem,
	setUserState: (user) => set(() => ({ userState: user }))
}));