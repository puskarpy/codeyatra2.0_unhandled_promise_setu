import { useState } from "react";
import axios from "../api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { CheckCircle2, AlertCircle } from "lucide-react";

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
  const [qrCode, setQrCode] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.user_name || formData.user_name.trim().length < 2) {
      newErrors.user_name = "Name must be at least 2 characters";
    }
    if (!formData.citizenship_number || formData.citizenship_number.trim().length < 5) {
      newErrors.citizenship_number = "Invalid citizenship number";
    }
    if (!formData.province) {
      newErrors.province = "Please select a province";
    }
    if (!formData.district || formData.district.trim().length < 2) {
      newErrors.district = "District must be at least 2 characters";
    }
    if (!formData.city || formData.city.trim().length < 2) {
      newErrors.city = "City must be at least 2 characters";
    }
    if (!formData.office) {
      newErrors.office = "Please select an office";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/appointments/", formData);
      setQrCode(response.data.qr_code_url);
      setSubmitted(true);
    } catch (err) {
      setApiError(err.response?.data?.detail || "Failed to submit appointment");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      user_name: "",
      citizenship_number: "",
      province: "",
      district: "",
      city: "",
      office: "",
    });
    setSubmitted(false);
    setQrCode(null);
    setErrors({});
    setApiError(null);
  };

  if (submitted) {
    return (
      <div className="section-container py-16">
        <div className="max-w-lg mx-auto">
          <Card className="text-center">
            <CardHeader className="pb-4">
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="h-16 w-16 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Appointment Submitted!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-muted-foreground mb-4">
                  Your appointment has been confirmed. Scan the QR code below to access your appointment details.
                </p>
              </div>

              {qrCode && (
                <div className="flex justify-center">
                  <div className="p-4 bg-white border-2 border-border rounded-lg">
                    <img 
                      src={qrCode} 
                      alt="Appointment QR Code" 
                      className="w-48 h-48"
                    />
                  </div>
                </div>
              )}

              <div className="bg-muted/50 p-4 rounded-lg text-left text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span className="font-medium">{formData.user_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Citizenship #:</span>
                  <span className="font-medium">{formData.citizenship_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Office:</span>
                  <span className="font-medium capitalize">
                    {formData.office.replace('-', ' ')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">City:</span>
                  <span className="font-medium">{formData.city}</span>
                </div>
              </div>

              <Button 
                onClick={handleReset} 
                className="w-full"
              >
                Book Another Appointment
              </Button>
            </CardContent>
          </Card>
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
                  <Label htmlFor="province">Province *</Label>
                  <Select value={formData.province} onValueChange={(v) => updateField("province", v)}>
                    <SelectTrigger className={errors.province ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select Province" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bagmati">Bagmati</SelectItem>
                      <SelectItem value="gandaki">Gandaki</SelectItem>
                      <SelectItem value="karnali">Karnali</SelectItem>
                      <SelectItem value="koshi">Koshi</SelectItem>
                      <SelectItem value="madhesh">Madhesh</SelectItem>
                      <SelectItem value="rasuwa">Rasuwa</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.province && (
                    <p className="text-sm text-red-500">{errors.province}</p>
                  )}
                </div>

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
