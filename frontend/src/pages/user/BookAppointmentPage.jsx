import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { 
  Calendar, Clock, MapPin, User, Phone, Mail, 
  CheckCircle2, Download, QrCode, FileText
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

const services = [
  "Citizenship Certificate",
  "Passport Application",
  "Passport Renewal",
  "Driving License",
  "Land Registration",
  "Business Registration",
  "Birth Certificate",
  "Marriage Certificate",
  "PAN Registration",
  "Tax Consultation",
];

const timeSlots = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
  "04:00 PM", "04:30 PM", "05:00 PM"
];

const offices = [
  "Kathmandu District Office",
  "Lalitpur District Office",
  "Bhaktapur District Office",
  "Pokhara District Office",
  "Biratnagar District Office",
];

export default function BookAppointmentPage() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    service: "",
    office: "",
    date: "",
    time: "",
    fullName: "",
    email: "",
    phone: "",
    citizenshipNo: "",
    purpose: "",
  });
  const [appointmentId, setAppointmentId] = useState(null);
  const [qrData, setQrData] = useState(null);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const generateAppointmentId = () => {
    return `APT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = generateAppointmentId();
    setAppointmentId(id);
    
    // Generate QR code data
    const qrContent = JSON.stringify({
      appointmentId: id,
      service: formData.service,
      office: formData.office,
      date: formData.date,
      time: formData.time,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      timestamp: new Date().toISOString(),
    });
    
    setQrData(qrContent);
    setStep(2);
  };

  const handleDownloadQR = () => {
    const svg = document.getElementById("qr-code-svg");
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
        link.download = `appointment-${appointmentId}.png`;
        link.href = url;
        link.click();
      };
      img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
    }
  };

  if (step === 2 && appointmentId) {
    return (
      <div className="section-container py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8 animate-fade-in">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10 mx-auto mb-6">
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
            <h1 className="text-3xl font-bold mb-3">Appointment Confirmed!</h1>
            <p className="text-muted-foreground mb-2">
              Your appointment has been successfully booked.
            </p>
            <p className="text-lg font-mono font-bold text-primary mb-6">{appointmentId}</p>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg font-sans flex items-center gap-2">
                <QrCode className="h-5 w-5 text-primary" />
                Your Appointment QR Code
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-6">
                <div className="p-4 bg-white rounded-lg border-2 border-primary">
                  <QRCodeSVG
                    id="qr-code-svg"
                    value={qrData}
                    size={256}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Please bring this QR code to your appointment
                  </p>
                  <Button onClick={handleDownloadQR} variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Download QR Code
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-sans">Appointment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Service</Label>
                    <p className="font-medium">{formData.service}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Office</Label>
                    <p className="font-medium">{formData.office}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Date</Label>
                    <p className="font-medium">{formData.date}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Time</Label>
                    <p className="font-medium">{formData.time}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Name</Label>
                    <p className="font-medium">{formData.fullName}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Phone</Label>
                    <p className="font-medium">{formData.phone}</p>
                  </div>
                </div>
                {formData.purpose && (
                  <div>
                    <Label className="text-muted-foreground">Purpose</Label>
                    <p className="font-medium">{formData.purpose}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 text-center">
            <Button onClick={() => { setStep(0); setAppointmentId(null); setQrData(null); setFormData({
              service: "", office: "", date: "", time: "", fullName: "", email: "", phone: "", citizenshipNo: "", purpose: ""
            }); }}>
              Book Another Appointment
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-container py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Book an Appointment</h1>
          <p className="text-muted-foreground">
            Schedule an appointment for government services. Select your preferred date, time, and office location.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-sans flex items-center gap-2">
                {step === 0 ? (
                  <>
                    <Calendar className="h-5 w-5 text-primary" />
                    Service & Location
                  </>
                ) : (
                  <>
                    <User className="h-5 w-5 text-primary" />
                    Personal Information
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {step === 0 && (
                <>
                  <div className="space-y-2">
                    <Label>Select Service</Label>
                    <Select 
                      value={formData.service} 
                      onValueChange={(v) => updateField("service", v)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a service" />
                      </SelectTrigger>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service} value={service}>
                            {service}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Select Office</Label>
                    <Select 
                      value={formData.office} 
                      onValueChange={(v) => updateField("office", v)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose an office location" />
                      </SelectTrigger>
                      <SelectContent>
                        {offices.map((office) => (
                          <SelectItem key={office} value={office}>
                            {office}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Select Date</Label>
                      <Input
                        type="date"
                        value={formData.date}
                        onChange={(e) => updateField("date", e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Select Time</Label>
                      <Select 
                        value={formData.time} 
                        onValueChange={(v) => updateField("time", v)}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a time slot" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((slot) => (
                            <SelectItem key={slot} value={slot}>
                              {slot}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <User className="h-3.5 w-3.5" />
                      Full Name
                    </Label>
                    <Input
                      value={formData.fullName}
                      onChange={(e) => updateField("fullName", e.target.value)}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5" />
                        Email
                      </Label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5" />
                        Phone Number
                      </Label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        placeholder="+977-98XXXXXXXX"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Citizenship Number</Label>
                    <Input
                      value={formData.citizenshipNo}
                      onChange={(e) => updateField("citizenshipNo", e.target.value)}
                      placeholder="XX-XX-XX-XXXXX"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Purpose of Visit (Optional)</Label>
                    <Input
                      value={formData.purpose}
                      onChange={(e) => updateField("purpose", e.target.value)}
                      placeholder="Brief description of your visit purpose..."
                    />
                  </div>
                </>
              )}

              <div className="flex justify-between pt-4 border-t">
                {step > 0 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(step - 1)}
                  >
                    Back
                  </Button>
                ) : (
                  <div />
                )}
                {step < 1 ? (
                  <Button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    disabled={!formData.service || !formData.office || !formData.date || !formData.time}
                  >
                    Next
                  </Button>
                ) : (
                  <Button type="submit" className="gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Confirm Appointment
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
