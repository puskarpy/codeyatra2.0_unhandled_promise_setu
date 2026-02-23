import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { CheckCircle2, Upload, ArrowLeft, ArrowRight, FileText } from "lucide-react";
import React from "react";

const steps = [
  { title: "Service Selection", description: "Choose the service you need" },
  { title: "Personal Details", description: "Provide your information" },
  { title: "Documents", description: "Upload required documents" },
  { title: "Review & Submit", description: "Confirm and submit" },
];

export default function SubmitPage() {
  const [formData, setFormData] = useState({
    user_name: "",
    citizenship_number: "",
    province: "",
    district: "",
    city: "",
    office: "",
  });
  
  const [submitted, setSubmitted] = useState(false);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="section-container py-16 text-center animate-fade-in">
        <div className="max-w-md mx-auto">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10 mx-auto mb-6">
            <CheckCircle2 className="h-8 w-8 text-success" />
          </div>
          <h1 className="text-2xl font-bold mb-3">Application Submitted!</h1>
          <p className="text-muted-foreground mb-2">
            Your application has been submitted successfully. Reference number:
          </p>
          <p className="text-lg font-mono font-bold text-primary mb-6">SETU-2026-00421</p>
          <Button onClick={() => { setSubmitted(false); setStep(0); }} variant="outline">
            Submit Another Application
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="section-container py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Book an Appointment</h1>
          <p className="text-muted-foreground">Fill in your details to schedule an appointment</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Appointment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {apiError && (
                <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">{apiError}</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="user_name">Full Name *</Label>
                  <Input
                    id="user_name"
                    value={formData.user_name}
                    onChange={(e) => updateField("user_name", e.target.value)}
                    placeholder="Enter your full name"
                    className={errors.user_name ? "border-red-500" : ""}
                  />
                  {errors.user_name && (
                    <p className="text-sm text-red-500">{errors.user_name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="citizenship_number">Citizenship Number *</Label>
                  <Input
                    id="citizenship_number"
                    value={formData.citizenship_number}
                    onChange={(e) => updateField("citizenship_number", e.target.value)}
                    placeholder="e.g., 123-45-67890"
                    className={errors.citizenship_number ? "border-red-500" : ""}
                  />
                  {errors.citizenship_number && (
                    <p className="text-sm text-red-500">{errors.citizenship_number}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Additional Notes</Label>
                  <Textarea value={formData.message} onChange={(e) => updateField("message", e.target.value)} placeholder="Any additional information..." rows={3} />
                </div>
              </div>
  
            {steps === 2 && (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
                  <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="font-medium mb-1">Upload Documents</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Drag & drop or click to upload (PDF, JPG, PNG up to 10MB)
                  </p>
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Browse Files
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Required: Citizenship copy, recent passport-size photo, supporting documents.
                </p>
              </div>
            )}

            <div className="space-y-2">
                  <Label htmlFor="district">District *</Label>
                  <Input
                    id="district"
                    value={formData.district}
                    onChange={(e) => updateField("district", e.target.value)}
                    placeholder="Enter district name"
                    className={errors.district ? "border-red-500" : ""}
                  />
                  {errors.district && (
                    <p className="text-sm text-red-500">{errors.district}</p>
                  )}
                </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    placeholder="Enter city name"
                    className={errors.city ? "border-red-500" : ""}
                  />
                  {errors.city && (
                    <p className="text-sm text-red-500">{errors.city}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="office">Office *</Label>
                  <Select value={formData.office} onValueChange={(v) => updateField("office", v)}>
                    <SelectTrigger className={errors.office ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select Office" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kathmandu">Kathmandu Office</SelectItem>
                      <SelectItem value="pokhara">Pokhara Office</SelectItem>
                      <SelectItem value="dharan">Dharan Office</SelectItem>
                      <SelectItem value="biratnagar">Biratnagar Office</SelectItem>
                      <SelectItem value="butwal">Butwal Office</SelectItem>
                      <SelectItem value="birgunj">Birgunj Office</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.office && (
                    <p className="text-sm text-red-500">{errors.office}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  type="submit" 
                  className="flex-1"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit Appointment"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handleReset}
                >
                  Clear
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
