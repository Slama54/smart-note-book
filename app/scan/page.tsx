'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Flashlight, Image, X } from 'lucide-react';
import { toast } from 'sonner';

export default function ScanPage() {
  const router = useRouter();
  const [isFlash, setIsFlash] = useState(false);
  const [pageNumber, setPageNumber] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSimulatedCapture = () => {
    if (!pageNumber.trim()) {
      toast.error('Please enter a page number');
      return;
    }

    const success = Math.random() > 0.3;
    if (success) {
      toast.success('Page captured successfully!');
      router.push(`/page/edit/new?pageNum=${pageNumber}`);
    } else {
      toast.error('Failed to capture page. Please try again.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast.success('Image uploaded');
      router.push('/page/edit/new');
    }
  };

  return (
    <MainLayout>
      <Header title="Scan Page" />

      <div className="p-4 space-y-6 pb-32">
        {/* Camera Simulator */}
        <div className="space-y-4">
          <div className="relative rounded-lg overflow-hidden bg-muted aspect-video flex items-center justify-center border-2 border-dashed border-muted-foreground/30">
            <div className="text-center">
              <Flashlight className="w-12 h-12 text-muted-foreground/50 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Camera Preview</p>
            </div>

            {/* QR Code Frame Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-48 border-2 border-primary/50 rounded-lg" />
            </div>

            {/* Flash Indicator */}
            {isFlash && (
              <div className="absolute inset-0 bg-yellow-300/30 animate-pulse" />
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant={isFlash ? 'default' : 'outline'}
              size="sm"
              className="flex-1"
              onClick={() => setIsFlash(!isFlash)}
            >
              Flash {isFlash ? 'On' : 'Off'}
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => fileInputRef.current?.click()}
            >
              <Image className="w-4 h-4 mr-2" />
              Gallery
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Manual Input */}
        <div className="space-y-3 border-t border-border pt-6">
          <h3 className="font-semibold">Manual Page Number</h3>
          <div className="space-y-2">
            <Label htmlFor="page-num">Enter page number</Label>
            <Input
              id="page-num"
              type="number"
              placeholder="e.g., 1, 42, 100"
              value={pageNumber}
              onChange={(e) => setPageNumber(e.target.value)}
              inputMode="numeric"
            />
          </div>

          <Button onClick={handleSimulatedCapture} className="w-full">
            Create Page
          </Button>
        </div>

        {/* Info */}
        <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            This is a simulated camera for demonstration. In a real app, this would access your device camera and scan QR codes on physical notebook pages.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
