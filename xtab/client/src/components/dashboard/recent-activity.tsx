import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Clock, Edit3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Post, Platform } from "@shared/schema";

export default function RecentActivity() {
  const { data: posts = [], isLoading } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
  });

  const { data: platforms = [] } = useQuery<Platform[]>({
    queryKey: ["/api/platforms"],
  });

  if (isLoading) {
    return (
      <Card className="shadow">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-medium text-slate-900">Recent Activity</h3>
        </div>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex space-x-3">
                <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Create activity items from recent posts
  const recentPosts = posts
    .sort((a, b) => new Date(b.updatedAt!).getTime() - new Date(a.updatedAt!).getTime())
    .slice(0, 5);

  const activities = recentPosts.map(post => {
    const platform = platforms.find(p => p.id === post.platformId);
    const timeDiff = new Date().getTime() - new Date(post.updatedAt!).getTime();
    const hoursAgo = Math.floor(timeDiff / (1000 * 60 * 60));
    
    let action = "Created";
    let icon = Edit3;
    let iconColor = "bg-yellow-500";
    
    if (post.status === "published") {
      action = "Published";
      icon = CheckCircle;
      iconColor = "bg-green-500";
    } else if (post.status === "scheduled") {
      action = "Scheduled";
      icon = Clock;
      iconColor = "bg-blue-500";
    }

    return {
      id: post.id,
      action,
      postTitle: post.title,
      platform: platform?.name || "Unknown",
      timestamp: hoursAgo < 1 ? "Just now" : 
                 hoursAgo < 24 ? `${hoursAgo}h` :
                 `${Math.floor(hoursAgo / 24)}d`,
      icon,
      iconColor,
    };
  });

  return (
    <Card className="shadow">
      <div className="px-6 py-4 border-b border-slate-200">
        <h3 className="text-lg font-medium text-slate-900">Recent Activity</h3>
      </div>
      <CardContent className="p-6">
        <div className="flow-root">
          <ul className="-mb-8">
            {activities.map((activity, index) => (
              <li key={activity.id}>
                <div className={`relative ${index !== activities.length - 1 ? 'pb-8' : ''}`}>
                  {index !== activities.length - 1 && (
                    <span
                      className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-200"
                      aria-hidden="true"
                    />
                  )}
                  <div className="relative flex space-x-3">
                    <div>
                      <span className={`h-8 w-8 rounded-full ${activity.iconColor} flex items-center justify-center ring-8 ring-white`}>
                        <activity.icon className="w-4 h-4 text-white" />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-slate-500" data-testid={`activity-${activity.id}`}>
                          {activity.action} <span className="font-medium text-slate-900">"{activity.postTitle}"</span> to {activity.platform}
                        </p>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-slate-500" data-testid={`activity-time-${activity.id}`}>
                        {activity.timestamp}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        
        {activities.length === 0 && (
          <div className="text-center py-8">
            <p className="text-slate-500">No recent activity</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
