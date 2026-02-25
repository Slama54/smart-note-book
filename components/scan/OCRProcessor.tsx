'use client';

import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface OCRProcessorProps {
  imageSrc: string;
  onTextExtracted: (text: string) => void;
  onCancel: () => void;
}

export function OCRProcessor({ imageSrc, onTextExtracted, onCancel }: OCRProcessorProps) {
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [extractedText, setExtractedText] = useState('');

  useEffect(() => {
    // Simulate OCR processing - in a real app, you'd use Tesseract.js or similar
    const processImage = async () => {
      try {
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Mock extracted text - replace with actual OCR
        const mockText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

- Key Point 1: First important note
- Key Point 2: Second important observation  
- Key Point 3: Third critical detail

This is a sample extracted text from the scanned page.`;
        
        setExtractedText(mockText);
        setStatus('success');
      } catch (error) {
        console.error('OCR error:', error);
        setStatus('error');
      }
    };

    processImage();
  }, [imageSrc]);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4">
          {status === 'processing' && (
            <div className="flex flex-col items-center gap-2 py-8">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Processing image...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-sm font-medium">Text extracted successfully</span>
              </div>
              <div className="bg-muted p-3 rounded-lg max-h-48 overflow-y-auto">
                <p className="text-sm text-foreground whitespace-pre-line">{extractedText}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={onCancel} className="flex-1">
                  Retake
                </Button>
                <Button
                  onClick={() => onTextExtracted(extractedText)}
                  className="flex-1"
                >
                  Use Text
                </Button>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center gap-2 py-8">
              <AlertCircle className="w-8 h-8 text-destructive" />
              <p className="text-sm text-muted-foreground">Failed to process image</p>
              <Button variant="outline" onClick={onCancel} className="w-full mt-2">
                Try Again
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
