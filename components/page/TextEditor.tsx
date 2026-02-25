'use client';

import { useState, useRef } from 'react';
import { Bold, Italic, List, ListOrdered, Heading2, Undo2, Redo2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface TextEditorProps {
  initialText: string;
  onSave: (text: string) => void;
}

export function TextEditor({ initialText, onSave }: TextEditorProps) {
  const [text, setText] = useState(initialText);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [history, setHistory] = useState<string[]>([initialText]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    
    // Update history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newText);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setText(history[newIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setText(history[newIndex]);
    }
  };

  const insertFormatting = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = text.substring(start, end);
    const newText =
      text.substring(0, start) +
      before +
      selectedText +
      after +
      text.substring(end);

    setText(newText);
    setHistory([...history.slice(0, historyIndex + 1), newText]);
    setHistoryIndex(history.length);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 flex-wrap p-2 bg-muted rounded-lg">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertFormatting('**', '**')}
          title="Bold"
          disabled={text.length === 0}
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertFormatting('*', '*')}
          title="Italic"
          disabled={text.length === 0}
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertFormatting('# ', '')}
          title="Heading"
          disabled={text.length === 0}
        >
          <Heading2 className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertFormatting('- ', '')}
          title="Bullet list"
          disabled={text.length === 0}
        >
          <List className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => insertFormatting('1. ', '')}
          title="Numbered list"
          disabled={text.length === 0}
        >
          <ListOrdered className="w-4 h-4" />
        </Button>
        <div className="flex-1" />
        <Button
          variant="ghost"
          size="sm"
          onClick={handleUndo}
          disabled={historyIndex === 0}
        >
          <Undo2 className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRedo}
          disabled={historyIndex === history.length - 1}
        >
          <Redo2 className="w-4 h-4" />
        </Button>
      </div>

      <Textarea
        ref={textareaRef}
        value={text}
        onChange={handleTextChange}
        placeholder="Edit your page content..."
        className="min-h-64 font-mono text-sm"
      />

      <Button onClick={() => onSave(text)} className="w-full">
        <Save className="w-4 h-4 mr-2" />
        Save Changes
      </Button>
    </div>
  );
}
