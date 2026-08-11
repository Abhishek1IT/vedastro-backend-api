import { useAuthStore } from "../store/authStore";

export const useAuth = () => {
  const user = useAuthStore((state) => state.user);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const setUser = useAuthStore((state) => state.setUser);

  const logout = useAuthStore((state) => state.logout);

  const setAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return {
    user,
    isAuthenticated,
    setUser,
    logout,
    setAuthenticated,
  };
};
