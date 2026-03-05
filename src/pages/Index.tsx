import React, { useState } from 'react';
import { useNotes } from '../hooks/useNotes';
import NoteCard from '../components/NoteCard';
import CreateNoteDialog from '../components/CreateNoteDialog';
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, LayoutGrid, List, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  const { notes, addNote, deleteNote } = useNotes();
  const [search, setSearch] = useState('');

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(search.toLowerCase()) || 
    n.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8F9FE] dark:bg-zinc-950 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-indigo-50 dark:border-zinc-800 px-6 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none">
                <Sparkles className="text-white" size={20} />
              </div>
              <h1 className="text-2xl font-black tracking-tight text-indigo-950 dark:text-white">Aura Notes</h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-zinc-800 flex items-center justify-center overflow-hidden border border-indigo-100 dark:border-zinc-700">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
              </div>
            </div>
          </div>

          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-indigo-500 transition-colors" size={18} />
            <Input
              placeholder="Search your thoughts..."
              className="pl-12 h-14 bg-white dark:bg-zinc-800 border-none shadow-sm rounded-2xl text-base focus-visible:ring-indigo-500/20"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-secondary rounded-xl transition-colors">
              <SlidersHorizontal size={18} className="text-muted-foreground" />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-lg text-muted-foreground">
            {search ? `Results (${filteredNotes.length})` : 'All Notes'}
          </h2>
          <div className="flex items-center gap-1 bg-secondary/50 p-1 rounded-xl">
            <button className="p-2 bg-white dark:bg-zinc-800 rounded-lg shadow-sm">
              <LayoutGrid size={16} />
            </button>
            <button className="p-2 hover:bg-white/50 dark:hover:bg-zinc-800/50 rounded-lg transition-colors">
              <List size={16} />
            </button>
          </div>
        </div>

        {filteredNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-24 h-24 bg-indigo-50 dark:bg-zinc-900 rounded-[40px] flex items-center justify-center mb-6">
              <Sparkles className="text-indigo-200 dark:text-zinc-700" size={40} />
            </div>
            <h3 className="text-xl font-bold mb-2">No notes found</h3>
            <p className="text-muted-foreground max-w-[250px]">
              Start capturing your ideas, images, and voice notes today.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredNotes.map((note) => (
                <NoteCard key={note.id} note={note} onDelete={deleteNote} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      <CreateNoteDialog onAddNote={addNote} />
      
      <div className="mt-12 opacity-50">
        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Index;