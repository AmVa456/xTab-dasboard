import { useQuery } from "@tanstack/react-query";
import { Plus, Calendar, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface AnalyticsData {
  totalPosts: number;
  scheduledPosts: number;
  engagement: number;
  reach: string;
  bestPlatform: string;
  engagementRate: string;
  postsThisWeek: number;
}

interface QuickActionsProps {
  onCreatePost: () => void;
}

export default function QuickActions({ onCreatePost }: QuickActionsProps) {
  const { data: analytics, isLoading } = useQuery<AnalyticsData>({
    queryKey: ["/api/analytics"],
  });

  return (
    <div className="space-y-6">
      <Card className="shadow">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-medium text-slate-900">Quick Actions</h3>
        </div>
        <CardContent className="p-6 space-y-4">
          <Button
            onClick={onCreatePost}
            className="w-full xtab-gradient text-white hover:shadow-lg transition-all duration-200"
            data-testid="button-quick-create-post"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Post
          </Button>
          
          <Button
            variant="outline"
            className="w-full"
            data-testid="button-bulk-schedule"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Bulk Schedule
          </Button>
          
          <Button
            variant="outline"
            className="w-full"
            data-testid="button-view-analytics"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            View Analytics
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-medium text-slate-900">Performance</h3>
        </div>
        <CardContent className="p-6">
          {/* Analytics Chart Placeholder */}
          <div className="w-full h-32 bg-gradient-to-r from-slate-100 to-slate-200 rounded-lg mb-4 flex items-center justify-center">
            <BarChart3 className="w-8 h-8 text-slate-400" />
          </div>
          
          {isLoading ? (
            <div className="space-y-3 animate-pulse">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Best performing platform</span>
                <span className="text-sm font-medium text-slate-900" data-testid="analytics-best-platform">
                  {analytics?.bestPlatform || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Avg. engagement rate</span>
                <span className="text-sm font-medium text-xtab-emerald" data-testid="analytics-engagement-rate">
                  {analytics?.engagementRate || "0%"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Posts this week</span>
                <span className="text-sm font-medium text-slate-900" data-testid="analytics-posts-week">
                  {analytics?.postsThisWeek || 0}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
