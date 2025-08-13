import { useQuery } from "@tanstack/react-query";
import { Home, BookOpen, FileText, BarChart3, Clock } from "lucide-react";
import type { Platform } from "@shared/schema";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { data: platforms = [] } = useQuery<Platform[]>({
    queryKey: ["/api/platforms"],
  });

  return (
    <div className="hidden lg:flex lg:w-64 lg:flex-col">
      <div className="flex flex-col flex-grow bg-white border-r border-slate-200 pt-5 pb-4 overflow-y-auto">
        {/* Logo */}
        <div className="flex items-center flex-shrink-0 px-4 mb-8">
          <div className="flex items-center">
            <div className="w-8 h-8 xtab-logo rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">x</span>
            </div>
            <h1 className="ml-3 text-xl font-bold text-slate-800">xTab</h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-5 flex-1 px-2 space-y-1">
          <button
            onClick={() => onTabChange("all")}
            className={`w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
              activeTab === "all"
                ? "xtab-gradient text-white"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
            data-testid="nav-dashboard"
          >
            <Home className={`mr-3 h-5 w-5 ${activeTab === "all" ? "text-white" : "text-slate-400"}`} />
            Dashboard
          </button>
          
          <button
            onClick={() => onTabChange("posts")}
            className={`w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
              activeTab === "posts"
                ? "xtab-gradient text-white"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
            data-testid="nav-post-library"
          >
            <BookOpen className={`mr-3 h-5 w-5 ${activeTab === "posts" ? "text-white" : "text-slate-400"}`} />
            Post Library
          </button>
          
          <button
            className="w-full text-slate-600 hover:bg-slate-50 hover:text-slate-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
            data-testid="nav-templates"
          >
            <FileText className="text-slate-400 mr-3 h-5 w-5" />
            Templates
          </button>
          
          <button
            className="w-full text-slate-600 hover:bg-slate-50 hover:text-slate-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
            data-testid="nav-analytics"
          >
            <BarChart3 className="text-slate-400 mr-3 h-5 w-5" />
            Analytics
          </button>
          
          <button
            className="w-full text-slate-600 hover:bg-slate-50 hover:text-slate-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
            data-testid="nav-scheduler"
          >
            <Clock className="text-slate-400 mr-3 h-5 w-5" />
            Scheduler
          </button>
        </nav>

        {/* Connected Platforms */}
        <div className="mt-6 px-2">
          <h3 className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Connected Platforms
          </h3>
          <div className="mt-2 space-y-1">
            {platforms.map((platform) => (
              <div key={platform.id} className="flex items-center px-2 py-2 text-sm text-slate-600">
                <div className={`w-4 h-4 ${platform.color} rounded mr-2`}></div>
                <span data-testid={`platform-${platform.name.toLowerCase()}`}>
                  {platform.name}
                </span>
                <span 
                  className={`ml-auto text-xs ${
                    platform.isConnected ? "text-xtab-emerald" : "text-slate-400"
                  }`}
                  data-testid={`platform-status-${platform.name.toLowerCase()}`}
                >
                  ●
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
