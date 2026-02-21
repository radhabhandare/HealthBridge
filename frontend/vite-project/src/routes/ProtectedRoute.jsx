import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const isAuthenticated = false; // later replace with auth logic

  return isAuthenticated ? children : <Navigate to="/login/user" />;
}
