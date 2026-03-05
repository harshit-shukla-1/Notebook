import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Mic, Image as ImageIcon, Type, Sparkles } from "lucide-react";
import VoiceRecorder from './VoiceRecorder';
import ImageUploader from './ImageUploader';
import { Note, NoteType } from '../types/note';
import { showSuccess } from '@/utils/toast';

interface CreateNoteDialogProps {
  onAddNote: (note: Note) => void;
}

const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];

const CreateNoteDialog = ({ onAddNote }: CreateNoteDialogProps) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<NoteType>('text');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mediaUrl, setMediaUrl] = useState<string | undefined>(undefined);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newNote: Note = {
      id: crypto.randomUUID(),
      type: activeTab,
      title: title || (activeTab === 'text' ? 'New Note' : `New ${activeTab} Note`),
      content: content,
      mediaUrl: mediaUrl,
      createdAt: Date.now(),
      color: selectedColor
    };

    onAddNote(newNote);
    showSuccess("Note captured!");
    resetForm();
    setOpen(false);
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setMediaUrl(undefined);
    setActiveTab('text');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="fixed bottom-8 right-8 h-16 w-16 rounded-full shadow-2xl bg-indigo-600 hover:bg-indigo-700 transition-all hover:scale-110 active:scale-95 z-50 p-0">
          <Plus size={32} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] rounded-[32px] border-none p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-black flex items-center gap-2">
            <Sparkles className="text-indigo-500" />
            Capture Moment
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 pt-2">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as NoteType)} className="mb-6">
            <TabsList className="grid grid-cols-3 bg-secondary/50 p-1 rounded-2xl h-12">
              <TabsTrigger value="text" className="rounded-xl flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Type size={16} /> Text
              </TabsTrigger>
              <TabsTrigger value="image" className="rounded-xl flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <ImageIcon size={16} /> Image
              </TabsTrigger>
              <TabsTrigger value="voice" className="rounded-xl flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Mic size={16} /> Voice
              </TabsTrigger>
            </TabsList>

            <div className="space-y-4 py-4">
              <Input
                placeholder="Title (optional)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="rounded-xl border-none bg-secondary/30 h-12 text-lg font-bold focus-visible:ring-indigo-500/30"
              />

              <TabsContent value="text" className="m-0">
                <Textarea
                  placeholder="What's on your mind?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[150px] rounded-2xl border-none bg-secondary/30 resize-none focus-visible:ring-indigo-500/30 text-base"
                />
              </TabsContent>

              <TabsContent value="image" className="m-0">
                <ImageUploader onImageSelected={setMediaUrl} />
                <Textarea
                  placeholder="Add a description..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="mt-4 min-h-[100px] rounded-2xl border-none bg-secondary/30 resize-none focus-visible:ring-indigo-500/30"
                />
              </TabsContent>

              <TabsContent value="voice" className="m-0">
                <VoiceRecorder onRecordingComplete={setMediaUrl} />
                <Textarea
                  placeholder="Add some notes about this audio..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="mt-4 min-h-[100px] rounded-2xl border-none bg-secondary/30 resize-none focus-visible:ring-indigo-500/30"
                />
              </TabsContent>
            </div>
          </Tabs>

          <div className="flex items-center justify-between mt-6">
            <div className="flex gap-2">
              {COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  className={`w-6 h-6 rounded-full transition-all ${selectedColor === color ? 'scale-125 ring-2 ring-offset-2 ring-indigo-500' : 'hover:scale-110'}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
            <Button type="submit" className="rounded-2xl px-8 h-12 bg-indigo-600 hover:bg-indigo-700 font-bold">
              Save Note
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNoteDialog;