import React, { useEffect, useState } from "react";
import axios from "axios";
import "./index.css";

function App() {
  const [opportunities, setOpportunities] = useState([]);
  const [filter, setFilter] = useState("All");
  const [viewMode, setViewMode] = useState("card"); // "card" or "table"

  useEffect(() => {
    axios
      .get("http://localhost:3001/opportunities")
      .then((res) => setOpportunities(res.data))
      .catch((err) => console.error("Error fetching opportunities", err));
  }, []);

  const tagColors = {
    Internship: "bg-purple-600",
    Hackathon: "bg-pink-600",
    "Research Internship": "bg-blue-600",
    "Women-only": "bg-rose-600",
    Other: "bg-gray-600",
  };

  const filteredOpps =
    filter === "All"
      ? opportunities
      : opportunities.filter((o) => o.category === filter);

  const groupedByCategory = [...new Set(filteredOpps.map((o) => o.category))];

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans px-6 py-10">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        🎓 Opportunities Dashboard
      </h1>

      {/* Filter and View Toggle */}
      <div className="mb-8 flex flex-wrap items-center gap-4">
        <div>
          <label className="mr-2 font-semibold">Filter:</label>
          <select
            className="text-black rounded px-2 py-1"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Hackathon">Hackathon</option>
            <option value="Women-only">Women-only</option>
          </select>
        </div>

        <div>
          <label className="mr-2 font-semibold">View:</label>
          <select
            className="text-black rounded px-2 py-1"
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
          >
            <option value="card">Card</option>
            <option value="table">Table</option>
          </select>
        </div>
      </div>

      {/* View Mode Switch */}
      {viewMode === "card" ? (
        groupedByCategory.map((category) => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">{category}</h2>
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOpps
                .filter((o) => o.category === category)
                .map((opp, idx) => (
                  <div
                    key={idx}
                    className="bg-[#1e293b] rounded-xl p-4 shadow hover:shadow-lg transition-all"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-400">
                        {opp.company}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs rounded font-semibold ${
                          tagColors[opp.category] || "bg-gray-700"
                        }`}
                      >
                        {opp.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-1">{opp.title}</h3>
                    <p className="text-sm text-gray-400">
                      Deadline: {opp.deadline}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        ))
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto bg-[#1e293b] rounded-xl text-left border border-gray-700">
            <thead>
              <tr className="bg-[#334155]">
                <th className="px-4 py-2 border-b border-gray-600">Company</th>
                <th className="px-4 py-2 border-b border-gray-600">Title</th>
                <th className="px-4 py-2 border-b border-gray-600">Category</th>
                <th className="px-4 py-2 border-b border-gray-600">Deadline</th>
              </tr>
            </thead>
            <tbody>
              {filteredOpps.map((opp, idx) => (
                <tr key={idx} className="hover:bg-[#475569] transition">
                  <td className="px-4 py-2 border-b border-gray-600">
                    {opp.company}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-600">
                    {opp.title}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-600">
                    <span
                      className={`px-2 py-1 text-xs rounded font-semibold ${
                        tagColors[opp.category] || "bg-gray-700"
                      }`}
                    >
                      {opp.category}
                    </span>
                  </td>
                  <td className="px-4 py-2 border-b border-gray-600">
                    {opp.deadline}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
