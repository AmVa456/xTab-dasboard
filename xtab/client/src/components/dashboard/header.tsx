import { Search, Plus, Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onCreatePost: () => void;
}

export default function Header({ searchQuery, onSearchChange, onCreatePost }: HeaderProps) {
  return (
    <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
      <button className="px-4 border-r border-slate-200 text-slate-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-xtab-blue lg:hidden">
        <Menu className="h-6 w-6" />
      </button>
      
      <div className="flex-1 px-4 flex justify-between items-center">
        <div className="flex-1 flex items-center">
          <h2 className="text-xl font-semibold text-slate-800">
            Post Management Dashboard
          </h2>
        </div>
        
        <div className="ml-4 flex items-center md:ml-6 space-x-3">
          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <Input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md leading-5 bg-white placeholder-slate-500 focus:outline-none focus:placeholder-slate-400 focus:ring-1 focus:ring-xtab-blue focus:border-xtab-blue"
              data-testid="search-input"
            />
          </div>
          
          <Button
            onClick={onCreatePost}
            className="xtab-gradient text-white px-4 py-2 rounded-md text-sm font-medium hover:shadow-lg transition-all duration-200"
            data-testid="button-create-post"
          >
            <Plus className="w-4 h-4 mr-1" />
            New Post
          </Button>
          
          <button 
            className="p-1 rounded-full text-slate-400 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-xtab-blue"
            data-testid="button-notifications"
          >
            <Bell className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
