import { useState, useEffect, useRef } from "react";
import axios from "../api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { 
  ArrowLeft, CheckCircle2, Upload, Loader, AlertCircle, Eye
} from "lucide-react";

export default function GuidedFormsPage() {
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [ocrData, setOcrData] = useState(null);
  const [formAnswers, setFormAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const fileInputRef = useRef();
  const formRef = useRef();

  // Fetch available form templates
  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("access");
      const response = await axios.get("/api/forms/form-templates/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setForms(response.data || []);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load forms");
      console.error("Error fetching forms:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectForm = (form) => {
    setSelectedForm(form);
    setOcrData(null);
    setFormAnswers({});
    setError(null);
    setShowForm(false);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanning(true);
    setError(null);
    setOcrData(null);

    try {
      const token = localStorage.getItem("access");
      const formData = new FormData();
      formData.append("file", file);
      
      // Map form names to document types
      const documentTypeMap = {
        'Citizenship Certificate Application Form': 'citizenship',
        'Passport Application Form': 'passport',
        'Driving License Form': 'driving_license',
        'Land Registration Form': 'land_registration',
      };
      
      const documentType = documentTypeMap[selectedForm?.name] || 'passport';
      formData.append("document_type", documentType);

      // Call OCR API
      const response = await axios.post("/api/documents/scan/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setOcrData(response.data);

      // Pre-fill form with OCR extracted data
      if (response.data?.extracted_data) {
        const answers = {};
        const questions = selectedForm?.questions || [];
        
        questions.forEach(question => {
          // Try to find matching data from OCR results
          const value = response.data.extracted_data[question.text] || 
                       response.data.extracted_data[question.text.toLowerCase()] ||
                       "";
          answers[question.id] = value;
        });

        setFormAnswers(answers);
        setShowForm(true);
        
        // Scroll form into view
        setTimeout(() => {
          formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to scan document");
      console.error("Error scanning document:", err);
    } finally {
      setScanning(false);
    }
  };

  const handleInputChange = (questionId, value) => {
    setFormAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const validateForm = () => {
    if (!selectedForm) return false;
    for (const question of selectedForm.questions || []) {
      if (question.required && !formAnswers[question.id]) {
        setError(`Please answer: ${question.text}`);
        return false;
      }
    }
    return true;
  };

  const handleSubmitForm = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem("access");
      
      // Create form submission
      const submissionRes = await axios.post(
        "/api/forms/submissions/",
        {
          form_template: selectedForm.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const submissionId = submissionRes.data.id;

      // Submit answers
      for (const [questionId, value] of Object.entries(formAnswers)) {
        if (value) {
          await axios.post(
            "/api/forms/answers/",
            {
              submission: submissionId,
              question: questionId,
              value,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }
      }

      setSubmitted(true);
      // Reset after 3 seconds
      setTimeout(() => {
        setSelectedForm(null);
        setFormAnswers({});
        setOcrData(null);
        setSubmitted(false);
        fetchForms();
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to submit form");
      console.error("Error submitting form:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Success screen
  if (submitted) {
    return (
      <div className="section-container py-16">
        <div className="max-w-md mx-auto text-center bg-white rounded-lg shadow-sm p-8">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">Form Submitted!</h2>
          <p className="text-muted-foreground mb-6">
            Your form has been successfully submitted with OCR-extracted data. Redirecting...
          </p>
        </div>
      </div>
    );
  }

  // Form with document upload and OCR
  if (selectedForm && !showForm) {
    return (
      <div className="section-container py-8">
        <div className="max-w-2xl mx-auto">
          <Button
            variant="ghost"
            className="mb-6 gap-2"
            onClick={() => {
              setSelectedForm(null);
              setFormAnswers({});
              setOcrData(null);
              setError(null);
            }}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Forms
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">{selectedForm.name}</CardTitle>
              {selectedForm.description && (
                <p className="text-sm text-muted-foreground mt-2">{selectedForm.description}</p>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <div className="p-4 rounded-lg bg-destructive/10 text-destructive flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
                <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="font-medium mb-1">Upload Document for Guided Form</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload a document image and we'll automatically extract the information to pre-fill this form
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  style={{ display: "none" }}
                  onChange={handleFileUpload}
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={scanning}
                >
                  {scanning ? (
                    <>
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Browse Files
                    </>
                  )}
                </Button>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedForm(null);
                    setFormAnswers({});
                    setError(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Form with pre-filled OCR data
  if (selectedForm && showForm) {
    const questions = selectedForm.questions || [];
    return (
      <div className="section-container py-8">
        <div className="max-w-2xl mx-auto">
          <Button
            variant="ghost"
            className="mb-6 gap-2"
            onClick={() => {
              setSelectedForm(null);
              setFormAnswers({});
              setOcrData(null);
              setShowForm(false);
              setError(null);
            }}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Forms
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Eye className="h-5 w-5 text-success" />
                {selectedForm.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Review the information extracted from your document. You can edit any field before submitting.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <div className="p-4 rounded-lg bg-destructive/10 text-destructive flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {ocrData && (
                <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                  <div className="text-sm">
                    <div className="font-semibold text-success mb-2">✓ Document scanned successfully!</div>
                    <div className="text-xs text-muted-foreground">
                      Extracted from: <span className="capitalize font-medium">{ocrData.document_type}</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={formRef} className="space-y-4">
                {questions.length === 0 ? (
                  <p className="text-muted-foreground">No questions in this form.</p>
                ) : (
                  questions.map(question => (
                    <div key={question.id} className="space-y-2">
                      <Label className="font-medium">
                        {question.text}
                        {question.required && <span className="text-destructive ml-1">*</span>}
                      </Label>
                      {question.question_type === "text" && (
                        <Input
                          value={formAnswers[question.id] || ""}
                          onChange={(e) => handleInputChange(question.id, e.target.value)}
                          placeholder="Edit if needed"
                        />
                      )}
                      {question.question_type === "number" && (
                        <Input
                          type="number"
                          value={formAnswers[question.id] || ""}
                          onChange={(e) => handleInputChange(question.id, e.target.value)}
                          placeholder="Edit if needed"
                        />
                      )}
                      {question.question_type === "choice" && question.choices && (
                        <Select value={formAnswers[question.id] || ""} onValueChange={(v) => handleInputChange(question.id, v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an option" />
                          </SelectTrigger>
                          <SelectContent>
                            {question.choices.map((choice, idx) => (
                              <SelectItem key={idx} value={choice}>
                                {choice}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className="flex gap-3 pt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedForm(null);
                    setFormAnswers({});
                    setOcrData(null);
                    setShowForm(false);
                    setError(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitForm}
                  disabled={submitting || questions.length === 0}
                  className="gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Submit Form
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Form list screen
  return (
    <div className="section-container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Guided Forms</h1>
          <p className="text-muted-foreground">
            Select a form, upload a document, and we'll automatically fill it with extracted information.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-destructive/10 text-destructive flex items-start gap-3">
            <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : forms.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No forms available at this time.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Check back later for guided forms to help you apply for services.
              </p>
              <Button variant="outline" onClick={fetchForms} className="mt-4">
                Refresh
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {forms.map(form => (
              <Card key={form.id} className="card-elevated hover:border-primary/30 transition-all cursor-pointer hover:shadow-md">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{form.name}</CardTitle>
                      {form.description && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {form.description}
                        </p>
                      )}
                    </div>
                    <Upload className="h-5 w-5 text-muted-foreground ml-2 shrink-0" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {(form.questions || []).length} fields
                    </span>
                    <Button
                      onClick={() => handleSelectForm(form)}
                      size="sm"
                    >
                      Upload Document
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
