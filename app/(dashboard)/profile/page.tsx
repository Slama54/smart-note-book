"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Moon,
  Sun,
  Bell,
  Lock,
  Download,
  Info,
  LogOut,
  User,
  Phone,
  Mail,
  HelpCircle,
  Edit,
  Save,
  X,
  Loader,
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import {
  getUserProfile,
  updateUserProfile,
  getUserStats,
} from "@/lib/actions/profile";
import {
  type UpdateProfileData,
  updateProfileSchema,
} from "@/lib/actions/profile-schema";

export default function ProfilePage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [backupEnabled, setBackupEnabled] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [userStats, setUserStats] = useState<any>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<UpdateProfileData>({
    resolver: zodResolver(updateProfileSchema),
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      const [profileResult, statsResult] = await Promise.all([
        getUserProfile(),
        getUserStats(),
      ]);

      if (profileResult.success) {
        setUserProfile(profileResult.data!);
        reset({
          name: profileResult.data!.name,
          email: profileResult.data!.email,
        });
      } else {
        toast.error("Failed to load profile data");
      }

      if (statsResult.success) {
        setUserStats(statsResult.data);
      } else {
        toast.error("Failed to load user statistics");
      }
    } catch (error) {
      toast.error("Failed to load user data");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: UpdateProfileData) => {
    try {
      setIsUpdating(true);
      const result = await updateUserProfile(data);

      if (result.success) {
        setUserProfile(result.data);
        setIsEditing(false);
        toast.success("Profile updated successfully");
      } else {
        toast.error(result.error || "Failed to update profile");
      }
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    reset({
      name: userProfile?.name || "",
      email: userProfile?.email || "",
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset({
      name: userProfile?.name || "",
      email: userProfile?.email || "",
    });
  };

  const handleThemeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
    toast.success(`Switched to ${theme === "dark" ? "light" : "dark"} mode`);
  };

  const handleBackup = () => {
    toast.success("Backup started. Check again in a moment.");
    setBackupEnabled(true);
  };

  const handleExportData = () => {
    const mockData = {
      notebooks: [],
      pages: [],
      exportedAt: new Date().toISOString(),
    };
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:application/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(mockData, null, 2)),
    );
    element.setAttribute("download", "smartnotes-backup.json");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Data exported successfully");
  };

  if (isLoading) {
    return (
      <MainLayout>
        <Header title="Settings" subtitle="Profile & Preferences" />
        <div className="flex items-center justify-center h-screen">
          <div className="flex flex-col items-center gap-2">
            <Loader className="w-8 h-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Loading your profile...
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Header title="Settings" subtitle="Profile & Preferences" />

      <div className="px-4 py-6 space-y-4">
        {/* Profile Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Profile</CardTitle>
              {!isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEdit}
                  className="flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        {...register("name")}
                        className={errors.name ? "border-destructive" : ""}
                      />
                      {errors.name && (
                        <p className="text-sm text-destructive mt-1">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register("email")}
                        className={errors.email ? "border-destructive" : ""}
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={isUpdating}
                    className="flex items-center gap-2"
                  >
                    {isUpdating && <Loader className="w-4 h-4 animate-spin" />}
                    <Save className="w-4 h-4" />
                    Save Changes
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isUpdating}
                    className="flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">
                    {userProfile?.name || "SmartNotebook User"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {userProfile?.email}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Member since{" "}
                    {userProfile?.joinDate
                      ? new Date(userProfile.joinDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Display Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Display</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {theme === "dark" ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
                <div>
                  <p className="font-medium text-sm">Dark Mode</p>
                  <p className="text-xs text-muted-foreground">
                    {theme === "dark" ? "Enabled" : "Disabled"}
                  </p>
                </div>
              </div>
              <Switch
                checked={theme === "dark"}
                onCheckedChange={handleThemeToggle}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5" />
                <div>
                  <p className="font-medium text-sm">Push Notifications</p>
                  <p className="text-xs text-muted-foreground">
                    {notifications ? "Enabled" : "Disabled"}
                  </p>
                </div>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
          </CardContent>
        </Card>

        {/* Data & Privacy */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Data & Privacy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleBackup}
            >
              <Download className="w-4 h-4 mr-2" />
              Enable Cloud Backup
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleExportData}
            >
              <Download className="w-4 h-4 mr-2" />
              Export All Data
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start text-destructive hover:text-destructive"
            >
              <Lock className="w-4 h-4 mr-2" />
              Clear Local Data
            </Button>
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">About</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">App Version</span>
              <span className="font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Notebooks</span>
              <span className="font-medium">
                {userStats?.notebooksCount || 0}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Pages</span>
              <span className="font-medium">{userStats?.pagesCount || 0}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Scans</span>
              <span className="font-medium">{userStats?.scansCount || 0}</span>
            </div>
          </CardContent>
        </Card>

        {/* Support */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Support</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => toast.info("Opening help center...")}
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              Help & FAQ
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => toast.info("Opening contact form...")}
            >
              <Mail className="w-4 h-4 mr-2" />
              Contact Support
            </Button>
          </CardContent>
        </Card>

        {/* Logout */}
        <Button
          variant="outline"
          className="w-full text-destructive hover:text-destructive border-destructive/20 hover:bg-destructive/5"
          onClick={async () => {
            await authClient.signOut();
            toast.success("Logged out successfully");
            router.push("/auth/signin");
          }}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>

        <div className="text-center py-4">
          <p className="text-xs text-muted-foreground">
            Made with ❤️ for your notes
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
