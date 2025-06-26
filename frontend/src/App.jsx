import React, { useEffect, useState } from "react";
import axios from "axios";

const tagColors = {
  Internships: "bg-tagBlue",
  Scholarships: "bg-tagGreen",
  Competitions: "bg-tagYellow",
  Events: "bg-tagRed",
  Other: "bg-tagPurple",
};

function App() {
  const [opportunities, setOpportunities] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/opportunities")
      .then(res => setOpportunities(res.data))
      .catch(err => console.error("Error loading data:", err));
  }, []);

  const categories = [...new Set(opportunities.map(o => o.category))];

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-white font-inter">
      <h1 className="text-3xl font-bold mb-6">🎓 Opportunities Dashboard</h1>
      <div className="space-y-8">
        {categories.map(category => (
          <div key={category}>
            <h2 className="text-xl font-semibold mb-3">{category}</h2>
            <div className="bg-gray-800 rounded-lg shadow p-4">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700 text-left">
                    <th className="py-2">Title</th>
                    <th className="py-2">Deadline</th>
                    <th className="py-2">Tag</th>
                  </tr>
                </thead>
                <tbody>
                  {opportunities.filter(o => o.category === category).map((opp, idx) => (
                    <tr key={idx} className="border-t border-gray-700">
                      <td className="py-2">{opp.title}</td>
                      <td className="py-2">{opp.deadline}</td>
                      <td className="py-2">
                        <span className={`text-white px-2 py-1 rounded text-sm ${tagColors[opp.category] || 'bg-tagPurple'}`}>
                          {opp.category}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
