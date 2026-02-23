import { useState, useRef } from "react";
import axios from "../api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { CheckCircle2, Upload, ArrowLeft, ArrowRight, FileText } from "lucide-react";
import DynamicMockForm from "@/components/DynamicMockForm";

const steps = [
  { title: "Service Selection", description: "Choose the service you need" },
  { title: "Personal Details", description: "Provide your information" },
  { title: "Documents", description: "Upload required documents" },
  { title: "Review & Submit", description: "Confirm and submit" },
];

export default function SubmitPage() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    service: "",
    fullName: "",
    email: "",
    phone: "",
    address: "",
    message: "",
    files: [],
  });
  const [submitted, setSubmitted] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [viewMockForm, setViewMockForm] = useState(false);
  const fileInputRef = useRef();
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handles file upload and document scan
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    updateField("files", [file]);
    setScanResult(null);
    // Set image preview if file is image
    if (file.type.startsWith("image/")) {
      setImagePreviewUrl(URL.createObjectURL(file));
    } else {
      setImagePreviewUrl(null);
    }
    // Scan document immediately after file selection
    const token = localStorage.getItem("access");
    const formDataObj = new FormData();
    formDataObj.append("file", file);
    formDataObj.append("document_type", formData.documentType || "");
    try {
      const res = await axios.post("/api/documents/scan/", formDataObj, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setScanResult(res.data);
      // Mock autofill: try to fill form fields from OCR result
      let ocrText = "";
      if (typeof res.data === "string") {
        ocrText = res.data;
      } else if (res.data && res.data.extracted_data) {
        ocrText = JSON.stringify(res.data.extracted_data);
      }
      if (ocrText) {
        // Example: try to extract name, email, phone from OCR text
        const nameMatch = ocrText.match(/Name[:\s]+([A-Za-z ]+)/i);
        const emailMatch = ocrText.match(/Email[:\s]+([\w.-]+@[\w.-]+)/i);
        const phoneMatch = ocrText.match(/Phone[:\s]+([+\d-]+)/i);
        updateField("fullName", nameMatch ? nameMatch[1].trim() : "");
        updateField("email", emailMatch ? emailMatch[1].trim() : "");
        updateField("phone", phoneMatch ? phoneMatch[1].trim() : "");
      }
    } catch (err) {
      setScanResult({ error: err.response?.data?.detail || err.message });
    }
  };

  // Handles final form submission (mock)
  const handleSubmit = async () => {
    setSubmitted(true);
    setViewMockForm(true);
  };

  if (submitted && !viewMockForm) {
    // Skip success screen, show mock form directly
    return null;
  }

  if (viewMockForm) {
    return (
      <div className="section-container py-16 animate-fade-in">
        <div className="max-w-lg mx-auto bg-white rounded shadow p-8">
          <DynamicMockForm
            ocrResponse={scanResult}
            onSubmit={data => {
              // You can send data to backend here or log it
              console.log("Confirmed Data:", data);
              setViewMockForm(false);
              setSubmitted(false);
              setStep(0);
            }}
          />
          <div className="mt-6">
            <div><b>Uploaded File:</b> {formData.files.length > 0 ? formData.files[0].name : "—"}</div>
            {imagePreviewUrl && (
              <div className="mt-4">
                <b>Image Preview:</b>
                <img src={imagePreviewUrl} alt="Uploaded Preview" style={{ maxWidth: "100%", borderRadius: "8px", marginTop: "8px" }} />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-container py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Submit Application</h1>
          <p className="text-muted-foreground">Complete the form to submit your application.</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-2 min-w-fit">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold shrink-0 ${
                i < step ? "bg-success text-success-foreground" :
                i === step ? "bg-primary text-primary-foreground" :
                "bg-muted text-muted-foreground"
              }`}>
                {i < step ? "✓" : i + 1}
              </div>
              <span className={`text-sm whitespace-nowrap ${i === step ? "font-medium" : "text-muted-foreground"}`}>
                {s.title}
              </span>
              {i < steps.length - 1 && <div className="w-8 h-px bg-border shrink-0" />}
            </div>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-sans">{steps[step].description}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {step === 0 && (
              <div className="space-y-2">
                <Label>Select Service</Label>
                <Select value={formData.service} onValueChange={(v) => updateField("service", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a government service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="citizenship">Citizenship Certificate</SelectItem>
                    <SelectItem value="passport">Passport Application</SelectItem>
                    <SelectItem value="driving">Driving License</SelectItem>
                    <SelectItem value="land">Land Registration</SelectItem>
                    <SelectItem value="business">Business Registration</SelectItem>
                    <SelectItem value="birth">Birth Certificate</SelectItem>
                    <SelectItem value="marriage">Marriage Certificate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {step === 1 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input value={formData.fullName} onChange={(e) => updateField("fullName", e.target.value)} placeholder="Enter full name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" value={formData.email} onChange={(e) => updateField("email", e.target.value)} placeholder="you@example.com" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input type="tel" value={formData.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="+977-98XXXXXXXX" />
                  </div>
                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Input value={formData.address} onChange={(e) => updateField("address", e.target.value)} placeholder="District, Municipality" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Additional Notes</Label>
                  <Textarea value={formData.message} onChange={(e) => updateField("message", e.target.value)} placeholder="Any additional information..." rows={3} />
                </div>
              </>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Document Type</Label>
                  <Select value={formData.documentType || ""} onValueChange={v => updateField("documentType", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="citizenship">Citizenship Card</SelectItem>
                      <SelectItem value="passport">Passport</SelectItem>
                      <SelectItem value="pan">PAN Card</SelectItem>
                      <SelectItem value="driving_license">Driving License</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
                  <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="font-medium mb-1">Upload Document</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Drag & drop or click to upload (PDF, JPG, PNG up to 10MB)
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,image/*"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Browse Files
                  </Button>
                  {formData.files.length > 0 && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      Selected: {formData.files[0].name}
                    </div>
                  )}
                  <div className="mt-4 text-xs text-warning-foreground">
                    <b>Note:</b> If submitting a <b>citizenship certificate</b>, both the front and back must be in the <b>same image</b>.
                  </div>
                </div>
                {scanResult && (
                  <div className="mt-4 p-4 rounded bg-muted/50 text-left">
                    {scanResult.error ? (
                      <div className="text-red-600">{scanResult.error}</div>
                    ) : (
                      <>
                        <div className="font-semibold mb-2">Extracted Data:</div>
                        <pre className="text-xs whitespace-pre-wrap break-all bg-background p-2 rounded border border-border">
                          {JSON.stringify(scanResult.extracted_data, null, 2)}
                        </pre>
                        <div className="font-semibold mt-2">Document Type: <span className="capitalize">{scanResult.document_type}</span></div>
                      </>
                    )}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Required: Citizenship copy, recent passport-size photo, supporting documents.
                </p>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-3">
                <div className="rounded-lg bg-muted/50 p-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Service:</span><span className="font-medium capitalize">{formData.service || "—"}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Name:</span><span className="font-medium">{formData.fullName || "—"}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Email:</span><span className="font-medium">{formData.email || "—"}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Phone:</span><span className="font-medium">{formData.phone || "—"}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Address:</span><span className="font-medium">{formData.address || "—"}</span></div>
                </div>
                <p className="text-xs text-muted-foreground">
                  By submitting, you confirm that the information provided is accurate and complete.
                </p>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(step - 1)} disabled={step === 0} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              {step < steps.length - 1 ? (
                <Button onClick={() => setStep(step + 1)} className="gap-2">
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} className="gap-2">
                  Submit Application
                  <CheckCircle2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
