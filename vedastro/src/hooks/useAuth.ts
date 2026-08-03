import { useAuthStore } from "../store/authStore";

export const useAuth = () => {
  const user = useAuthStore((state) => state.user);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const isExistingUser = useAuthStore((state) => state.isExistingUser);

  const setUser = useAuthStore((state) => state.setUser);

  const logout = useAuthStore((state) => state.logout);

  const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

  return {
    user,
    isAuthenticated,
    isExistingUser,

    setUser,
    logout,
    setAuthenticated,
  };
};
