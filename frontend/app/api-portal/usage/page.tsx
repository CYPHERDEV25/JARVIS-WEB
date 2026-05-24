"use client";

import React, { useMemo } from 'react';
import { usePortal } from '../PortalContext';

export default function GlobalUsagePage() {
  const { projects } = usePortal();

  // Aggregate stats
  const totalProjects = projects.length;
  const totalKeys = projects.reduce((acc, p) => acc + p.keys.length, 0);
  const totalCalls = projects.reduce((acc, p) => acc + p.usageData.reduce((a, b) => a + b, 0), 0);
  
  // Fake 30 day usage data
  const thirtyDayData = useMemo(() => {
    return Array.from({length: 30}, () => Math.floor(Math.random() * 500) + 100);
  }, []);

  const totalThisMonth = thirtyDayData.reduce((a, b) => a + b, 0);
  const maxDay = Math.max(...thirtyDayData);

  return (
    <div className="p-8 lg:p-12 max-w-6xl mx-auto animate-[fadeIn_0.3s_ease-out]">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0d0d0d] tracking-tight">Global Usage</h1>
        <p className="text-[#6b6b6b] mt-1 text-[15px]">Monitor API usage and limits across your entire organization</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-white border border-[#e5e5e5] rounded-xl p-5 shadow-sm">
          <div className="text-[13px] text-[#6b6b6b] mb-1 font-medium uppercase tracking-wide">Total Calls (All Time)</div>
          <div className="text-3xl font-bold text-[#0d0d0d]">{totalCalls.toLocaleString()}</div>
        </div>
        <div className="bg-white border border-[#e5e5e5] rounded-xl p-5 shadow-sm">
          <div className="text-[13px] text-[#6b6b6b] mb-1 font-medium uppercase tracking-wide">Calls This Month</div>
          <div className="text-3xl font-bold text-[#0d0d0d]">{totalThisMonth.toLocaleString()}</div>
        </div>
        <div className="bg-white border border-[#e5e5e5] rounded-xl p-5 shadow-sm">
          <div className="text-[13px] text-[#6b6b6b] mb-1 font-medium uppercase tracking-wide">Total Projects</div>
          <div className="text-3xl font-bold text-[#0d0d0d]">{totalProjects}</div>
        </div>
        <div className="bg-white border border-[#e5e5e5] rounded-xl p-5 shadow-sm">
          <div className="text-[13px] text-[#6b6b6b] mb-1 font-medium uppercase tracking-wide">Active Keys</div>
          <div className="text-3xl font-bold text-[#0d0d0d]">{totalKeys}</div>
        </div>
      </div>

      <div className="bg-white border border-[#e5e5e5] rounded-xl p-6 shadow-sm mb-8">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-[16px] font-bold text-[#0d0d0d]">Usage Trend (Last 30 Days)</h3>
          <div className="flex items-center gap-4 text-[13px] font-medium">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-[#10a37f]"></div>
              <span className="text-[#6b6b6b]">Total Calls</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-[#10a37f] opacity-30"></div>
              <span className="text-[#6b6b6b]">Unique Sessions</span>
            </div>
          </div>
        </div>

        <div className="h-72 flex items-end justify-between gap-1 pt-4 relative border-b border-[#e5e5e5]">
          {thirtyDayData.map((calls, i) => {
            const h1 = Math.max(5, (calls / maxDay) * 100);
            const h2 = Math.max(2, (Math.floor(calls * 0.6) / maxDay) * 100);
            return (
              <div key={i} className="flex-1 flex items-end justify-center relative h-full group">
                <div 
                  className="w-full max-w-[8px] bg-[#10a37f] rounded-t-sm transition-all duration-500 ease-out z-10" 
                  style={{ height: `${h1}%` }}
                ></div>
                <div 
                  className="w-full max-w-[8px] bg-[#10a37f] opacity-30 rounded-t-sm transition-all duration-500 ease-out absolute bottom-0 z-0" 
                  style={{ height: `${h2}%` }}
                ></div>
                
                {/* Tooltip */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#0d0d0d] text-white text-[12px] px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                  <div className="font-bold mb-0.5">Day {30 - i}</div>
                  <div>{calls} calls</div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between mt-3 text-[12px] text-[#6b6b6b] font-medium px-1">
          <span>30 days ago</span>
          <span>15 days ago</span>
          <span>Today</span>
        </div>
      </div>
    </div>
  );
}
