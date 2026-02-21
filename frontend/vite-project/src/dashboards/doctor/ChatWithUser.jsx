import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaArrowLeft, FaPaperPlane, FaUserCircle, FaVideo, FaPhone, FaEllipsisV } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

export default function ChatWithUser() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const messagesEndRef = useRef(null);
  
  // Get patientId from URL params
  const queryParams = new URLSearchParams(location.search);
  const patientIdFromUrl = queryParams.get("patientId");
  const patientNameFromUrl = queryParams.get("patientName");

  // Fetch patients list for sidebar
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/doctor/patients", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPatients(response.data);
        
        // If patientId is in URL, select that patient
        if (patientIdFromUrl) {
          const patient = response.data.find(p => p._id === patientIdFromUrl);
          if (patient) {
            setSelectedPatient(patient);
          }
        }
      } catch (err) {
        console.error("Error fetching patients:", err);
      }
    };

    fetchPatients();
  }, [token, patientIdFromUrl]);

  // Fetch messages when patient is selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedPatient) return;
      
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/chat/${selectedPatient._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages(response.data);
      } catch (err) {
        console.error("Error fetching messages:", err);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [selectedPatient, token]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedPatient) return;

    try {
      const response = await axios.post(
        "http://localhost:5000/api/chat/send",
        {
          receiverId: selectedPatient._id,
          message: newMessage,
          role: "doctor"
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages([...messages, response.data]);
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const selectPatient = (patient) => {
    setSelectedPatient(patient);
    navigate(`/doctor/chat?patientId=${patient._id}&patientName=${encodeURIComponent(patient.name)}`);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white flex flex-col">
      {/* Header */}
      <div className="bg-white/5 border-b border-white/10 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/doctor/dashboard")}
            className="p-2 hover:bg-white/10 rounded-lg transition"
          >
            <FaArrowLeft />
          </button>
          <h1 className="text-xl font-semibold">Patient Chat</h1>
        </div>
        {selectedPatient && (
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-white/10 rounded-lg transition">
              <FaPhone />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-lg transition">
              <FaVideo />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-lg transition">
              <FaEllipsisV />
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Patients Sidebar */}
        <div className="w-80 bg-black/40 border-r border-white/10 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-sm font-semibold text-gray-400 mb-4">PATIENTS</h2>
            {patients.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No patients yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {patients.map((patient) => (
                  <button
                    key={patient._id}
                    onClick={() => selectPatient(patient)}
                    className={`w-full p-3 rounded-xl transition flex items-center gap-3 ${
                      selectedPatient?._id === patient._id
                        ? "bg-blue-600/30 border border-blue-500/50"
                        : "hover:bg-white/5"
                    }`}
                  >
                    <div className="bg-gradient-to-br from-blue-600 to-purple-600 w-10 h-10 rounded-full flex items-center justify-center">
                      {patient.name?.charAt(0) || "P"}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium">{patient.name}</p>
                      <p className="text-xs text-gray-400">
                        {patient.lastMessage || "No messages yet"}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {!selectedPatient ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-xl font-semibold mb-2">No Chat Selected</h3>
                <p className="text-gray-400">Select a patient from the sidebar to start chatting</p>
              </div>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="bg-white/5 p-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-blue-600 to-purple-600 w-10 h-10 rounded-full flex items-center justify-center">
                    {selectedPatient.name?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold">{selectedPatient.name}</h3>
                    <p className="text-xs text-green-400">Online</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loading ? (
                  <div className="flex justify-center">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${msg.senderId === user?._id ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-2xl ${
                          msg.senderId === user?._id
                            ? "bg-blue-600 text-white rounded-br-none"
                            : "bg-white/10 text-white rounded-bl-none"
                        }`}
                      >
                        <p>{msg.message}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={sendMessage} className="p-4 bg-white/5 border-t border-white/10">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none text-white"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="px-6 py-3 bg-blue-600 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <FaPaperPlane />
                    Send
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}