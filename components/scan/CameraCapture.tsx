'use client';

import { useRef, useEffect, useState } from 'react';
import { Camera, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CameraCaptureProps {
  onCapture: (imageSrc: string) => void;
  disabled?: boolean;
}

export function CameraCapture({ onCapture, disabled }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [hasCamera, setHasCamera] = useState(true);

  useEffect(() => {
    if (!isCameraActive) return;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 } },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCamera(false);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [isCameraActive]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const imageSrc = canvasRef.current.toDataURL('image/jpeg');
        onCapture(imageSrc);
        setIsCameraActive(false);
      }
    }
  };

  if (!isCameraActive) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="w-full aspect-square bg-muted rounded-lg flex items-center justify-center">
          <Camera className="w-16 h-16 text-muted-foreground" />
        </div>
        <Button
          onClick={() => setIsCameraActive(true)}
          disabled={disabled || !hasCamera}
          className="w-full"
        >
          {hasCamera ? 'Open Camera' : 'Camera Not Available'}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-black">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
      </div>
      <canvas ref={canvasRef} className="hidden" />
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => setIsCameraActive(false)}
          className="flex-1"
        >
          <RotateCw className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button onClick={handleCapture} className="flex-1">
          <Camera className="w-4 h-4 mr-2" />
          Capture
        </Button>
      </div>
    </div>
  );
}
