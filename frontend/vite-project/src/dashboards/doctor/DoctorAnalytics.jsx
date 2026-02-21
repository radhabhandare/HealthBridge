import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaChartBar, FaUsers, FaCalendarCheck, FaRupeeSign,
  FaStar, FaArrowUp, FaArrowDown, FaClock,
  FaUserMd, FaHeartbeat, FaStethoscope
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

export default function DoctorAnalytics() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [analytics, setAnalytics] = useState({
    patients: { total: 0, new: 0, returning: 0 },
    appointments: { total: 0, completed: 0, cancelled: 0, pending: 0 },
    revenue: { total: 0, monthly: 0, average: 0 },
    ratings: { average: 4.8, total: 0, breakdown: {} }
  });
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("month"); // week, month, year

  useEffect(() => {
    fetchAnalytics();
  }, [timeframe]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/doctor/analytics?timeframe=${timeframe}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalytics(response.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FaChartBar className="text-pink-400" />
            Analytics Dashboard
          </h1>
          <p className="text-gray-400 mt-2">
            Track your practice performance and metrics
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setTimeframe("week")}
            className={`px-4 py-2 rounded-lg transition ${
              timeframe === "week" ? 'bg-pink-600' : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeframe("month")}
            className={`px-4 py-2 rounded-lg transition ${
              timeframe === "month" ? 'bg-pink-600' : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setTimeframe("year")}
            className={`px-4 py-2 rounded-lg transition ${
              timeframe === "year" ? 'bg-pink-600' : 'bg-white/5 hover:bg-white/10'
            }`}
          >
            Year
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          icon={<FaUsers />}
          title="Total Patients"
          value={analytics.patients.total}
          change="+12%"
          positive={true}
          color="blue"
        />
        <MetricCard
          icon={<FaCalendarCheck />}
          title="Appointments"
          value={analytics.appointments.completed}
          subtitle={`${analytics.appointments.pending} pending`}
          color="green"
        />
        <MetricCard
          icon={<FaRupeeSign />}
          title="Revenue"
          value={`₹${analytics.revenue.total.toLocaleString()}`}
          change="+8%"
          positive={true}
          color="purple"
        />
        <MetricCard
          icon={<FaStar />}
          title="Rating"
          value={analytics.ratings.average}
          subtitle={`${analytics.ratings.total} reviews`}
          color="yellow"
        />
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Appointments Overview */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold mb-4">Appointments Overview</h3>
          <div className="space-y-4">
            <ProgressBar 
              label="Completed" 
              value={analytics.appointments.completed} 
              total={analytics.appointments.total}
              color="green"
            />
            <ProgressBar 
              label="Pending" 
              value={analytics.appointments.pending} 
              total={analytics.appointments.total}
              color="yellow"
            />
            <ProgressBar 
              label="Cancelled" 
              value={analytics.appointments.cancelled} 
              total={analytics.appointments.total}
              color="red"
            />
          </div>
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Completion Rate</span>
              <span className="text-green-400 font-semibold">
                {Math.round((analytics.appointments.completed / analytics.appointments.total) * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Patient Demographics */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold mb-4">Patient Demographics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">New Patients</span>
              <span className="font-semibold">{analytics.patients.new}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Returning Patients</span>
              <span className="font-semibold">{analytics.patients.returning}</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${(analytics.patients.new / analytics.patients.total) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-400 text-center">
              {Math.round((analytics.patients.new / analytics.patients.total) * 100)}% new patients
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity & Top Procedures */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Top Specializations */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaStethoscope className="text-purple-400" />
            Top Procedures
          </h3>
          <div className="space-y-3">
            <ProcedureItem name="General Consultation" count={45} percentage={40} />
            <ProcedureItem name="Cardiac Checkup" count={28} percentage={25} />
            <ProcedureItem name="Follow-up Visit" count={22} percentage={20} />
            <ProcedureItem name="Emergency" count={15} percentage={15} />
          </div>
        </div>

        {/* Rating Breakdown */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaStar className="text-yellow-400" />
            Rating Breakdown
          </h3>
          <div className="space-y-2">
            <RatingBar stars={5} percentage={75} count={90} />
            <RatingBar stars={4} percentage={15} count={18} />
            <RatingBar stars={3} percentage={6} count={7} />
            <RatingBar stars={2} percentage={3} count={4} />
            <RatingBar stars={1} percentage={1} count={1} />
          </div>
        </div>

        {/* Busy Hours */}
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaClock className="text-blue-400" />
            Peak Hours
          </h3>
          <div className="space-y-3">
            <HourItem time="10:00 AM - 12:00 PM" appointments={12} percentage={100} />
            <HourItem time="04:00 PM - 06:00 PM" appointments={10} percentage={83} />
            <HourItem time="09:00 AM - 10:00 AM" appointments={8} percentage={66} />
            <HourItem time="02:00 PM - 04:00 PM" appointments={6} percentage={50} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Metric Card Component
function MetricCard({ icon, title, value, subtitle, change, positive, color }) {
  const colors = {
    blue: "bg-blue-600/20 border-blue-500/30 text-blue-400",
    green: "bg-green-600/20 border-green-500/30 text-green-400",
    purple: "bg-purple-600/20 border-purple-500/30 text-purple-400",
    yellow: "bg-yellow-600/20 border-yellow-500/30 text-yellow-400"
  };

  return (
    <div className={`${colors[color]} p-6 rounded-xl border`}>
      <div className="flex items-start justify-between mb-4">
        <div className="text-2xl">{icon}</div>
        {change && (
          <span className={`flex items-center gap-1 text-sm ${
            positive ? 'text-green-400' : 'text-red-400'
          }`}>
            {positive ? <FaArrowUp /> : <FaArrowDown />}
            {change}
          </span>
        )}
      </div>
      <h3 className="text-sm font-medium mb-1">{title}</h3>
      <div className="text-2xl font-bold">{value}</div>
      {subtitle && <p className="text-xs opacity-80 mt-1">{subtitle}</p>}
    </div>
  );
}

// Progress Bar Component
function ProgressBar({ label, value, total, color }) {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  const colors = {
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    red: "bg-red-500",
    blue: "bg-blue-500"
  };

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-400">{label}</span>
        <span className="text-white">{value}</span>
      </div>
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <div 
          className={`h-full ${colors[color]} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}

// Procedure Item Component
function ProcedureItem({ name, count, percentage }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-400">{name}</span>
        <span className="text-white">{count}</span>
      </div>
      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div 
          className="h-full bg-purple-500 rounded-full"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}

// Rating Bar Component
function RatingBar({ stars, percentage, count }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-400 w-12">{stars} ★</span>
      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
        <div 
          className="h-full bg-yellow-400 rounded-full"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <span className="text-sm text-gray-400 w-12">{count}</span>
    </div>
  );
}

// Hour Item Component
function HourItem({ time, appointments, percentage }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-400">{time}</span>
        <span className="text-white">{appointments} patients</span>
      </div>
      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-500 rounded-full"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}