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
  onAddNote: (note: Partial<Note>) => void;
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
    
    const newNote: Partial<Note> = {
      type: activeTab,
      title: title || (activeTab === 'text' ? 'New Note' : `New ${activeTab} Note`),
      content: content,
      media_url: mediaUrl,
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
        <Button className="fixed bottom-6 right-6 h-14 w-14 sm:bottom-8 sm:right-8 sm:h-16 sm:w-16 rounded-full shadow-2xl bg-indigo-600 hover:bg-indigo-700 transition-all hover:scale-110 active:scale-95 z-50 p-0">
          <Plus className="w-8 h-8" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-[500px] rounded-[24px] sm:rounded-[32px] border-none p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        <DialogHeader className="p-4 sm:p-6 pb-0">
          <DialogTitle className="text-xl sm:text-2xl font-black flex items-center gap-2">
            <Sparkles className="text-indigo-500" />
            Capture Moment
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 pt-2">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as NoteType)} className="mb-4 sm:mb-6">
            <TabsList className="grid grid-cols-3 bg-secondary/50 p-1 rounded-2xl h-12">
              <TabsTrigger value="text" className="rounded-xl flex items-center justify-center gap-1 sm:gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm">
                <Type size={16} /> <span className="hidden xs:inline">Text</span>
              </TabsTrigger>
              <TabsTrigger value="image" className="rounded-xl flex items-center justify-center gap-1 sm:gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm">
                <ImageIcon size={16} /> <span className="hidden xs:inline">Image</span>
              </TabsTrigger>
              <TabsTrigger value="voice" className="rounded-xl flex items-center justify-center gap-1 sm:gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm">
                <Mic size={16} /> <span className="hidden xs:inline">Voice</span>
              </TabsTrigger>
            </TabsList>

            <div className="space-y-4 py-2 sm:py-4">
              <Input
                placeholder="Title (optional)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="rounded-xl border-none bg-secondary/30 h-11 sm:h-12 text-base sm:text-lg font-bold focus-visible:ring-indigo-500/30"
              />

              <TabsContent value="text" className="m-0">
                <Textarea
                  placeholder="What's on your mind?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[120px] sm:min-h-[150px] rounded-2xl border-none bg-secondary/30 resize-none focus-visible:ring-indigo-500/30 text-sm sm:text-base"
                />
              </TabsContent>

              <TabsContent value="image" className="m-0">
                <ImageUploader onImageSelected={setMediaUrl} />
                <Textarea
                  placeholder="Add a description..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="mt-4 min-h-[80px] sm:min-h-[100px] rounded-2xl border-none bg-secondary/30 resize-none focus-visible:ring-indigo-500/30 text-sm sm:text-base"
                />
              </TabsContent>

              <TabsContent value="voice" className="m-0">
                <VoiceRecorder onRecordingComplete={setMediaUrl} />
                <Textarea
                  placeholder="Add some notes about this audio..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="mt-4 min-h-[80px] sm:min-h-[100px] rounded-2xl border-none bg-secondary/30 resize-none focus-visible:ring-indigo-500/30 text-sm sm:text-base"
                />
              </TabsContent>
            </div>
          </Tabs>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 sm:mt-6">
            <div className="flex gap-2.5">
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
            <Button type="submit" className="w-full sm:w-auto rounded-2xl px-8 h-12 bg-indigo-600 hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-200">
              Save Note
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNoteDialog;