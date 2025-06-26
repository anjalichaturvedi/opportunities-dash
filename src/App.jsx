import React, { useState } from "react";

function App() {
  const [adminMode, setAdminMode] = useState(false);
  const [opportunities, setOpportunities] = useState([
    { title: "Internship at XYZ", deadline: "2025-07-01", category: "Internships" },
    { title: "Scholarship ABC", deadline: "2025-08-15", category: "Scholarships" },
  ]);
  const [newOpp, setNewOpp] = useState({ title: "", deadline: "", category: "" });

  const addOpportunity = () => {
    if (!newOpp.title || !newOpp.deadline || !newOpp.category) return;
    setOpportunities([...opportunities, newOpp]);
    setNewOpp({ title: "", deadline: "", category: "" });
  };

  const categories = [...new Set(opportunities.map(o => o.category))];

  return (
    <div className="p-6 min-h-screen bg-gray-100 font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">College Opportunities Dashboard</h1>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
          onClick={() => setAdminMode(!adminMode)}
        >
          {adminMode ? "Exit Admin" : "Enter Admin"}
        </button>
      </div>

      {adminMode && (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <input
            className="border p-2 rounded w-full mb-2"
            placeholder="Title"
            value={newOpp.title}
            onChange={e => setNewOpp({ ...newOpp, title: e.target.value })}
          />
          <input
            className="border p-2 rounded w-full mb-2"
            type="date"
            value={newOpp.deadline}
            onChange={e => setNewOpp({ ...newOpp, deadline: e.target.value })}
          />
          <input
            className="border p-2 rounded w-full mb-2"
            placeholder="Category"
            value={newOpp.category}
            onChange={e => setNewOpp({ ...newOpp, category: e.target.value })}
          />
          <button
            className="px-4 py-2 bg-green-600 text-white rounded"
            onClick={addOpportunity}
          >
            Add Opportunity
          </button>
        </div>
      )}

      <div className="space-y-6">
        {categories.map(category => (
          <div key={category}>
            <h2 className="text-xl font-semibold mb-2">{category}</h2>
            <div className="bg-white rounded shadow p-4">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2">Title</th>
                    <th className="py-2">Deadline</th>
                  </tr>
                </thead>
                <tbody>
                  {opportunities
                    .filter(o => o.category === category)
                    .map((opp, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="py-2">{opp.title}</td>
                        <td className="py-2">{opp.deadline}</td>
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
