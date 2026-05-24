"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Key, BarChart2, Book, Settings, LogOut } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "API Keys", href: "/dashboard/keys", icon: Key },
    { name: "Usage", href: "/dashboard/usage", icon: BarChart2 },
    { name: "Documentation", href: "/docs", icon: Book },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#09090B] border-r border-[#27272A] flex flex-col h-full">
      <div className="h-16 flex items-center px-6 border-b border-[#27272A]">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold tracking-tight text-white">JARVIS</span>
          <div className="w-2 h-2 rounded-full bg-[#6366F1]"></div>
        </Link>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? "bg-[#6366F1]/10 text-[#6366F1]"
                  : "text-[#A1A1AA] hover:text-white hover:bg-[#27272A]/50"
              }`}
            >
              <Icon className={`w-5 h-5 mr-3 ${isActive ? "text-[#6366F1]" : "text-[#A1A1AA]"}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#27272A]">
        <div className="flex items-center px-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-[#18181B] border border-[#27272A] flex items-center justify-center text-sm font-medium text-white mr-3">
            J
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium text-white truncate">John Doe</p>
            <p className="text-xs text-[#A1A1AA] truncate">john@example.com</p>
          </div>
        </div>
        <Link
          href="/login"
          className="flex items-center px-3 py-2 text-sm font-medium text-[#A1A1AA] rounded-md hover:bg-[#27272A]/50 hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </Link>
      </div>
    </aside>
  );
}
