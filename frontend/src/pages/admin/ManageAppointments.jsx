import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Search, Filter, Download, Eye, QrCode, 
  Calendar, Clock, MapPin, User, Phone, Mail,
  CheckCircle2, XCircle, FileText
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QRCodeSVG } from "qrcode.react";

const initialAppointments = [
  { 
    id: "APT-1737456000000-ABC123DEF",
    appointmentId: "APT-1737456000000-ABC123DEF",
    service: "Citizenship Certificate",
    office: "Kathmandu District Office",
    date: "2026-02-25",
    time: "10:00 AM",
    fullName: "Ram Sharma",
    email: "ram.sharma@example.com",
    phone: "+977-9841234567",
    citizenshipNo: "01-01-76-12345",
    purpose: "New citizenship application",
    status: "Confirmed",
    createdAt: "2026-02-20T10:30:00Z"
  },
  { 
    id: "APT-1737456100000-XYZ789GHI",
    appointmentId: "APT-1737456100000-XYZ789GHI",
    service: "Passport Renewal",
    office: "Lalitpur District Office",
    date: "2026-02-26",
    time: "02:30 PM",
    fullName: "Sita Devi",
    email: "sita.devi@example.com",
    phone: "+977-9852345678",
    citizenshipNo: "02-02-77-23456",
    purpose: "Passport renewal",
    status: "Confirmed",
    createdAt: "2026-02-20T11:00:00Z"
  },
  { 
    id: "APT-1737456200000-MNO456PQR",
    appointmentId: "APT-1737456200000-MNO456PQR",
    service: "Driving License",
    office: "Bhaktapur District Office",
    date: "2026-02-27",
    time: "09:00 AM",
    fullName: "Hari Prasad",
    email: "hari.prasad@example.com",
    phone: "+977-9863456789",
    citizenshipNo: "03-03-78-34567",
    purpose: "New driving license",
    status: "Completed",
    createdAt: "2026-02-19T14:20:00Z"
  },
  { 
    id: "APT-1737456300000-STU321VWX",
    appointmentId: "APT-1737456300000-STU321VWX",
    service: "Land Registration",
    office: "Pokhara District Office",
    date: "2026-02-28",
    time: "11:30 AM",
    fullName: "Gita Kumari",
    email: "gita.kumari@example.com",
    phone: "+977-9874567890",
    citizenshipNo: "04-04-79-45678",
    purpose: "Property registration",
    status: "Pending",
    createdAt: "2026-02-20T15:45:00Z"
  },
];

export default function ManageAppointments() {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const filteredAppointments = appointments.filter((app) => {
    const matchesSearch = 
      app.appointmentId.toLowerCase().includes(search.toLowerCase()) ||
      app.fullName.toLowerCase().includes(search.toLowerCase()) ||
      app.service.toLowerCase().includes(search.toLowerCase()) ||
      app.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleView = (appointment) => {
    setSelectedAppointment(appointment);
    setIsViewDialogOpen(true);
  };

  const handleStatusChange = (appointmentId, newStatus) => {
    setAppointments(appointments.map(app => 
      app.id === appointmentId 
        ? { ...app, status: newStatus }
        : app
    ));
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Completed":
        return "bg-success/10 text-success";
      case "Confirmed":
        return "bg-info/10 text-info";
      case "Pending":
        return "bg-warning/10 text-warning";
      case "Cancelled":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const generateQRData = (appointment) => {
    return JSON.stringify({
      appointmentId: appointment.appointmentId,
      service: appointment.service,
      office: appointment.office,
      date: appointment.date,
      time: appointment.time,
      fullName: appointment.fullName,
      email: appointment.email,
      phone: appointment.phone,
      timestamp: appointment.createdAt,
    });
  };

  const handleDownloadQR = (appointment) => {
    const svg = document.getElementById(`qr-code-${appointment.id}`);
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const url = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = `appointment-${appointment.appointmentId}.png`;
        link.href = url;
        link.click();
      };
      img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
    }
  };

  return (
    <div className="section-container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Manage Appointments</h1>
        <p className="text-muted-foreground">
          View and manage all user appointments. Check QR codes and update appointment status.
        </p>
      </div>

      {/* Actions Bar */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by ID, name, service, or email..."
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
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Confirmed">Confirmed</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
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

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.map((appointment) => (
          <Card key={appointment.id} className="card-elevated">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="h-5 w-5 text-primary shrink-0" />
                    <div>
                      <h3 className="font-semibold text-lg">{appointment.service}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getStatusBadgeClass(appointment.status)}>
                          {appointment.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground font-mono">
                          {appointment.appointmentId}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="text-muted-foreground">User:</span>
                        <span className="font-medium ml-1">{appointment.fullName}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="text-muted-foreground">Office:</span>
                        <span className="font-medium ml-1">{appointment.office}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <span className="text-muted-foreground">Date:</span>
                        <span className="font-medium ml-1">{appointment.date} {appointment.time}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{appointment.phone}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleView(appointment)}
                    className="gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    View Details
                  </Button>
                  {appointment.status === "Pending" && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(appointment.id, "Confirmed")}
                        className="flex-1 gap-1 text-success text-xs"
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        Confirm
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(appointment.id, "Cancelled")}
                        className="text-destructive text-xs"
                      >
                        <XCircle className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAppointments.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <p>No appointments found matching your search criteria.</p>
          </CardContent>
        </Card>
      )}

      {/* View Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
            <DialogDescription>
              View appointment information and QR code.
            </DialogDescription>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-6 py-4">
              {/* QR Code Section */}
              <div className="flex flex-col items-center gap-4 p-6 bg-muted/50 rounded-lg">
                <div className="p-4 bg-white rounded-lg border-2 border-primary">
                  <QRCodeSVG
                    id={`qr-code-${selectedAppointment.id}`}
                    value={generateQRData(selectedAppointment)}
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => handleDownloadQR(selectedAppointment)}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download QR Code
                </Button>
              </div>

              {/* Appointment Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Appointment ID</Label>
                  <p className="font-mono font-medium text-sm">{selectedAppointment.appointmentId}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <div>
                    <Badge className={getStatusBadgeClass(selectedAppointment.status)}>
                      {selectedAppointment.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Service</Label>
                  <p className="font-medium">{selectedAppointment.service}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Office</Label>
                  <p className="font-medium">{selectedAppointment.office}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Date</Label>
                  <p className="font-medium">{selectedAppointment.date}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Time</Label>
                  <p className="font-medium">{selectedAppointment.time}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Full Name</Label>
                  <p className="font-medium">{selectedAppointment.fullName}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="font-medium">{selectedAppointment.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Phone</Label>
                  <p className="font-medium">{selectedAppointment.phone}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Citizenship Number</Label>
                  <p className="font-medium">{selectedAppointment.citizenshipNo}</p>
                </div>
                {selectedAppointment.purpose && (
                  <div className="col-span-2">
                    <Label className="text-muted-foreground">Purpose</Label>
                    <p className="font-medium">{selectedAppointment.purpose}</p>
                  </div>
                )}
              </div>

              {/* Status Actions */}
              {selectedAppointment.status === "Pending" && (
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleStatusChange(selectedAppointment.id, "Confirmed");
                      setIsViewDialogOpen(false);
                    }}
                    className="flex-1 gap-2"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Confirm Appointment
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleStatusChange(selectedAppointment.id, "Cancelled");
                      setIsViewDialogOpen(false);
                    }}
                    className="flex-1 gap-2 text-destructive"
                  >
                    <XCircle className="h-4 w-4" />
                    Cancel Appointment
                  </Button>
                </div>
              )}
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

