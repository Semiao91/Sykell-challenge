export function useAuth() {
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;

  return {token, isAuthenticated};
}
