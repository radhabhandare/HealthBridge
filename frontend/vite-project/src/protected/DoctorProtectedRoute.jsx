import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function DoctorProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "doctor") {
    return <Navigate to="/login/doctor" />;
  }

  return children;
}