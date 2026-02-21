import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  FaBars, FaTimes, FaUserMd, FaUser, FaShieldAlt, 
  FaSignOutAlt, FaUserCircle, FaTachometerAlt, FaBell, 
  FaCheckCircle, FaClock, FaLock, FaHospital,
  FaCalendarCheck, FaUsers, FaChartBar, FaCog,
  FaStar, FaComments, FaHeartbeat
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [showAdminTooltip, setShowAdminTooltip] = useState(false);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState(0);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated, token } = useAuth();

  // Fetch pending doctors for admin
  useEffect(() => {
    if (user?.role === "admin") {
      fetchPendingDoctors();
      const interval = setInterval(fetchPendingDoctors, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Fetch doctor profile if logged in as doctor
  useEffect(() => {
    if (user?.role === "doctor" && token) {
      fetchDoctorProfile();
      fetchUnreadMessages();
    }
  }, [user, token]);

  // Fetch user data if logged in as user
  useEffect(() => {
    if (user?.role === "user" && token) {
      fetchUserNotifications();
    }
  }, [user, token]);

  const fetchPendingDoctors = async () => {
    try {
      setLoadingNotifications(true);
      const response = await axios.get("http://localhost:5000/api/admin/pending-doctors", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendingDoctors(response.data);
    } catch (error) {
      console.error("Error fetching pending doctors:", error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const fetchDoctorProfile = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/doctor/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDoctorProfile(response.data);
    } catch (error) {
      console.error("Error fetching doctor profile:", error);
    }
  };

  const fetchUnreadMessages = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/chat/unread", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUnreadMessages(response.data.count);
    } catch (error) {
      console.error("Error fetching unread messages:", error);
    }
  };

  const fetchUserNotifications = async () => {
    // Fetch user-specific notifications
    try {
      const response = await axios.get("http://localhost:5000/api/user/notifications", {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Handle user notifications
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-dropdown') && !event.target.closest('.notification-dropdown')) {
        setDropdownOpen(false);
        setNotificationOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Doctors", path: "/doctors" },
    { name: "Services", path: "/services" },
    { name: "Appointments", path: "/appointments" },
    { name: "Contact", path: "/#contact" },
  ];

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setNotificationOpen(false);
    setMobileOpen(false);
    navigate("/");
  };

  const getDashboardPath = () => {
    if (!user) return "/login/user";
    switch (user.role) {
      case "admin":
        return "/admin/dashboard";
      case "doctor":
        return "/doctor/dashboard";
      default:
        return "/user/dashboard";
    }
  };

  const getDashboardIcon = () => {
    switch (user?.role) {
      case "admin":
        return <FaShieldAlt className="mr-2" />;
      case "doctor":
        return <FaUserMd className="mr-2" />;
      default:
        return <FaTachometerAlt className="mr-2" />;
    }
  };

  const handleNotificationClick = () => {
    setNotificationOpen(!notificationOpen);
    if (user?.role === "admin") {
      fetchPendingDoctors();
    }
  };

  const goToVerifyDoctors = () => {
    setNotificationOpen(false);
    navigate("/admin/verify-doctors");
  };

  // Secret admin login trigger (double-click on logo)
  const handleLogoDoubleClick = () => {
    navigate("/login/admin");
  };

  // Get role-specific menu items
  const getRoleSpecificMenuItems = () => {
    if (!isAuthenticated) return null;

    switch (user?.role) {
      case "admin":
        return (
          <>
            <Link
              to="/admin/dashboard"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setDropdownOpen(false)}
            >
              <FaShieldAlt className="inline mr-2" /> Dashboard
            </Link>
            <Link
              to="/admin/verify-doctors"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setDropdownOpen(false)}
            >
              <FaUserMd className="inline mr-2" /> Verify Doctors
              {pendingDoctors.length > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {pendingDoctors.length}
                </span>
              )}
            </Link>
            <Link
              to="/admin/users"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setDropdownOpen(false)}
            >
              <FaUsers className="inline mr-2" /> Manage Users
            </Link>
            <Link
              to="/admin/doctors"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setDropdownOpen(false)}
            >
              <FaUserMd className="inline mr-2" /> Manage Doctors
            </Link>
            <Link
              to="/admin/appointments"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setDropdownOpen(false)}
            >
              <FaCalendarCheck className="inline mr-2" /> Appointments
            </Link>
          </>
        );

      case "doctor":
        return (
          <>
            <Link
              to="/doctor/dashboard"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setDropdownOpen(false)}
            >
              <FaTachometerAlt className="inline mr-2" /> Dashboard
            </Link>
            <Link
              to="/doctor/profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setDropdownOpen(false)}
            >
              <FaUserCircle className="inline mr-2" /> My Profile
            </Link>
            <Link
              to="/doctor/patients"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setDropdownOpen(false)}
            >
              <FaUsers className="inline mr-2" /> My Patients
            </Link>
            <Link
              to="/doctor/appointments"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setDropdownOpen(false)}
            >
              <FaCalendarCheck className="inline mr-2" /> Appointments
            </Link>
            <Link
              to="/doctor/chat"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 relative"
              onClick={() => setDropdownOpen(false)}
            >
              <FaComments className="inline mr-2" /> Messages
              {unreadMessages > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {unreadMessages}
                </span>
              )}
            </Link>
            <Link
              to="/doctor/clinic"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setDropdownOpen(false)}
            >
              <FaHospital className="inline mr-2" /> Clinic Info
            </Link>
            <Link
              to="/doctor/analytics"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setDropdownOpen(false)}
            >
              <FaChartBar className="inline mr-2" /> Analytics
            </Link>
          </>
        );

      case "user":
        return (
          <>
            <Link
              to="/user/dashboard"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setDropdownOpen(false)}
            >
              <FaTachometerAlt className="inline mr-2" /> Dashboard
            </Link>
            <Link
              to="/user/profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setDropdownOpen(false)}
            >
              <FaUserCircle className="inline mr-2" /> My Profile
            </Link>
            <Link
              to="/user/health"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setDropdownOpen(false)}
            >
              <FaHeartbeat className="inline mr-2" /> Health Overview
            </Link>
            <Link
              to="/appointments"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setDropdownOpen(false)}
            >
              <FaCalendarCheck className="inline mr-2" /> Book Appointment
            </Link>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

        {/* Logo with double-click admin access */}
        <div
          onClick={() => navigate("/")}
          onDoubleClick={handleLogoDoubleClick}
          className="flex items-center gap-2 cursor-pointer group relative"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-600 to-green-700 text-white flex items-center justify-center font-bold text-lg group-hover:scale-105 transition">
            HB
          </div>
          <div>
            <h1 className="text-xl font-bold text-green-700 leading-tight">
              HealthBridge
            </h1>
            <p className="text-xs text-gray-500">
              Healthcare Solutions
            </p>
          </div>
          
          {/* Secret admin tooltip */}
          <div className="absolute -bottom-8 left-0 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap">
            Double-click for admin
          </div>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-2 bg-gray-50 shadow-sm rounded-full px-4 py-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  location.pathname === item.path
                    ? "bg-green-600 text-white shadow-md"
                    : "text-gray-600 hover:text-green-700 hover:bg-green-50"
                }`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              {/* Notification Bell for Admin */}
              {user?.role === "admin" && (
                <div className="relative notification-dropdown">
                  <button
                    onClick={handleNotificationClick}
                    className="relative p-2 hover:bg-gray-100 rounded-full transition"
                    title="Pending doctor verifications"
                  >
                    <FaBell className="text-xl text-gray-600" />
                    {pendingDoctors.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                        {pendingDoctors.length}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {notificationOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border py-2 z-50">
                      <div className="px-4 py-3 border-b flex justify-between items-center">
                        <h3 className="font-semibold text-gray-800">Doctor Verifications</h3>
                        {pendingDoctors.length > 0 && (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                            {pendingDoctors.length} pending
                          </span>
                        )}
                      </div>
                      
                      <div className="max-h-96 overflow-y-auto">
                        {loadingNotifications ? (
                          <div className="flex justify-center py-4">
                            <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        ) : pendingDoctors.length > 0 ? (
                          pendingDoctors.map((doctor) => (
                            <div key={doctor._id} className="px-4 py-3 hover:bg-gray-50 border-b last:border-b-0">
                              <div className="flex items-start gap-3">
                                <div className="bg-yellow-100 p-2 rounded-full">
                                  <FaClock className="text-yellow-600" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-800">
                                    Dr. {doctor.name}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {doctor.email} • {doctor.speciality || "Specialist"}
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    Registered {new Date(doctor.createdAt).toLocaleDateString()}
                                  </p>
                                  <button
                                    onClick={() => {
                                      setNotificationOpen(false);
                                      navigate(`/admin/verify-doctors?doctor=${doctor._id}`);
                                    }}
                                    className="mt-2 text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full hover:bg-green-200 transition"
                                  >
                                    Review Application
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-8 text-center">
                            <FaCheckCircle className="text-3xl text-gray-300 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">No pending verifications</p>
                          </div>
                        )}
                      </div>
                      
                      {pendingDoctors.length > 0 && (
                        <div className="border-t px-4 py-2">
                          <button
                            onClick={goToVerifyDoctors}
                            className="w-full text-center text-sm text-green-600 hover:text-green-700 font-medium py-2"
                          >
                            View All Verifications
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Messages Bell for Doctor */}
              {user?.role === "doctor" && unreadMessages > 0 && (
                <button
                  onClick={() => navigate("/doctor/chat")}
                  className="relative p-2 hover:bg-gray-100 rounded-full transition"
                  title="Unread messages"
                >
                  <FaComments className="text-xl text-gray-600" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {unreadMessages}
                  </span>
                </button>
              )}

              {/* User Dropdown */}
              <div className="relative user-dropdown">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-3 px-3 py-2 rounded-full bg-green-50 hover:bg-green-100 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-600 to-green-700 text-white flex items-center justify-center font-bold text-sm">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                  <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">
                    {user?.name?.split(" ")[0] || "User"}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border py-2 z-50">
                    <div className="px-4 py-3 border-b">
                      <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{user?.email}</p>
                      <div className="mt-2">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                          user?.role === 'admin' ? 'bg-red-100 text-red-700' :
                          user?.role === 'doctor' ? 'bg-blue-100 text-blue-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                        </span>
                      </div>
                      {user?.role === "doctor" && doctorProfile?.rating && (
                        <div className="mt-2 flex items-center gap-1 text-xs text-yellow-500">
                          <FaStar /> {doctorProfile.rating} • {doctorProfile.reviewCount || 0} reviews
                        </div>
                      )}
                    </div>

                    {/* Role-specific menu items */}
                    {getRoleSpecificMenuItems()}

                    <div className="border-t mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition"
                      >
                        <FaSignOutAlt className="mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Secret Admin Link - Hidden but accessible */}
              <button
                onClick={() => navigate("/login/admin")}
                className="text-gray-300 hover:text-yellow-600 transition mr-1"
                title="Admin Login"
              >
                <FaLock size={14} />
              </button>

              <button
                onClick={() => navigate("/login/doctor")}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-green-600 text-green-700 hover:bg-green-50 transition text-sm font-medium"
              >
                <FaUserMd />
                Doctor
              </button>

              <button
                onClick={() => navigate("/login/user")}
                className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 transition shadow-md text-sm font-medium"
              >
                <FaUser />
                Login
              </button>

              <button
                onClick={() => navigate("/register/user")}
                className="text-sm text-gray-600 hover:text-green-700 font-medium"
              >
                Sign Up
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-green-700 p-2 hover:bg-green-50 rounded-lg transition relative"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          {user?.role === "admin" && pendingDoctors.length > 0 && !mobileOpen && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {pendingDoctors.length}
            </span>
          )}
          {user?.role === "doctor" && unreadMessages > 0 && !mobileOpen && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {unreadMessages}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t shadow-lg max-h-[90vh] overflow-y-auto">
          {/* User Info if logged in */}
          {isAuthenticated && (
            <div className="p-4 bg-green-50 border-b">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-600 to-green-700 text-white flex items-center justify-center font-bold text-lg">
                  {user?.name?.charAt(0) || "U"}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{user?.name}</p>
                  <p className="text-xs text-gray-600">{user?.email}</p>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                    user?.role === 'admin' ? 'bg-red-100 text-red-700' :
                    user?.role === 'doctor' ? 'bg-blue-100 text-blue-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                  </span>
                </div>
              </div>

              {/* Mobile Notifications for Admin */}
              {user?.role === "admin" && pendingDoctors.length > 0 && (
                <div className="mt-3 bg-yellow-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-yellow-800">Pending Verifications</span>
                    <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {pendingDoctors.length}
                    </span>
                  </div>
                  {pendingDoctors.slice(0, 2).map((doctor) => (
                    <div key={doctor._id} className="text-xs text-gray-600 py-1">
                      • Dr. {doctor.name} - {doctor.speciality || "Specialist"}
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      navigate("/admin/verify-doctors");
                      setMobileOpen(false);
                    }}
                    className="mt-2 w-full text-center text-xs bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700 transition"
                  >
                    Review All Applications
                  </button>
                </div>
              )}

              {/* Mobile Unread Messages for Doctor */}
              {user?.role === "doctor" && unreadMessages > 0 && (
                <div className="mt-3 bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-blue-800">Unread Messages</span>
                    <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadMessages}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      navigate("/doctor/chat");
                      setMobileOpen(false);
                    }}
                    className="mt-2 w-full text-center text-xs bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    View Messages
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Menu Items */}
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`block px-6 py-3 ${
                location.pathname === item.path
                  ? "bg-green-600 text-white font-medium"
                  : "text-gray-700 hover:bg-green-50"
              }`}
            >
              {item.name}
            </Link>
          ))}

          {/* Secret Admin Link for Mobile */}
          {!isAuthenticated && (
            <button
              onClick={() => {
                navigate("/login/admin");
                setMobileOpen(false);
              }}
              className="w-full text-left px-6 py-2 text-xs text-gray-400 hover:text-yellow-600 border-t border-gray-100"
            >
              <FaLock className="inline mr-1" size={10} />
              Admin Access
            </button>
          )}

          {/* Auth Links for Mobile */}
          {isAuthenticated ? (
            <>
              <div className="border-t border-gray-200 mt-2">
                {getRoleSpecificMenuItems()}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-6 py-3 text-red-600 hover:bg-red-50 border-t"
                >
                  <FaSignOutAlt className="inline mr-2" />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="border-t border-gray-200 mt-2">
                <button
                  onClick={() => {
                    navigate("/login/doctor");
                    setMobileOpen(false);
                  }}
                  className="w-full text-left px-6 py-3 text-green-700 hover:bg-green-50"
                >
                  <FaUserMd className="inline mr-2" />
                  Doctor Login
                </button>

                <button
                  onClick={() => {
                    navigate("/login/user");
                    setMobileOpen(false);
                  }}
                  className="w-full text-left px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium"
                >
                  <FaUser className="inline mr-2" />
                  User Login
                </button>

                <button
                  onClick={() => {
                    navigate("/register/user");
                    setMobileOpen(false);
                  }}
                  className="w-full text-left px-6 py-3 text-gray-600 hover:bg-gray-50"
                >
                  Create Account
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </nav>
  );
}