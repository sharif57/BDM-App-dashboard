"use client"

import { useState } from "react"
import { Save, Bell, Shield, Palette, Globe, Database, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function SettingsContent() {
  const [settings, setSettings] = useState({
    siteName: "Dashboard Admin",
    siteDescription: "Complete admin dashboard with analytics and management tools",
    adminEmail: "admin@dashboard.com",
    timezone: "UTC",
    language: "English",
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: true,
    twoFactorAuth: false,
    autoBackup: true,
    maintenanceMode: false,
    darkMode: true,
    compactMode: false,
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    // Save settings logic here
    console.log("Settings saved:", settings)
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Settings</h2>
          <p className="text-gray-400">Manage your application settings and preferences</p>
        </div>
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Globe className="w-5 h-5 mr-2" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="siteName" className="text-gray-300">
                Site Name
              </Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => handleSettingChange("siteName", e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="siteDescription" className="text-gray-300">
                Site Description
              </Label>
              <Textarea
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => handleSettingChange("siteDescription", e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="adminEmail" className="text-gray-300">
                Admin Email
              </Label>
              <Input
                id="adminEmail"
                type="email"
                value={settings.adminEmail}
                onChange={(e) => handleSettingChange("adminEmail", e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="timezone" className="text-gray-300">
                Timezone
              </Label>
              <select
                id="timezone"
                value={settings.timezone}
                onChange={(e) => handleSettingChange("timezone", e.target.value)}
                className="w-full bg-gray-700 border-gray-600 text-white rounded-md px-3 py-2"
              >
                <option value="UTC">UTC</option>
                <option value="EST">Eastern Time</option>
                <option value="PST">Pacific Time</option>
                <option value="GMT">Greenwich Mean Time</option>
              </select>
            </div>
            <div>
              <Label htmlFor="language" className="text-gray-300">
                Language
              </Label>
              <select
                id="language"
                value={settings.language}
                onChange={(e) => handleSettingChange("language", e.target.value)}
                className="w-full bg-gray-700 border-gray-600 text-white rounded-md px-3 py-2"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="emailNotifications" className="text-gray-300">
                Email Notifications
              </Label>
              <Switch
                id="emailNotifications"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="pushNotifications" className="text-gray-300">
                Push Notifications
              </Label>
              <Switch
                id="pushNotifications"
                checked={settings.pushNotifications}
                onCheckedChange={(checked) => handleSettingChange("pushNotifications", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="smsNotifications" className="text-gray-300">
                SMS Notifications
              </Label>
              <Switch
                id="smsNotifications"
                checked={settings.smsNotifications}
                onCheckedChange={(checked) => handleSettingChange("smsNotifications", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="twoFactorAuth" className="text-gray-300">
                Two-Factor Authentication
              </Label>
              <Switch
                id="twoFactorAuth"
                checked={settings.twoFactorAuth}
                onCheckedChange={(checked) => handleSettingChange("twoFactorAuth", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="autoBackup" className="text-gray-300">
                Automatic Backup
              </Label>
              <Switch
                id="autoBackup"
                checked={settings.autoBackup}
                onCheckedChange={(checked) => handleSettingChange("autoBackup", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="maintenanceMode" className="text-gray-300">
                Maintenance Mode
              </Label>
              <Switch
                id="maintenanceMode"
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => handleSettingChange("maintenanceMode", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Palette className="w-5 h-5 mr-2" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="darkMode" className="text-gray-300">
                Dark Mode
              </Label>
              <Switch
                id="darkMode"
                checked={settings.darkMode}
                onCheckedChange={(checked) => handleSettingChange("darkMode", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="compactMode" className="text-gray-300">
                Compact Mode
              </Label>
              <Switch
                id="compactMode"
                checked={settings.compactMode}
                onCheckedChange={(checked) => handleSettingChange("compactMode", checked)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Settings Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Database Settings */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Database className="w-5 h-5 mr-2" />
              Database
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-gray-300">
              <p className="mb-2">
                Database Status: <span className="text-green-400">Connected</span>
              </p>
              <p className="mb-2">
                Last Backup: <span className="text-white">2024-01-15 10:30 AM</span>
              </p>
              <p className="mb-4">
                Database Size: <span className="text-white">2.4 GB</span>
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                >
                  Backup Now
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                >
                  Optimize
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              Email Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="smtpHost" className="text-gray-300">
                SMTP Host
              </Label>
              <Input id="smtpHost" placeholder="smtp.example.com" className="bg-gray-700 border-gray-600 text-white" />
            </div>
            <div>
              <Label htmlFor="smtpPort" className="text-gray-300">
                SMTP Port
              </Label>
              <Input id="smtpPort" placeholder="587" className="bg-gray-700 border-gray-600 text-white" />
            </div>
            <Button variant="outline" size="sm" className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600">
              Test Connection
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
