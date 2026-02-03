"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Store, Palette, Bell, Save } from "lucide-react";
import { toast } from "sonner";

export function SettingsForm() {
  const [loading, setLoading] = useState(false);

  const [generalSettings, setGeneralSettings] = useState({
    storeName: "Meat Store",
    storeEmail: "admin@meatstore.com",
    currency: "NGN",
    timezone: "Africa/Lagos",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    newOrders: true,
    lowStock: true,
    customerSignups: false,
    marketingEmails: false,
  });

  const handleSave = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast("Settings saved", {
        description: "Your changes have been successfully saved.",
      });
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your store preferences and system configuration.
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={loading}
          className="w-full sm:w-auto gap-2 bg-amber-900 hover:bg-amber-800"
        >
          <Save className="h-4 w-4" />
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-[600px]">
          <TabsTrigger
            value="general"
            className="gap-2 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700"
          >
            <Store className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger
            value="appearance"
            className="gap-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
          >
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="gap-2 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700"
          >
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card className="border-t-4 border-t-purple-500 shadow-sm mt-6">
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
              <CardDescription>
                Configure the basic details of your online store.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input
                    id="storeName"
                    value={generalSettings.storeName}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        storeName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeEmail">Contact Email</Label>
                  <Input
                    id="storeEmail"
                    type="email"
                    value={generalSettings.storeEmail}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        storeEmail: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <Separator />
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select defaultValue={generalSettings.currency}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NGN">Nigerian Naira (₦)</SelectItem>
                      <SelectItem value="USD">US Dollar ($)</SelectItem>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue={generalSettings.timezone}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Africa/Lagos">
                        Africa/Lagos (GMT+1)
                      </SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance">
          <Card className="border-t-4 border-t-blue-500 shadow-sm mt-6">
            <CardHeader>
              <CardTitle>Theme & Branding</CardTitle>
              <CardDescription>
                Customize how your admin dashboard looks.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Accent Color</Label>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-purple-600 ring-2 ring-offset-2 ring-purple-600 cursor-pointer"></div>
                  <div className="h-10 w-10 rounded-full bg-blue-600 cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-blue-600 transition-all"></div>
                  <div className="h-10 w-10 rounded-full bg-green-600 cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-green-600 transition-all"></div>
                  <div className="h-10 w-10 rounded-full bg-orange-600 cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-orange-600 transition-all"></div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Currently using the default "Solutions" Purple theme.
                </p>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Compact Mode</Label>
                  <CardDescription>
                    Reduce padding and whitespace for better information
                    density.
                  </CardDescription>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card className="border-t-4 border-t-orange-500 shadow-sm mt-6">
            <CardHeader>
              <CardTitle>Email Alerts</CardTitle>
              <CardDescription>
                Choose what you want to be notified about.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
                <div className="space-y-0.5">
                  <Label className="text-base">New Orders</Label>
                  <CardDescription>
                    Receive an email when a new order is placed.
                  </CardDescription>
                </div>
                <Switch
                  checked={notificationSettings.newOrders}
                  onCheckedChange={(c) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      newOrders: c,
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
                <div className="space-y-0.5">
                  <Label className="text-base">Low Stock Alerts</Label>
                  <CardDescription>
                    Get notified when product inventory runs low.
                  </CardDescription>
                </div>
                <Switch
                  checked={notificationSettings.lowStock}
                  onCheckedChange={(c) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      lowStock: c,
                    })
                  }
                />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
                <div className="space-y-0.5">
                  <Label className="text-base">Customer Signups</Label>
                  <CardDescription>
                    Receive a digest of new customer registrations.
                  </CardDescription>
                </div>
                <Switch
                  checked={notificationSettings.customerSignups}
                  onCheckedChange={(c) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      customerSignups: c,
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
