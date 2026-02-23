import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Save, Bell, Shield, Database, Mail, 
  Globe, Key, User, AlertTriangle
} from "lucide-react";

export default function Settings() {
  const [settings, setSettings] = useState({
    // General Settings
    siteName: "Setu",
    siteDescription: "Nepal's Unified e-Government Portal",
    defaultLanguage: "en",
    timezone: "Asia/Kathmandu",
    
    // Notification Settings
    emailNotifications: true,
    applicationAlerts: true,
    systemAlerts: true,
    weeklyReports: false,
    
    // Security Settings
    sessionTimeout: 30,
    requireTwoFactor: false,
    passwordMinLength: 8,
    passwordRequireSpecial: true,
    
    // Email Settings
    smtpHost: "smtp.example.com",
    smtpPort: 587,
    smtpUser: "noreply@setu.gov.np",
    smtpFrom: "Setu Portal <noreply@setu.gov.np>",
    
    // Maintenance Settings
    maintenanceMode: false,
    maintenanceMessage: "System is under maintenance. Please check back later.",
  });

  const updateSetting = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleSave = () => {
    // In a real app, this would save to backend
    alert("Settings saved successfully!");
  };

  return (
    <div className="section-container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Configure system settings, preferences, and security options.
        </p>
      </div>

      <div className="space-y-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-sans flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Site Name</Label>
                <Input
                  value={settings.siteName}
                  onChange={(e) => updateSetting("siteName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Default Language</Label>
                <Select 
                  value={settings.defaultLanguage} 
                  onValueChange={(v) => updateSetting("defaultLanguage", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ne">नेपाली</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Site Description</Label>
              <Input
                value={settings.siteDescription}
                onChange={(e) => updateSetting("siteDescription", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Timezone</Label>
              <Select 
                value={settings.timezone} 
                onValueChange={(v) => updateSetting("timezone", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asia/Kathmandu">Asia/Kathmandu (NPT)</SelectItem>
                  <SelectItem value="UTC">UTC</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-sans flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Enable email notifications for admin actions</p>
              </div>
              <Select 
                value={settings.emailNotifications.toString()} 
                onValueChange={(v) => updateSetting("emailNotifications", v === "true")}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Enabled</SelectItem>
                  <SelectItem value="false">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Application Alerts</Label>
                <p className="text-sm text-muted-foreground">Get notified when new applications are submitted</p>
              </div>
              <Select 
                value={settings.applicationAlerts.toString()} 
                onValueChange={(v) => updateSetting("applicationAlerts", v === "true")}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Enabled</SelectItem>
                  <SelectItem value="false">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>System Alerts</Label>
                <p className="text-sm text-muted-foreground">Receive alerts for system issues and maintenance</p>
              </div>
              <Select 
                value={settings.systemAlerts.toString()} 
                onValueChange={(v) => updateSetting("systemAlerts", v === "true")}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Enabled</SelectItem>
                  <SelectItem value="false">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Weekly Reports</Label>
                <p className="text-sm text-muted-foreground">Receive weekly summary reports via email</p>
              </div>
              <Select 
                value={settings.weeklyReports.toString()} 
                onValueChange={(v) => updateSetting("weeklyReports", v === "true")}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Enabled</SelectItem>
                  <SelectItem value="false">Disabled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-sans flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Session Timeout (minutes)</Label>
                <Input
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => updateSetting("sessionTimeout", parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label>Minimum Password Length</Label>
                <Input
                  type="number"
                  value={settings.passwordMinLength}
                  onChange={(e) => updateSetting("passwordMinLength", parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
              </div>
              <Select 
                value={settings.requireTwoFactor.toString()} 
                onValueChange={(v) => updateSetting("requireTwoFactor", v === "true")}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Required</SelectItem>
                  <SelectItem value="false">Optional</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Require Special Characters</Label>
                <p className="text-sm text-muted-foreground">Passwords must include special characters</p>
              </div>
              <Select 
                value={settings.passwordRequireSpecial.toString()} 
                onValueChange={(v) => updateSetting("passwordRequireSpecial", v === "true")}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Required</SelectItem>
                  <SelectItem value="false">Optional</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-sans flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Email Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>SMTP Host</Label>
                <Input
                  value={settings.smtpHost}
                  onChange={(e) => updateSetting("smtpHost", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>SMTP Port</Label>
                <Input
                  type="number"
                  value={settings.smtpPort}
                  onChange={(e) => updateSetting("smtpPort", parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>SMTP Username</Label>
              <Input
                value={settings.smtpUser}
                onChange={(e) => updateSetting("smtpUser", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>From Email</Label>
              <Input
                value={settings.smtpFrom}
                onChange={(e) => updateSetting("smtpFrom", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Maintenance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-sans flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Maintenance Mode
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">Put the system in maintenance mode</p>
              </div>
              <div className="flex items-center gap-2">
                {settings.maintenanceMode && (
                  <Badge className="bg-warning/10 text-warning">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                )}
                <Select 
                  value={settings.maintenanceMode.toString()} 
                  onValueChange={(v) => updateSetting("maintenanceMode", v === "true")}
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">Disabled</SelectItem>
                    <SelectItem value="true">Enabled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {settings.maintenanceMode && (
              <div className="space-y-2">
                <Label>Maintenance Message</Label>
                <Input
                  value={settings.maintenanceMessage}
                  onChange={(e) => updateSetting("maintenanceMessage", e.target.value)}
                  placeholder="Message to display to users..."
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} className="gap-2" size="lg">
            <Save className="h-4 w-4" />
            Save All Settings
          </Button>
        </div>
      </div>
    </div>
  );
}

