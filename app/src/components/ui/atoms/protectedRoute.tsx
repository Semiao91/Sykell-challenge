import { useAuth } from "@/hooks/useAuth";
import type { JSX } from "react";
import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children }: { children: JSX.Element }) {
    const { isAuthenticated } = useAuth();

    return isAuthenticated ? children : <Navigate to="/" />;
}
