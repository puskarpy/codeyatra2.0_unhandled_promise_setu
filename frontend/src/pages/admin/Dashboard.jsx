import { Link } from "react-router-dom";
import { 
  Users, FileText, CheckSquare, Link2, 
  TrendingUp, Clock, AlertCircle, ArrowRight,
  Activity, BarChart3, UserPlus, FileCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const stats = [
  { 
    title: "Total Users", 
    value: "12,458", 
    change: "+12.5%", 
    icon: Users, 
    color: "bg-primary/10 text-primary",
    href: "/admin/users"
  },
  { 
    title: "Active Applications", 
    value: "3,247", 
    change: "+8.2%", 
    icon: FileText, 
    color: "bg-info/10 text-info",
    href: "/admin/applications"
  },
  { 
    title: "Pending Reviews", 
    value: "156", 
    change: "-5.1%", 
    icon: AlertCircle, 
    color: "bg-warning/10 text-warning",
    href: "/admin/applications?status=pending"
  },
  { 
    title: "Completed Today", 
    value: "89", 
    change: "+15.3%", 
    icon: FileCheck, 
    color: "bg-success/10 text-success",
    href: "/admin/applications?status=completed"
  },
];

const quickActions = [
  { title: "Manage Users", href: "/admin/users", icon: Users, color: "bg-primary/10 text-primary" },
  { title: "Manage Forms", href: "/admin/forms", icon: FileText, color: "bg-info/10 text-info" },
  { title: "Manage Applications", href: "/admin/applications", icon: FileCheck, color: "bg-success/10 text-success" },
  { title: "Manage Appointments", href: "/admin/appointments", icon: Clock, color: "bg-accent/10 text-accent" },
  { title: "Manage Portals", href: "/admin/portals", icon: Link2, color: "bg-accent/10 text-accent" },
  { title: "Manage Schemes", href: "/admin/schemes", icon: CheckSquare, color: "bg-warning/10 text-warning" },
  { title: "Analytics", href: "/admin/analytics", icon: BarChart3, color: "bg-primary/10 text-primary" },
];

const recentApplications = [
  { 
    id: "SETU-2026-00421", 
    user: "Ram Sharma", 
    service: "Citizenship Certificate", 
    status: "In Progress", 
    date: "2026-02-20", 
    progress: 60 
  },
  { 
    id: "SETU-2026-00420", 
    user: "Sita Devi", 
    service: "Passport Renewal", 
    status: "Pending Review", 
    date: "2026-02-20", 
    progress: 30 
  },
  { 
    id: "SETU-2026-00419", 
    user: "Hari Prasad", 
    service: "Driving License", 
    status: "Completed", 
    date: "2026-02-19", 
    progress: 100 
  },
  { 
    id: "SETU-2026-00418", 
    user: "Gita Kumari", 
    service: "Land Registration", 
    status: "In Progress", 
    date: "2026-02-19", 
    progress: 45 
  },
];

const systemAlerts = [
  { message: "High volume of applications expected this week.", time: "2 hours ago", type: "info" },
  { message: "3 applications require immediate attention.", time: "5 hours ago", type: "warning" },
  { message: "System maintenance scheduled for tonight at 2 AM.", time: "1 day ago", type: "info" },
];

export default function Dashboard() {
  return (
    <div className="section-container py-8">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Admin Dashboard</h1>
        <p className="text-muted-foreground">Monitor and manage all system activities and user requests.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} to={stat.href}>
              <Card className="card-elevated hover:border-primary/30 transition-all cursor-pointer h-full">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <Badge 
                      variant={stat.change.startsWith("+") ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {stat.change}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.title}</div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.href} to={action.href}>
                <Card className="card-elevated hover:border-primary/30 transition-all cursor-pointer h-full">
                  <CardContent className="p-5 flex flex-col items-center text-center gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${action.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="font-medium text-sm">{action.title}</span>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Applications */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg font-semibold font-sans flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Recent Applications
              </CardTitle>
              <Link to="/admin/applications">
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  View All
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentApplications.map((application) => (
                <div 
                  key={application.id} 
                  className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{application.service}</span>
                      <Badge 
                        className={
                          application.status === "Completed" ? "bg-success/10 text-success" :
                          application.status === "In Progress" ? "bg-warning/10 text-warning" :
                          "bg-info/10 text-info"
                        }
                      >
                        {application.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mb-2">
                      {application.id} • {application.user}
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={application.progress} className="flex-1 h-1.5" />
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {application.date}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* System Alerts */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold font-sans flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              System Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {systemAlerts.map((alert, i) => (
              <div 
                key={i} 
                className={`p-3 rounded-lg border bg-card text-sm ${
                  alert.type === "warning" ? "border-warning/20 bg-warning/5" : "border-border"
                }`}
              >
                <p className="text-foreground leading-relaxed mb-1">{alert.message}</p>
                <span className="text-xs text-muted-foreground">{alert.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
