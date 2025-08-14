import { useQuery } from "@tanstack/react-query";
import { FileText, Clock, Heart, TrendingUp } from "lucide-react";
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

export default function StatsCards() {
  const { data: analytics, isLoading } = useQuery<AnalyticsData>({
    queryKey: ["/api/analytics"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-5">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-slate-200 rounded-md"></div>
                <div className="ml-5 w-0 flex-1">
                  <div className="h-4 bg-slate-200 rounded w-20 mb-2"></div>
                  <div className="h-6 bg-slate-200 rounded w-12"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const stats = [
    {
      title: "Total Posts",
      value: analytics?.totalPosts || 0,
      change: "+12% from last month",
      icon: FileText,
      bgColor: "bg-xtab-blue",
      testId: "stat-total-posts"
    },
    {
      title: "Scheduled",
      value: analytics?.scheduledPosts || 0,
      change: "+3 this week",
      icon: Clock,
      bgColor: "bg-xtab-emerald",
      testId: "stat-scheduled-posts"
    },
    {
      title: "Engagement",
      value: analytics?.engagement || 0,
      change: "+24% vs last week",
      icon: Heart,
      bgColor: "bg-xtab-indigo",
      testId: "stat-engagement"
    },
    {
      title: "Reach",
      value: analytics?.reach || "0",
      change: "+8% from yesterday",
      icon: TrendingUp,
      bgColor: "bg-amber-500",
      testId: "stat-reach"
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      {stats.map((stat) => (
        <Card key={stat.title} className="overflow-hidden shadow card-hover">
          <CardContent className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`w-8 h-8 ${stat.bgColor} rounded-md flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-slate-500 truncate">
                    {stat.title}
                  </dt>
                  <dd 
                    className="text-lg font-medium text-slate-900"
                    data-testid={stat.testId}
                  >
                    {stat.value}
                  </dd>
                </dl>
              </div>
            </div>
          </CardContent>
          <div className="bg-slate-50 px-5 py-3">
            <div className="text-sm">
              <span className="font-medium text-xtab-emerald">
                {stat.change.includes("+") ? stat.change.split(" ")[0] : "+0%"}
              </span>
              <span className="text-slate-500 ml-1">
                {stat.change.split(" ").slice(1).join(" ")}
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
