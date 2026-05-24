"use client";

import { Clock, ChevronLeft, ChevronRight } from "lucide-react";

export default function UsageTable() {
  const activities = [
    { id: 1, time: "2 mins ago", type: "Chat", language: "en", duration: "1.2s", status: "Success" },
    { id: 2, time: "15 mins ago", type: "Tool (Weather)", language: "en", duration: "0.8s", status: "Success" },
    { id: 3, time: "1 hour ago", type: "Chat", language: "hi", duration: "2.1s", status: "Success" },
    { id: 4, time: "2 hours ago", type: "STT Only", language: "fr", duration: "0.5s", status: "Error" },
  ];

  return (
    <div className="card p-0 overflow-hidden flex flex-col">
      <div className="p-6 border-b border-[#27272A] flex items-center space-x-2">
        <Clock className="w-5 h-5 text-white" />
        <h3 className="text-lg font-medium text-white">Recent Activity</h3>
      </div>
      
      {activities.length === 0 ? (
        <div className="p-8 text-center text-[#A1A1AA]">
          No activity yet. Run <code>jarvis_agent.py</code> to start.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#FAFAFA]">
            <thead className="bg-[#09090B] text-[#A1A1AA] border-b border-[#27272A]">
              <tr>
                <th className="px-6 py-4 font-medium">Time</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Language</th>
                <th className="px-6 py-4 font-medium">Duration</th>
                <th className="px-6 py-4 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272A]">
              {activities.map((item) => (
                <tr key={item.id} className="hover:bg-[#27272A]/30 transition-colors">
                  <td className="px-6 py-4 text-[#A1A1AA]">{item.time}</td>
                  <td className="px-6 py-4 font-medium">{item.type}</td>
                  <td className="px-6 py-4"><span className="uppercase text-xs bg-[#27272A] px-2 py-1 rounded">{item.language}</span></td>
                  <td className="px-6 py-4 font-mono">{item.duration}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={item.status === "Success" ? "badge-active" : "badge-inactive"}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="p-4 border-t border-[#27272A] flex items-center justify-between text-sm text-[#A1A1AA] bg-[#09090B]">
        <div>Showing 1 to 4 of 4 results</div>
        <div className="flex space-x-2">
          <button className="p-1 rounded hover:bg-[#27272A] transition-colors disabled:opacity-50" disabled>
            <ChevronLeft size={20} />
          </button>
          <button className="p-1 rounded hover:bg-[#27272A] transition-colors disabled:opacity-50" disabled>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
