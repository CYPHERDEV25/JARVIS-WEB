"use client";

import Sidebar from "@/components/Sidebar";

export default function UsagePage() {
  return (
    <div className="flex h-screen bg-[#09090B] overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Usage Analytics</h1>
              <p className="text-[#A1A1AA]">Monitor your API consumption</p>
            </div>
            <select className="bg-[#18181B] border border-[#27272A] text-[#FAFAFA] rounded-md px-3 py-2 outline-none focus:border-[#6366F1]">
              <option>Today</option>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="card">
              <h3 className="text-sm font-medium text-[#A1A1AA] mb-6">Requests per day</h3>
              <div className="h-48 flex items-end space-x-2">
                {/* Mock Bar Chart */}
                {[40, 70, 45, 90, 60, 100, 30].map((h, i) => (
                  <div key={i} className="flex-1 bg-[#6366F1]/20 hover:bg-[#6366F1] transition-colors rounded-t-sm" style={{ height: `${h}%` }}></div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-[#A1A1AA] mt-2">
                <span>Mon</span>
                <span>Sun</span>
              </div>
            </div>

            <div className="card">
              <h3 className="text-sm font-medium text-[#A1A1AA] mb-6">Minutes used per day</h3>
              <div className="h-48 relative border-b border-l border-[#27272A]">
                {/* Mock Line Chart (using svg for a simple line) */}
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <polyline
                    fill="none"
                    stroke="#22C55E"
                    strokeWidth="2"
                    points="0,80 15,60 30,70 50,30 70,50 85,10 100,40"
                  />
                </svg>
              </div>
              <div className="flex justify-between text-xs text-[#A1A1AA] mt-2">
                <span>Mon</span>
                <span>Sun</span>
              </div>
            </div>
          </div>

          <div className="card p-0 mb-8 overflow-hidden">
            <div className="p-6 border-b border-[#27272A]">
              <h3 className="text-lg font-medium text-white">Usage by Language</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-[#FAFAFA]">
                <thead className="bg-[#09090B] text-[#A1A1AA] border-b border-[#27272A]">
                  <tr>
                    <th className="px-6 py-4 font-medium">Language</th>
                    <th className="px-6 py-4 font-medium">Requests</th>
                    <th className="px-6 py-4 font-medium">Minutes</th>
                    <th className="px-6 py-4 font-medium text-right">Last Used</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#27272A]">
                  <tr className="hover:bg-[#27272A]/30">
                    <td className="px-6 py-4">English</td>
                    <td className="px-6 py-4">1,240</td>
                    <td className="px-6 py-4">42.5</td>
                    <td className="px-6 py-4 text-right text-[#A1A1AA]">2 mins ago</td>
                  </tr>
                  <tr className="hover:bg-[#27272A]/30">
                    <td className="px-6 py-4">Hindi</td>
                    <td className="px-6 py-4">850</td>
                    <td className="px-6 py-4">28.2</td>
                    <td className="px-6 py-4 text-right text-[#A1A1AA]">1 hour ago</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="card bg-[#6366F1]/10 border-[#6366F1]/30">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-white mb-1">Total Summary</h3>
                <p className="text-[#A1A1AA] text-sm">For the selected period</p>
              </div>
              <div className="flex space-x-12 mt-4 md:mt-0">
                <div className="text-center md:text-right">
                  <div className="text-2xl font-bold text-white">2,090</div>
                  <div className="text-xs text-[#A1A1AA] uppercase tracking-wider">Total Requests</div>
                </div>
                <div className="text-center md:text-right">
                  <div className="text-2xl font-bold text-white">70.7</div>
                  <div className="text-xs text-[#A1A1AA] uppercase tracking-wider">Total Minutes</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
