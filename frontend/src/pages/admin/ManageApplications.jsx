import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Search, Filter, Download, Eye, CheckCircle2, 
  XCircle, Clock, FileText, User, Calendar
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const initialApplications = [
  { 
    id: "SETU-2026-00421", 
    userId: 1,
    userName: "Ram Sharma", 
    service: "Citizenship Certificate", 
    status: "In Progress", 
    submittedDate: "2026-02-20",
    lastUpdated: "2026-02-20",
    progress: 60,
    priority: "Normal"
  },
  { 
    id: "SETU-2026-00420", 
    userId: 2,
    userName: "Sita Devi", 
    service: "Passport Renewal", 
    status: "Pending Review", 
    submittedDate: "2026-02-20",
    lastUpdated: "2026-02-20",
    progress: 30,
    priority: "High"
  },
  { 
    id: "SETU-2026-00419", 
    userId: 3,
    userName: "Hari Prasad", 
    service: "Driving License", 
    status: "Completed", 
    submittedDate: "2026-02-19",
    lastUpdated: "2026-02-19",
    progress: 100,
    priority: "Normal"
  },
  { 
    id: "SETU-2026-00418", 
    userId: 4,
    userName: "Gita Kumari", 
    service: "Land Registration", 
    status: "In Progress", 
    submittedDate: "2026-02-19",
    lastUpdated: "2026-02-20",
    progress: 45,
    priority: "Low"
  },
  { 
    id: "SETU-2026-00417", 
    userId: 1,
    userName: "Ram Sharma", 
    service: "Business Registration", 
    status: "Rejected", 
    submittedDate: "2026-02-18",
    lastUpdated: "2026-02-19",
    progress: 0,
    priority: "Normal"
  },
];

export default function ManageApplications() {
  const [applications, setApplications] = useState(initialApplications);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [reviewNote, setReviewNote] = useState("");

  const filteredApplications = applications.filter((app) => {
    const matchesSearch = 
      app.id.toLowerCase().includes(search.toLowerCase()) ||
      app.userName.toLowerCase().includes(search.toLowerCase()) ||
      app.service.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || app.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleView = (app) => {
    setSelectedApplication(app);
    setIsViewDialogOpen(true);
  };

  const handleStatusChange = (appId, newStatus) => {
    setApplications(applications.map(app => 
      app.id === appId 
        ? { ...app, status: newStatus, lastUpdated: new Date().toISOString().split('T')[0] }
        : app
    ));
    setIsViewDialogOpen(false);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Completed":
        return "bg-success/10 text-success";
      case "In Progress":
        return "bg-warning/10 text-warning";
      case "Pending Review":
        return "bg-info/10 text-info";
      case "Rejected":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case "High":
        return "bg-destructive/10 text-destructive";
      case "Normal":
        return "bg-info/10 text-info";
      case "Low":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="section-container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Manage Applications</h1>
        <p className="text-muted-foreground">
          Review, approve, and manage all user applications submitted through the system.
        </p>
      </div>

      {/* Actions Bar */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by ID, user name, or service..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Pending Review">Pending Review</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.map((app) => (
          <Card key={app.id} className="card-elevated">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="h-5 w-5 text-primary shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg">{app.service}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getStatusBadgeClass(app.status)}>
                          {app.status}
                        </Badge>
                        <Badge className={getPriorityBadgeClass(app.priority)}>
                          {app.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">User:</span>
                      <span className="font-medium">{app.userName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">ID:</span>
                      <span className="font-mono font-medium">{app.id}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Submitted:</span>
                      <span className="font-medium">{app.submittedDate}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Progress</span>
                      <span className="text-sm font-medium">{app.progress}%</span>
                    </div>
                    <Progress value={app.progress} className="h-2" />
                  </div>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleView(app)}
                    className="gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    View Details
                  </Button>
                  {app.status === "Pending Review" && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(app.id, "In Progress")}
                        className="flex-1 gap-1 text-success"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(app.id, "Rejected")}
                        className="text-destructive"
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredApplications.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <p>No applications found matching your search criteria.</p>
          </CardContent>
        </Card>
      )}

      {/* View Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              Review application information and update status.
            </DialogDescription>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Application ID</Label>
                  <p className="font-mono font-medium">{selectedApplication.id}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div>
                    <Badge className={getStatusBadgeClass(selectedApplication.status)}>
                      {selectedApplication.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">User</Label>
                  <p className="font-medium">{selectedApplication.userName}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Service</Label>
                  <p className="font-medium">{selectedApplication.service}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Submitted Date</Label>
                  <p className="font-medium">{selectedApplication.submittedDate}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Last Updated</Label>
                  <p className="font-medium">{selectedApplication.lastUpdated}</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Progress</Label>
                <div className="mt-2">
                  <Progress value={selectedApplication.progress} className="h-2" />
                  <p className="text-sm text-muted-foreground mt-1">{selectedApplication.progress}% complete</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Review Notes</Label>
                <Textarea
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  placeholder="Add notes about this application..."
                  rows={4}
                />
              </div>
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => handleStatusChange(selectedApplication.id, "In Progress")}
                  className="flex-1 gap-2"
                  disabled={selectedApplication.status === "Completed" || selectedApplication.status === "Rejected"}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Approve
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleStatusChange(selectedApplication.id, "Rejected")}
                  className="flex-1 gap-2 text-destructive"
                  disabled={selectedApplication.status === "Completed" || selectedApplication.status === "Rejected"}
                >
                  <XCircle className="h-4 w-4" />
                  Reject
                </Button>
                <Button
                  onClick={() => handleStatusChange(selectedApplication.id, "Completed")}
                  className="flex-1 gap-2"
                  disabled={selectedApplication.status === "Completed"}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Mark Complete
                </Button>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


