"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Note } from '../types/note';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Image as ImageIcon, FileText, Calendar, X, Clock, Edit2, Check, Palette } from "lucide-react";
import { format } from 'date-fns';
import { showSuccess } from '@/utils/toast';

interface NoteDetailDialogProps {
  note: Note | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateNote: (note: Note) => void;
}

const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];

const NoteDetailDialog = ({ note, open, onOpenChange, onUpdateNote }: NoteDetailDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState('');

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setColor(note.color);
      setIsEditing(false);
    }
  }, [note, open]);

  if (!note) return null;

  const handleSave = () => {
    onUpdateNote({
      ...note,
      title,
      content,
      color
    });
    setIsEditing(false);
    showSuccess("Note updated in archives");
  };

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
          className="h-3 w-full transition-colors duration-300" 
          style={{ backgroundColor: color || note.color || '#6366f1' }}
        />
        
        <div className="p-6 sm:p-8 max-h-[85vh] overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-2 flex-1 mr-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-secondary/50 rounded-full w-fit">
                {getTypeIcon()}
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  {note.type} Note
                </span>
              </div>
              
              {isEditing ? (
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-2xl sm:text-3xl font-black text-indigo-950 dark:text-white leading-tight border-none bg-secondary/30 rounded-xl h-auto py-2 focus-visible:ring-indigo-500/20"
                  placeholder="Note Title"
                />
              ) : (
                <h2 className="text-2xl sm:text-3xl font-black text-indigo-950 dark:text-white leading-tight">
                  {note.title || 'Untitled Entry'}
                </h2>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className={`h-10 w-10 rounded-xl transition-all ${isEditing ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-secondary/50 hover:bg-secondary'}`}
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              >
                {isEditing ? <Check size={20} /> : <Edit2 size={18} />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-xl bg-secondary/50 hover:bg-secondary"
                onClick={() => onOpenChange(false)}
              >
                <X size={20} />
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            {isEditing && (
              <div className="flex flex-col gap-3 p-4 bg-secondary/20 rounded-2xl border border-indigo-50 dark:border-zinc-800">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  <Palette size={12} /> Theme Color
                </div>
                <div className="flex gap-3">
                  {COLORS.map(c => (
                    <button
                      key={c}
                      type="button"
                      className={`w-7 h-7 rounded-full transition-all ${color === c ? 'scale-125 ring-2 ring-offset-2 ring-indigo-500' : 'hover:scale-110'}`}
                      style={{ backgroundColor: c }}
                      onClick={() => setColor(c)}
                    />
                  ))}
                </div>
              </div>
            )}

            {note.type === 'image' && note.media_url && (
              <div className="rounded-3xl overflow-hidden shadow-lg border border-indigo-50 dark:border-zinc-800">
                <img 
                  src={note.media_url} 
                  alt={note.title} 
                  className="w-full h-auto object-cover max-h-[400px]" 
                />
              </div>
            )}

            {note.type === 'voice' && note.media_url && (
              <div className="p-4 bg-indigo-50/50 dark:bg-zinc-800/50 rounded-2xl border border-indigo-100 dark:border-zinc-700">
                <audio src={note.media_url} controls className="w-full" />
              </div>
            )}

            <div className="prose prose-indigo dark:prose-invert max-w-none">
              {isEditing ? (
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[200px] text-base sm:text-lg text-indigo-950/80 dark:text-zinc-300 leading-relaxed border-none bg-secondary/30 rounded-2xl p-4 focus-visible:ring-indigo-500/20 resize-none"
                  placeholder="What's on your mind?"
                />
              ) : (
                <p className="text-base sm:text-lg text-indigo-950/80 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap font-medium">
                  {note.content || "No description provided."}
                </p>
              )}
            </div>

            <div className="pt-8 border-t border-dashed border-indigo-100 dark:border-zinc-800 flex flex-wrap gap-4 items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                  <Calendar size={14} className="text-amber-500" />
                  {format(new Date(note.created_at), 'MMMM do, yyyy')}
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                  <Clock size={14} className="text-amber-500" />
                  {format(new Date(note.created_at), 'h:mm a')}
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