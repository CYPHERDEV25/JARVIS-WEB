"use client";

import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import StatsCard from "@/components/StatsCard";
import ApiKeyCard from "@/components/ApiKeyCard";
import QuickStart from "@/components/QuickStart";
import VoiceTest from "@/components/VoiceTest";
import UsageTable from "@/components/UsageTable";

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-[#09090B] overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <div className="flex items-center gap-4">
              <Link
                href="/chat"
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium transition-colors border border-indigo-500"
              >
                Open Chat
              </Link>
              <span className="text-[#A1A1AA]">Good morning, John</span>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard 
              title="Requests Today" 
              value="17" 
              subtitle="of 100 daily limit" 
              progress={17} 
            />
            <StatsCard 
              title="Minutes Used" 
              value="4" 
              subtitle="of 10 minutes today" 
              progress={40} 
            />
            <StatsCard 
              title="API Key Status" 
              badge="ACTIVE" 
              subtitle="Key is working" 
              isStatus={true} 
            />
            <StatsCard 
              title="Account Plan" 
              value="Free Plan" 
              linkText="Upgrade to Pro &rarr;" 
              linkHref="/dashboard/upgrade" 
              isPlan={true} 
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column (Main) */}
            <div className="lg:col-span-2 space-y-8">
              <ApiKeyCard />
              <QuickStart />
              <UsageTable />
            </div>

            {/* Right Column (Side) */}
            <div className="space-y-8">
              <VoiceTest />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
