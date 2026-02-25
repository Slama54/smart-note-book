'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useApp } from '@/lib/AppContext';

interface CreateNotebookModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const colors = [
  { label: 'Forest Green', value: '#2E7D32' },
  { label: 'Blue', value: '#4A90E2' },
  { label: 'Purple', value: '#9C27B0' },
  { label: 'Red', value: '#D32F2F' },
  { label: 'Orange', value: '#F57C00' },
  { label: 'Teal', value: '#00897B' },
];

const patterns = [
  { label: 'Grid', value: 'grid' as const },
  { label: 'Lines', value: 'lines' as const },
  { label: 'Dots', value: 'dots' as const },
  { label: 'Plain', value: 'plain' as const },
];

export function CreateNotebookModal({ open, onOpenChange }: CreateNotebookModalProps) {
  const { addNotebook } = useApp();
  const [name, setName] = useState('');
  const [color, setColor] = useState('#4A90E2');
  const [pattern, setPattern] = useState<'grid' | 'lines' | 'dots' | 'plain'>('plain');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addNotebook({
      name: name.trim(),
      coverColor: color,
      coverPattern: pattern,
      pageCount: 0,
      chapterIds: [],
      lastEdited: new Date().toISOString().split('T')[0],
      isArchived: false,
    });

    setName('');
    setColor('#4A90E2');
    setPattern('plain');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Create Notebook</DialogTitle>
          <DialogDescription>Add a new notebook to your collection</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Notebook Name</Label>
            <Input
              id="name"
              placeholder="e.g., Math Notes"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Cover Color</Label>
            <Select value={color} onValueChange={setColor}>
              <SelectTrigger id="color">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {colors.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: c.value }}
                      />
                      {c.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pattern">Pattern</Label>
            <Select value={pattern} onValueChange={(v) => setPattern(v as any)}>
              <SelectTrigger id="pattern">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {patterns.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
