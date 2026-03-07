"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Note } from '../types/note';
import { Button } from "@/components/ui/button";
import { Mic, Image as ImageIcon, FileText, Calendar, X, Clock } from "lucide-react";
import { format } from 'date-fns';

interface NoteDetailDialogProps {
  note: Note | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NoteDetailDialog = ({ note, open, onOpenChange }: NoteDetailDialogProps) => {
  if (!note) return null;

  const getTypeIcon = () => {
    switch (note.type) {
      case 'voice': return <Mic size={18} className="text-amber-500" />;
      case 'image': return <ImageIcon size={18} className="text-amber-500" />;
      default: return <FileText size={18} className="text-amber-500" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[600px] rounded-[32px] border-none p-0 overflow-hidden bg-white dark:bg-zinc-900 shadow-2xl">
        <div 
          className="h-3 w-full" 
          style={{ backgroundColor: note.color || '#6366f1' }}
        />
        
        <div className="p-6 sm:p-8 max-h-[85vh] overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-3 py-1 bg-secondary/50 rounded-full w-fit">
                {getTypeIcon()}
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  {note.type} Note
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-indigo-950 dark:text-white leading-tight">
                {note.title || 'Untitled Entry'}
              </h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl bg-secondary/50 hover:bg-secondary shrink-0"
              onClick={() => onOpenChange(false)}
            >
              <X size={20} />
            </Button>
          </div>

          <div className="space-y-6">
            {note.type === 'image' && note.mediaUrl && (
              <div className="rounded-3xl overflow-hidden shadow-lg border border-indigo-50 dark:border-zinc-800">
                <img 
                  src={note.mediaUrl} 
                  alt={note.title} 
                  className="w-full h-auto object-cover max-h-[400px]" 
                />
              </div>
            )}

            {note.type === 'voice' && note.mediaUrl && (
              <div className="p-4 bg-indigo-50/50 dark:bg-zinc-800/50 rounded-2xl border border-indigo-100 dark:border-zinc-700">
                <audio src={note.mediaUrl} controls className="w-full" />
              </div>
            )}

            <div className="prose prose-indigo dark:prose-invert max-w-none">
              <p className="text-base sm:text-lg text-indigo-950/80 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap font-medium">
                {note.content || "No description provided."}
              </p>
            </div>

            <div className="pt-8 border-t border-dashed border-indigo-100 dark:border-zinc-800 flex flex-wrap gap-4 items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                  <Calendar size={14} className="text-amber-500" />
                  {format(note.createdAt, 'MMMM do, yyyy')}
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                  <Clock size={14} className="text-amber-500" />
                  {format(note.createdAt, 'h:mm a')}
                </div>
              </div>
              <div className="text-[10px] font-black uppercase tracking-widest text-indigo-950/20 dark:text-white/10">
                Captured in Lanka
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NoteDetailDialog;