import React from "react";
import careBg from "../../assets/care-bg.jpg";

export default function Generations() {
  return (
    <section
      className="py-24 bg-cover bg-center"
      style={{ backgroundImage: `url(${careBg})` }}
    >
      <div className="bg-black/70 py-24">
        <div className="max-w-7xl mx-auto px-6">

          <h2 className="text-4xl font-bold text-center text-white">
            Healthcare For <span className="text-purple-400">Everyone</span>
          </h2>

          <p className="text-center text-gray-300 max-w-3xl mx-auto mt-6">
            AI-powered healthcare insights tailored for every stage of life,
            focusing on prevention, early detection, and continuous care.
          </p>

          <div className="grid md:grid-cols-4 gap-8 mt-16">
            {[
              {
                title: "Children",
                points: [
                  "Growth & height-weight tracking",
                  "BMI & obesity risk alerts",
                  "Vaccination schedule reminders",
                  "Nutrition & immunity guidance",
                  "Development milestone monitoring"
                ],
              },
              {
                title: "Women",
                points: [
                  "Menstrual cycle & ovulation tracking",
                  "Hormonal imbalance & PCOS insights",
                  "Pregnancy & postnatal care support",
                  "Breast & reproductive health checks",
                  "Mental wellness & stress monitoring"
                ],
              },
              {
                title: "Men",
                points: [
                  "Stress & burnout detection",
                  "Heart health & BP monitoring",
                  "Diabetes & lifestyle disease risk",
                  "Fitness, sleep & nutrition insights",
                  "Mental health & work-life balance"
                ],
              },
              {
                title: "Elderly",
                points: [
                  "Blood pressure & sugar tracking",
                  "Medication reminders & adherence",
                  "Fall risk & mobility assessment",
                  "Chronic disease management",
                  "Regular health alerts & reports"
                ],
              },
            ].map((item, i) => (
              <div
                key={i}
                className="backdrop-blur-md bg-white/10 p-8 rounded-2xl shadow-xl 
                           hover:bg-purple-600/40 transition duration-300"
              >
                <h3 className="text-xl font-bold text-white text-center mb-4">
                  {item.title}
                </h3>

                <ul className="space-y-2 text-gray-200 text-sm">
                  {item.points.map((point, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
