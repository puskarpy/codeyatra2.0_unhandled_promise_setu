import { Link } from "react-router-dom";
import { 
  FileText, CheckSquare, Link2, Clock, 
  ArrowRight, Bell, TrendingUp, User, ListTodo
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const quickActions = [
  { title: "Check Eligibility", href: "/eligibility", icon: CheckSquare, color: "bg-info/10 text-info" },
  { title: "Submit Appointment", href: "/submit", icon: FileText, color: "bg-success/10 text-success" },
  { title: "Guided Forms", href: "/guided-forms", icon: ListTodo, color: "bg-warning/10 text-warning" },
  { title: "Government Portals", href: "/portals", icon: Link2, color: "bg-accent/10 text-accent" },
];

const recentActivities = [
  { title: "Citizenship Application", status: "In Progress", date: "2026-02-20", progress: 60 },
  { title: "Passport Renewal", status: "Submitted", date: "2026-02-18", progress: 30 },
  { title: "Land Ownership Verification", status: "Completed", date: "2026-02-15", progress: 100 },
];

const notifications = [
  { message: "Your citizenship application requires additional documents.", time: "2 hours ago" },
  { message: "Passport renewal window opens March 1st.", time: "1 day ago" },
  { message: "New government scheme: Youth Employment Program.", time: "3 days ago" },
];

export default function DashboardPage() {
  return (
    <div className="section-container py-8">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Namaste, User 🙏</h1>
        <p className="text-muted-foreground">Here's an overview of your government service activities.</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Appointments */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg font-semibold font-sans flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Recent Appointments
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                View All
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.title} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm truncate">{activity.title}</span>
                      <span className={`badge-status ${
                        activity.status === "Completed" ? "bg-success/10 text-success" :
                        activity.status === "In Progress" ? "bg-warning/10 text-warning" :
                        "bg-info/10 text-info"
                      }`}>
                        {activity.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={activity.progress} className="flex-1 h-1.5" />
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        <Clock className="h-3 w-3 inline mr-1" />
                        {activity.date}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Notifications */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold font-sans flex items-center gap-2">
              <Bell className="h-5 w-5 text-accent" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.map((notif, i) => (
              <div key={i} className="p-3 rounded-lg border bg-card text-sm">
                <p className="text-foreground leading-relaxed mb-1">{notif.message}</p>
                <span className="text-xs text-muted-foreground">{notif.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
