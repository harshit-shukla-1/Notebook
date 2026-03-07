import React from 'react';
import { Note } from '../types/note';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Mic, Image as ImageIcon, FileText } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
  onClick: (note: Note) => void;
}

const NoteCard = ({ note, onDelete, onClick }: NoteCardProps) => {
  const getTypeIcon = () => {
    switch (note.type) {
      case 'voice': return <Mic size={14} />;
      case 'image': return <ImageIcon size={14} />;
      default: return <FileText size={14} />;
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={() => onClick(note)}
      className="cursor-pointer"
    >
      <Card className="overflow-hidden border-none shadow-md bg-white dark:bg-zinc-900 rounded-3xl group h-full flex flex-col">
        <div 
          className="h-2 w-full shrink-0" 
          style={{ backgroundColor: note.color || '#6366f1' }}
        />
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2 px-2 py-1 bg-secondary rounded-full text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {getTypeIcon()}
              {note.type}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(note.id);
              }}
            >
              <Trash2 size={14} />
            </Button>
          </div>

          {note.type === 'image' && note.mediaUrl && (
            <div className="mb-4 rounded-2xl overflow-hidden aspect-video shrink-0">
              <img src={note.mediaUrl} alt={note.title} className="w-full h-full object-cover" />
            </div>
          )}

          {note.type === 'voice' && note.mediaUrl && (
            <div className="mb-4 p-3 bg-secondary/30 rounded-2xl shrink-0">
              <audio 
                src={note.mediaUrl} 
                className="w-full h-8" 
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}

          <h3 className="font-bold text-lg mb-2 line-clamp-1">{note.title || 'Untitled Note'}</h3>
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed flex-1">
            {note.content}
          </p>
          
          <div className="text-[10px] text-muted-foreground/60 font-medium mt-auto">
            {formatDistanceToNow(note.createdAt)} ago
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default NoteCard;