'use client';

import { useRef, useState } from 'react';
import { RotateCw, Maximize, Minimize, Crop } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

interface ImageEditorProps {
  imageSrc: string;
  onSave: (imageSrc: string) => void;
  onCancel: () => void;
}

export function ImageEditor({ imageSrc, onSave, onCancel }: ImageEditorProps) {
  const [rotation, setRotation] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleSave = () => {
    if (imgRef.current) {
      // In a real app, you'd apply the rotation and other edits
      onSave(imageSrc);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg overflow-hidden border bg-black">
        <TransformWrapper>
          <TransformComponent>
            <img
              ref={imgRef}
              src={imageSrc}
              alt="Scanned page"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: 'transform 0.2s ease-in-out',
              }}
              className="max-w-full"
            />
          </TransformComponent>
        </TransformWrapper>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleRotate}
          className="flex-1"
        >
          <RotateCw className="w-4 h-4 mr-2" />
          Rotate
        </Button>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button onClick={handleSave} className="flex-1">
          Continue
        </Button>
      </div>
    </div>
  );
}
