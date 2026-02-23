import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Phone, MapPin, CreditCard, Save } from "lucide-react";
import React from "react";

export default function ProfilePage() {
  
const profileData = JSON.parse(localStorage.getItem("user"))

const [profile, setProfile] = useState({
    full_name: profileData.full_name || "",
    email: profileData.email || "",
    phone: profileData.phone || "",
    district: profileData.district || "",
    citizenshipNo: profileData.citizenship || "",
  });


  const updateField = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="section-container py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Profile & Settings</h1>
          <p className="text-muted-foreground">Manage your personal information and preferences.</p>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold font-display">
              RS
            </div>
            <div>
              <h2 className="text-xl font-bold">{profileData.username}</h2>
              <p className="text-sm text-muted-foreground">{profileData.email}</p>
              <div className="badge-status bg-success/10 text-success mt-1">Verified Citizen</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-sans">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><User className="h-3.5 w-3.5" />Full Name</Label>
                <Input value={profileData.full_Name} onChange={(e) => updateField("fullName", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" />Email</Label>
                <Input type="email" value={profileData.email} onChange={(e) => updateField("email", e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" />Phone</Label>
                <Input type="tel" value={profileData.phone} onChange={(e) => updateField("phone", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" />District</Label>
                <Input value={profileData.district} onChange={(e) => updateField("district", e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2"><CreditCard className="h-3.5 w-3.5" />Citizenship Number</Label>
              <Input value={profileData.citizenshipNo} onChange={(e) => updateField("citizenshipNo", e.target.value)} />
            </div>

            <Separator />

            <div className="flex justify-end">
              <Button className="gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
