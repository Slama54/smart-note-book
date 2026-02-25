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
import { useApp } from '@/lib/AppContext';

interface CreateChapterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notebookId: string;
}

export function CreateChapterModal({
  open,
  onOpenChange,
  notebookId,
}: CreateChapterModalProps) {
  const { addChapter } = useApp();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addChapter({
      name: name.trim(),
      notebookId,
      pageIds: [],
      description: description.trim() || undefined,
      color: '#' + Math.floor(Math.random() * 16777215).toString(16),
    });

    setName('');
    setDescription('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Create Chapter</DialogTitle>
          <DialogDescription>Add a new chapter to organize your pages</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Chapter Name</Label>
            <Input
              id="name"
              placeholder="e.g., Chapter 1"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Input
              id="description"
              placeholder="Add notes about this chapter"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
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
