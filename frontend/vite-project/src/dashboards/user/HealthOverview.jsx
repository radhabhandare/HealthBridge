export default function HealthOverview() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h2 className="text-3xl font-bold mb-4">
        AI Health Overview
      </h2>

      <p className="text-gray-400 mb-6">
        Personalized health insights powered by AI
      </p>

      <div className="bg-purple-900/40 p-6 rounded-xl">
        <ul className="list-disc ml-6">
          <li>Symptom analysis</li>
          <li>Health risk prediction</li>
          <li>Lifestyle suggestions</li>
        </ul>
      </div>
    </div>
  );
}
