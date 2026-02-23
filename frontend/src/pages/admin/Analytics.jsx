import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  TrendingUp, TrendingDown, Users, FileText, 
  CheckCircle2, Clock, BarChart3, Download,
  Calendar, Activity, ArrowUp, ArrowDown
} from "lucide-react";

const timeRanges = ["Last 7 days", "Last 30 days", "Last 3 months", "Last year", "All time"];

const overviewStats = [
  { 
    title: "Total Users", 
    value: "12,458", 
    change: "+12.5%", 
    trend: "up",
    icon: Users,
    color: "bg-primary/10 text-primary"
  },
  { 
    title: "Applications Submitted", 
    value: "3,247", 
    change: "+8.2%", 
    trend: "up",
    icon: FileText,
    color: "bg-info/10 text-info"
  },
  { 
    title: "Completion Rate", 
    value: "87.3%", 
    change: "+2.1%", 
    trend: "up",
    icon: CheckCircle2,
    color: "bg-success/10 text-success"
  },
  { 
    title: "Avg. Processing Time", 
    value: "4.2 days", 
    change: "-0.5 days", 
    trend: "down",
    icon: Clock,
    color: "bg-warning/10 text-warning"
  },
];

const topServices = [
  { name: "Citizenship Certificate", submissions: 1247, completed: 1089, pending: 158, completionRate: 87.3 },
  { name: "Passport Application", submissions: 892, completed: 756, pending: 136, completionRate: 84.8 },
  { name: "Driving License", submissions: 634, completed: 567, pending: 67, completionRate: 89.4 },
  { name: "Land Registration", submissions: 456, completed: 389, pending: 67, completionRate: 85.3 },
  { name: "Business Registration", submissions: 234, completed: 198, pending: 36, completionRate: 84.6 },
];

const districtStats = [
  { district: "Kathmandu", users: 3456, applications: 1247, completionRate: 89.2 },
  { district: "Lalitpur", users: 2345, applications: 892, completionRate: 87.5 },
  { district: "Bhaktapur", users: 1234, applications: 456, completionRate: 88.1 },
  { district: "Pokhara", users: 1890, applications: 634, completionRate: 86.3 },
  { district: "Biratnagar", users: 1456, applications: 523, completionRate: 85.7 },
];

const recentActivity = [
  { action: "Application Completed", service: "Citizenship Certificate", user: "Ram Sharma", time: "2 hours ago" },
  { action: "Application Submitted", service: "Passport Application", user: "Sita Devi", time: "3 hours ago" },
  { action: "Application Rejected", service: "Driving License", user: "Hari Prasad", time: "5 hours ago" },
  { action: "User Registered", service: "-", user: "Gita Kumari", time: "1 day ago" },
  { action: "Application Completed", service: "Land Registration", user: "Shyam Kumar", time: "1 day ago" },
];

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("Last 30 days");

  return (
    <div className="section-container py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Analytics & Insights</h1>
          <p className="text-muted-foreground">
            Monitor system performance, user activity, and application trends.
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeRanges.map((range) => (
                <SelectItem key={range} value={range}>{range}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {overviewStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="card-elevated">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  {stat.trend === "up" ? (
                    <Badge className="bg-success/10 text-success gap-1">
                      <ArrowUp className="h-3 w-3" />
                      {stat.change}
                    </Badge>
                  ) : (
                    <Badge className="bg-info/10 text-info gap-1">
                      <ArrowDown className="h-3 w-3" />
                      {stat.change}
                    </Badge>
                  )}
                </div>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.title}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Top Services */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-sans flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Top Services by Volume
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topServices.map((service) => (
                  <div key={service.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{service.name}</span>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-muted-foreground">
                          {service.completed}/{service.submissions}
                        </span>
                        <Badge className="bg-success/10 text-success">
                          {service.completionRate}%
                        </Badge>
                      </div>
                    </div>
                    <Progress value={service.completionRate} className="h-2" />
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Completed: {service.completed}</span>
                      <span>Pending: {service.pending}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-sans flex items-center gap-2">
              <Activity className="h-5 w-5 text-accent" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((activity, i) => (
              <div key={i} className="p-3 rounded-lg border bg-card text-sm">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    {activity.service !== "-" && (
                      <p className="text-xs text-muted-foreground">{activity.service}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground">{activity.user}</span>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* District Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-sans flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            District-wise Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 text-sm font-semibold">District</th>
                  <th className="text-left p-3 text-sm font-semibold">Total Users</th>
                  <th className="text-left p-3 text-sm font-semibold">Applications</th>
                  <th className="text-left p-3 text-sm font-semibold">Completion Rate</th>
                </tr>
              </thead>
              <tbody>
                {districtStats.map((stat) => (
                  <tr key={stat.district} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="p-3 font-medium">{stat.district}</td>
                    <td className="p-3">{stat.users.toLocaleString()}</td>
                    <td className="p-3">{stat.applications.toLocaleString()}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Progress value={stat.completionRate} className="flex-1 h-2 max-w-[100px]" />
                        <span className="text-sm font-medium">{stat.completionRate}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


