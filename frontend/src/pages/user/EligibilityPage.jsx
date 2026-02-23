import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { CheckCircle2, XCircle, ArrowRight, Search } from "lucide-react";

const schemes = [
  { id: "youth-employment", name: "Youth Employment Program", minAge: 18, maxAge: 35, districts: ["all"] },
  { id: "senior-allowance", name: "Senior Citizen Allowance", minAge: 65, maxAge: 120, districts: ["all"] },
  { id: "scholarship", name: "Government Scholarship", minAge: 16, maxAge: 30, districts: ["all"] },
  { id: "housing-grant", name: "Affordable Housing Grant", minAge: 21, maxAge: 60, districts: ["Kathmandu", "Lalitpur", "Bhaktapur"] },
  { id: "agriculture-subsidy", name: "Agriculture Subsidy Program", minAge: 18, maxAge: 70, districts: ["all"] },
];

export default function EligibilityPage() {
  const [age, setAge] = useState("");
  const [district, setDistrict] = useState("");
  const [results, setResults] = useState(null);

  const checkEligibility = (e) => {
    e.preventDefault();
    const ageNum = parseInt(age);
    const res = schemes.map((scheme) => {
      const ageOk = ageNum >= scheme.minAge && ageNum <= scheme.maxAge;
      const districtOk = scheme.districts.includes("all") || scheme.districts.includes(district);
      return {
        name: scheme.name,
        eligible: ageOk && districtOk,
        reason: !ageOk
          ? `Age must be ${scheme.minAge}–${scheme.maxAge}`
          : !districtOk
          ? `Not available in ${district}`
          : "You meet all criteria",
      };
    });
    setResults(res);
  };

  return (
    <div className="section-container py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Eligibility Checker</h1>
          <p className="text-muted-foreground">
            Enter your details to check which government schemes and services you're eligible for.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg font-sans flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Your Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={checkEligibility} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="Enter your age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                    min={1}
                    max={120}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district">District</Label>
                  <Select value={district} onValueChange={setDistrict} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your district" />
                    </SelectTrigger>
                    <SelectContent>
                      {["Kathmandu", "Lalitpur", "Bhaktapur", "Pokhara", "Biratnagar", "Birgunj", "Dharan", "Butwal", "Hetauda", "Janakpur"].map((d) => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit" className="gap-2" disabled={!age || !district}>
                Check Eligibility
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>

        {results && (
          <div className="space-y-3 animate-fade-in">
            <h2 className="text-xl font-bold mb-4">
              Results ({results.filter(r => r.eligible).length} of {results.length} eligible)
            </h2>
            {results.map((result) => (
              <div
                key={result.name}
                className={`flex items-center gap-4 p-4 rounded-xl border ${
                  result.eligible ? "bg-success/5 border-success/20" : "bg-muted/50 border-border"
                }`}
              >
                {result.eligible ? (
                  <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
                ) : (
                  <XCircle className="h-5 w-5 text-muted-foreground shrink-0" />
                )}
                <div className="flex-1">
                  <span className="font-medium text-sm">{result.name}</span>
                  <p className="text-xs text-muted-foreground mt-0.5">{result.reason}</p>
                </div>
                {result.eligible && (
                  <Button variant="outline" size="sm" className="shrink-0">
                    Apply
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
