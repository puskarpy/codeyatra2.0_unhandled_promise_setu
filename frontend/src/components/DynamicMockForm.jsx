// DynamicMockForm.jsx
// A reusable, auto-filled form for document data extracted via OCR
// Supports citizenship, passport, pan, driving_license
// Receives OCR response as props, renders fields, allows editing, and handles submission

import { useState, forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

// Field configuration for each document type (fallback)
export const FORM_CONFIG = {
  citizenship: [
    { name: "full_name", label: "Full Name" },
    { name: "dob", label: "Date of Birth" },
    { name: "citizenship_number", label: "Citizenship Number" },
    { name: "district", label: "District" },
  ],
  passport: [
    { name: "passport_number", label: "Passport Number" },
    { name: "full_name", label: "Full Name" },
    { name: "dob", label: "Date of Birth" },
    { name: "nationality", label: "Nationality" },
    { name: "expiry_date", label: "Expiry Date" },
  ],
  pan: [
    { name: "pan_number", label: "PAN Number" },
    { name: "full_name", label: "Full Name" },
    { name: "dob", label: "Date of Birth" },
    { name: "address", label: "Address" },
  ],
  driving_license: [
    { name: "license_number", label: "License Number" },
    { name: "full_name", label: "Full Name" },
    { name: "dob", label: "Date of Birth" },
    { name: "issued_by", label: "Issued By" },
    { name: "expiry_date", label: "Expiry Date" },
  ],
};

// Utility function to convert field names to labels
function fieldNameToLabel(name) {
  return name
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, l => l.toUpperCase());
}

// Utility function to detect if field is date-like
function isDateField(name, value) {
  return (
    name.toLowerCase().includes("date") ||
    name.toLowerCase().includes("dob") ||
    (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value))
  );
}

/**
 * DynamicMockForm
 * @param {object} props - { ocrResponse, onSubmit, useDynamicFields }
 * ocrResponse: { status, document_type, extracted_data }
 * onSubmit: function to handle final data
 * useDynamicFields: bool, if true use all extracted_data fields, else use FORM_CONFIG
 */
const DynamicMockForm = forwardRef(function DynamicMockForm(
  { ocrResponse, onSubmit, useDynamicFields = true },
  ref
) {
  const { document_type, extracted_data } = ocrResponse || {};

  // Determine fields: use dynamic fields from extracted_data if useDynamicFields is true
  let fields = [];
  if (useDynamicFields && extracted_data && typeof extracted_data === "object") {
    // Generate fields dynamically from extracted_data
    fields = Object.entries(extracted_data).map(([name, value]) => ({
      name,
      label: fieldNameToLabel(name),
      type: isDateField(name, value) ? "date" : "text",
    }));
  } else {
    // Fall back to predefined config
    fields = FORM_CONFIG[document_type] || [];
  }

  // Initialize form state with extracted data or empty
  const [formState, setFormState] = useState(() => {
    const initial = {};
    fields.forEach(f => {
      initial[f.name] = extracted_data?.[f.name] || "";
    });
    return initial;
  });
  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleChange = (name, value) => {
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  // Basic validation (example: required fields)
  const validate = () => {
    const errs = {};
    fields.forEach(f => {
      if (!formState[f.name]) errs[f.name] = "Required";
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Handle form submission
  const handleSubmit = e => {
    e.preventDefault();
    if (!validate()) return;
    if (onSubmit) onSubmit({ document_type, ...formState });
    else console.log("Final Data:", { document_type, ...formState });
  };

  if (!document_type) return <div>No document type detected.</div>;

  return (
    <form ref={ref} className="space-y-4" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold mb-4">{document_type.replace(/_/g, " ").toUpperCase()} Mock Form</h2>
      <div className="grid grid-cols-1 gap-4">
        {fields.map(f => (
          <div key={f.name} className="space-y-1">
            <Label htmlFor={f.name}>{f.label}</Label>
            <Input
              id={f.name}
              type={f.type || "text"}
              value={formState[f.name]}
              onChange={e => handleChange(f.name, e.target.value)}
              placeholder={f.label}
              autoComplete="off"
            />
            {errors[f.name] && <div className="text-red-500 text-xs">{errors[f.name]}</div>}
          </div>
        ))}
      </div>
      <Button type="submit" className="mt-4">Submit</Button>
    </form>
  );
});

export default DynamicMockForm;
