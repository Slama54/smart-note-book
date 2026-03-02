'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
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
} from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/use-auth';

export default function ProfilePage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { user, logout, loading: authLoading } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [backupEnabled, setBackupEnabled] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    toast.success(
      `Switched to ${theme === 'dark' ? 'light' : 'dark'} mode`
    );
  };

  const handleBackup = () => {
    toast.success('Backup started. Check again in a moment.');
    setBackupEnabled(true);
  };

  const handleExportData = () => {
    const mockData = {
      notebooks: [],
      pages: [],
      exportedAt: new Date().toISOString(),
    };
    const element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:application/json;charset=utf-8,' +
        encodeURIComponent(JSON.stringify(mockData, null, 2))
    );
    element.setAttribute('download', 'smartnotes-backup.json');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success('Data exported successfully');
  };

  return (
    <MainLayout>
      <Header title="Settings" subtitle="Profile & Preferences" />

      <div className="px-4 py-6 space-y-4">
        {/* Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">Smart Notebook User</p>
                <p className="text-sm text-muted-foreground">Premium Edition</p>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Edit Profile
            </Button>
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
                {theme === 'dark' ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
                <div>
                  <p className="font-medium text-sm">Dark Mode</p>
                  <p className="text-xs text-muted-foreground">
                    {theme === 'dark' ? 'Enabled' : 'Disabled'}
                  </p>
                </div>
              </div>
              <Switch checked={theme === 'dark'} onCheckedChange={handleThemeToggle} />
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
                    {notifications ? 'Enabled' : 'Disabled'}
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
              <span className="text-muted-foreground">Pages Scanned</span>
              <span className="font-medium">127</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Storage Used</span>
              <span className="font-medium">245 MB</span>
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
              onClick={() => toast.info('Opening help center...')}
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              Help & FAQ
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => toast.info('Opening contact form...')}
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
            setIsLoggingOut(true);
            try {
              await logout();
              toast.success('Logged out successfully');
            } catch (error) {
              toast.error('Failed to logout');
            } finally {
              setIsLoggingOut(false);
            }
          }}
          disabled={isLoggingOut}
        >
          <LogOut className="w-4 h-4 mr-2" />
          {isLoggingOut ? 'Logging out...' : 'Logout'}
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
