import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "./index.css";

const tagColors = {
  Internship: "bg-purple-600",
  Hackathon: "bg-pink-600",
  "Research Fellowship": "bg-yellow-600",
  "Women-only": "bg-blue-600",
  "Scholarship": "bg-orange-600",
  "Mentorship": "bg-teal-600",
  Other: "bg-gray-600",
};

function App() {
  const [opportunities, setOpportunities] = useState([]);
  const [filter, setFilter] = useState("All");
  const [view, setView] = useState("Card");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    axios
      .get("http://localhost:3001/opportunities")
      .then((res) => setOpportunities(res.data))
      .catch((err) => console.error("Error fetching opportunities", err));
  }, []);

  const getMonth = (monthStr) => monthStr;

  const filteredOpps = opportunities
    .filter((o) =>
      filter === "All" ? true : o.category.toLowerCase() === filter.toLowerCase()
    )
    .filter((o) =>
      search ? o.title.toLowerCase().includes(search.toLowerCase()) || o.company.toLowerCase().includes(search.toLowerCase()) : true
    )
    .sort((a, b) => {
      if (sortBy === "deadline") return a.deadline.localeCompare(b.deadline);
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return 0;
    });

  const groupedByCategory = [...new Set(filteredOpps.map((o) => o.category))];

  return (
    <div className="font-sans"> 
    <div className="min-h-screen bg-[#0f172a] text-white font-sans px-6 py-10">
     <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 flex-wrap">
  {/* Title */}
  <div className="flex items-center gap-3">
    <span className="text-3xl">🎓</span>
    <h1 className="text-3xl font-extrabold text-white">Opportunities Dashboard</h1>
  </div>

  {/* Filter controls */}
  <div className="flex flex-wrap items-center gap-3 mt-2 md:mt-0">
    {/* Filter */}
    <div className="flex items-center gap-2">
      <label className="text-white text-sm">Filter:</label>
      <select
  value={filter}
  onChange={(e) => setFilter(e.target.value)}
  className="z-50 appearance-none bg-[#1e293b] text-white text-sm px-4 py-[6px] rounded-lg border border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-400"
>
  <option value="All">All</option>
  <option value="Hackathon">Hackathon</option>
  <option value="Women-only">Women-only</option>
  <option value="Internship">Internship</option>
  <option value="Scholarship">Scholarship</option>
  <option value="Research Fellowship">Research Fellowship</option>
  <option value="Mentorship">Mentorship</option>
</select>

    </div>

    {/* View */}
    <div className="flex items-center gap-2">
      <label className="text-white text-sm">View:</label>
      <select
        value={view}
        onChange={(e) => setView(e.target.value)}
        className="appearance-none bg-transparent text-white text-sm px-4 py-[6px] rounded-lg border border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-400"
      >
        <option value="Card">Card</option>
        <option value="Table">Table</option>
      </select>
    </div>

    {/* Search */}
    <div>
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="bg-transparent text-white text-sm px-4 py-[6px] rounded-lg border border-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-400"
      />
    </div>
  </div>
</div>



      {view === "Card" ? (
        groupedByCategory.map((category) => (
          <div key={category} className="mb-12">
            <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">{category}</h2>
            <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOpps
                .filter((o) => o.category === category)
                .map((opp, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 shadow-md border border-slate-700"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-400">{opp.company}</span>
                      <span className={`px-2 py-1 text-xs rounded-full font-semibold ${tagColors[opp.category] || "bg-gray-700"}`}>
                        {opp.category}
                      </span>
                    </div>
                    <h3 className="text-base font-semibold mb-1 leading-snug">
                      {opp.title}
                    </h3>
                    <p className="text-xs text-gray-400">Month: {getMonth(opp.deadline)}</p>
                  </motion.div>
                ))}
            </div>
          </div>
        ))
      ) : (
        <div className="overflow-x-auto mt-6">
          <table className="min-w-full text-sm border-separate border-spacing-y-2">
            <thead>
              <tr className="text-left text-gray-400">
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Company</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Deadline</th>
              </tr>
            </thead>
            <tbody>
              {filteredOpps.map((opp, idx) => (
                <tr key={idx} className="bg-slate-800 text-white">
                  <td className="py-2 px-4 font-medium">{opp.title}</td>
                  <td className="py-2 px-4">{opp.company}</td>
                  <td className="py-2 px-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${tagColors[opp.category] || "bg-gray-700"}`}>{opp.category}</span>
                  </td>
                  <td className="py-2 px-4">{getMonth(opp.deadline)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
    </div>
  );
}

export default App;
