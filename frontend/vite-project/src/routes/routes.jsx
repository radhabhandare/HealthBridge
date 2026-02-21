// src/routes/routes.jsx
import { Routes, Route } from "react-router-dom";

/* ===== Public Pages ===== */
import LandingPage from "../pages/LandingPage";
import Appointment from "../pages/Appointment";
import Doctors from "../pages/Doctors";
import Services from "../pages/Services";

/* ===== Auth Pages ===== */
import UserLogin from "../auth/UserLogin";
import UserRegister from "../auth/UserRegister";
import DoctorLogin from "../auth/DoctorLogin";
import DoctorRegister from "../auth/DoctorRegister";
import AdminLogin from "../auth/AdminLogin";

/* ===== User Dashboards ===== */
import UserDashboard from "../dashboards/user/UserDashboard";
import HealthOverview from "../dashboards/user/HealthOverview";
import Profile from "../dashboards/user/Profile";

/* ===== Doctor Dashboards ===== */
import DoctorDashboard from "../dashboards/doctor/DoctorDashboards";
import DoctorProfile from "../dashboards/doctor/DoctorProfile";
import PatientList from "../dashboards/doctor/patientList";
import ChatWithUser from "../dashboards/doctor/ChatWithUser";
import DoctorAppointments from "../dashboards/doctor/DoctorAppointments";
import DoctorClinic from "../dashboards/doctor/DoctorClinic";
import DoctorAnalytics from "../dashboards/doctor/DoctorAnalytics";

/* ===== Admin Dashboards ===== */
import AdminDashboard from "../dashboards/admin/AdminDashboard";
import VerifyDoctors from "../dashboards/admin/VerifyDoctors";
import AdminUsers from "../dashboards/admin/AdminUsers";
import AdminDoctors from "../dashboards/admin/AdminDoctors";
import AdminAppointments from "../dashboards/admin/AdminAppointments";

/* ===== Protected Routes ===== */
import UserProtectedRoute from "../protected/UserProtectedRoute";
import DoctorProtectedRoute from "../protected/DoctorProtectedRoute";
import AdminProtectedRoute from "../protected/AdminProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      {/* ===== PUBLIC ROUTES ===== */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/appointments" element={<Appointment />} />
      <Route path="/doctors" element={<Doctors />} />
      <Route path="/services" element={<Services />} />

      {/* ===== AUTH ROUTES ===== */}
      <Route path="/login/admin" element={<AdminLogin />} />
      <Route path="/login/user" element={<UserLogin />} />
      <Route path="/register/user" element={<UserRegister />} />
      <Route path="/login/doctor" element={<DoctorLogin />} />
      <Route path="/register/doctor" element={<DoctorRegister />} />

      {/* ===== USER DASHBOARD ROUTES ===== */}
      <Route
        path="/user/dashboard"
        element={
          <UserProtectedRoute>
            <UserDashboard />
          </UserProtectedRoute>
        }
      />
      <Route
        path="/user/health"
        element={
          <UserProtectedRoute>
            <HealthOverview />
          </UserProtectedRoute>
        }
      />
      <Route
        path="/user/profile"
        element={
          <UserProtectedRoute>
            <Profile />
          </UserProtectedRoute>
        }
      />

      {/* ===== DOCTOR DASHBOARD ROUTES ===== */}
      <Route
        path="/doctor/dashboard"
        element={
          <DoctorProtectedRoute>
            <DoctorDashboard />
          </DoctorProtectedRoute>
        }
      />
      <Route
        path="/doctor/profile"
        element={
          <DoctorProtectedRoute>
            <DoctorProfile />
          </DoctorProtectedRoute>
        }
      />
      <Route
        path="/doctor/patients"
        element={
          <DoctorProtectedRoute>
            <PatientList />
          </DoctorProtectedRoute>
        }
      />
      <Route
        path="/doctor/chat"
        element={
          <DoctorProtectedRoute>
            <ChatWithUser />
          </DoctorProtectedRoute>
        }
      />
      <Route
        path="/doctor/chat/:patientId"
        element={
          <DoctorProtectedRoute>
            <ChatWithUser />
          </DoctorProtectedRoute>
        }
      />
      <Route
        path="/doctor/appointments"
        element={
          <DoctorProtectedRoute>
            <DoctorAppointments />
          </DoctorProtectedRoute>
        }
      />
      <Route
        path="/doctor/clinic"
        element={
          <DoctorProtectedRoute>
            <DoctorClinic />
          </DoctorProtectedRoute>
        }
      />
      <Route
        path="/doctor/analytics"
        element={
          <DoctorProtectedRoute>
            <DoctorAnalytics />
          </DoctorProtectedRoute>
        }
      />

      {/* ===== ADMIN DASHBOARD ROUTES ===== */}
      <Route
        path="/admin/dashboard"
        element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/verify-doctors"
        element={
          <AdminProtectedRoute>
            <VerifyDoctors />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/verify-doctors/:doctorId"
        element={
          <AdminProtectedRoute>
            <VerifyDoctors />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminProtectedRoute>
            <AdminUsers />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/doctors"
        element={
          <AdminProtectedRoute>
            <AdminDoctors />
          </AdminProtectedRoute>
        }
      />
      <Route
        path="/admin/appointments"
        element={
          <AdminProtectedRoute>
            <AdminAppointments />
          </AdminProtectedRoute>
        }
      />

      {/* ===== 404 NOT FOUND ===== */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center text-white bg-gradient-to-br from-gray-900 to-black text-2xl font-bold">
            <div className="text-center">
              <h1 className="text-6xl mb-4">404</h1>
              <p className="text-gray-400">Page Not Found</p>
              <button
                onClick={() => window.location.href = '/'}
                className="mt-6 px-6 py-3 bg-purple-600 rounded-xl hover:bg-purple-700 transition"
              >
                Go Home
              </button>
            </div>
          </div>
        }
      />
    </Routes>
  );
}