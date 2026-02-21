import React from "react";
import { FaEnvelope, FaPhoneAlt, FaExclamationTriangle } from "react-icons/fa";

export default function Contact() {
  return (
    <section id="contact" className="py-24 bg-black text-white">
      <div className="max-w-6xl mx-auto px-6">

        <h2 className="text-4xl font-bold text-center">
          Contact <span className="text-purple-400">Us</span>
        </h2>

        <p className="text-center text-gray-300 max-w-3xl mx-auto mt-6">
          HealthBridge is an AI-powered healthcare assistance platform.
          We help users connect with verified doctors and access health insights.
        </p>

        {/* Info Section */}
        <div className="grid md:grid-cols-2 gap-10 mt-16">

          {/* Left */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold">Platform Support</h3>

            <p className="text-gray-300">
              For any questions related to account access, doctor connections,
              technical issues, or general inquiries, feel free to reach out to us.
            </p>

            <div className="flex items-center gap-4">
              <FaEnvelope className="text-purple-400" />
              <span>support@healthbridge.ai</span>
            </div>

            <div className="flex items-center gap-4">
              <FaPhoneAlt className="text-purple-400" />
              <span>+91 9XXXXXXXXX</span>
            </div>

            {/* Emergency Notice */}
            <div className="mt-6 p-4 bg-red-500/20 border border-red-500/40 rounded-xl flex gap-4">
              <FaExclamationTriangle className="text-red-400 mt-1" />
              <p className="text-sm text-gray-200">
                <strong>Emergency Notice:</strong> HealthBridge does not provide
                medical treatment. In case of life-threatening emergencies,
                please contact your local emergency services immediately.
              </p>
            </div>
          </div>

          {/* Right - Contact Form */}
          <div className="backdrop-blur-lg bg-white/10 p-8 rounded-2xl shadow-xl">
            <h3 className="text-xl font-semibold mb-4">Send Us a Message</h3>

            <form className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full p-3 rounded-lg bg-black/60 border border-white/20 text-white"
              />

              <input
                type="email"
                placeholder="Your Email"
                className="w-full p-3 rounded-lg bg-black/60 border border-white/20 text-white"
              />

              <select className="w-full p-3 rounded-lg bg-black/60 border border-white/20 text-white">
                <option>General Inquiry</option>
                <option>Doctor Consultation Issue</option>
                <option>Technical Support</option>
                <option>Emergency Assistance Guidance</option>
              </select>

              <textarea
                rows="4"
                placeholder="Your Message"
                className="w-full p-3 rounded-lg bg-black/60 border border-white/20 text-white"
              />

              <button
                type="submit"
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold"
              >
                Submit Message
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
