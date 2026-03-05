import React, { useState } from 'react';
import { useStorage } from '../hooks/useStorage';
import NoteCard from '../components/NoteCard';
import CreateNoteDialog from '../components/CreateNoteDialog';
import Sidebar from '../components/Sidebar';
import AddHierarchyDialog from '../components/AddHierarchyDialog';
import { Input } from "@/components/ui/input";
import { Search, Sparkles, BookOpen, Inbox } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';

const Index = () => {
  const { folders, projects, notes, addFolder, addProject, addNote, deleteNote } = useStorage();
  const [search, setSearch] = useState('');
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  
  // Dialog states
  const [folderDialogOpen, setFolderDialogOpen] = useState(false);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [targetFolderId, setTargetFolderId] = useState<string | null>(null);

  const activeProject = projects.find(p => p.id === activeProjectId);
  const filteredNotes = notes.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(search.toLowerCase()) || 
                         n.content.toLowerCase().includes(search.toLowerCase());
    const matchesProject = activeProjectId ? n.projectId === activeProjectId : !n.projectId;
    return matchesSearch && matchesProject;
  });

  const handleAddProjectInit = (folderId: string) => {
    setTargetFolderId(folderId);
    setProjectDialogOpen(true);
  };

  return (
    <div className="flex h-screen bg-[#F8F9FE] dark:bg-zinc-950 overflow-hidden">
      <Sidebar 
        folders={folders}
        projects={projects}
        activeProjectId={activeProjectId}
        onSelectProject={setActiveProjectId}
        onAddFolder={() => setFolderDialogOpen(true)}
        onAddProject={handleAddProjectInit}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-indigo-50 dark:border-zinc-800 px-8 py-6">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                {activeProjectId ? <BookOpen className="text-white" size={20} /> : <Inbox className="text-white" size={20} />}
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-indigo-950 dark:text-white leading-none">
                  {activeProjectId ? activeProject?.name : "Inbox / Quick Notes"}
                </h1>
                <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-500/60 mt-1">
                  Harshit's Notebook
                </p>
              </div>
            </div>
            
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                placeholder="Search notes..."
                className="pl-10 h-10 bg-secondary/30 border-none rounded-xl text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-8 py-8">
          <div className="max-w-5xl mx-auto">
            {filteredNotes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-24 h-24 bg-indigo-50 dark:bg-zinc-900 rounded-[40px] flex items-center justify-center mb-6">
                  {activeProjectId ? <Sparkles className="text-indigo-200 dark:text-zinc-700" size={40} /> : <Inbox className="text-indigo-200 dark:text-zinc-700" size={40} />}
                </div>
                <h3 className="text-xl font-bold mb-2">
                  No notes found
                </h3>
                <p className="text-muted-foreground max-w-[250px]">
                  {activeProjectId ? 'Add your first project-specific entry here.' : 'Capture a quick thought or an uncategorized note.'}
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
          </div>
        </main>
      </div>

      <CreateNoteDialog 
        onAddNote={(note) => addNote({ ...note, projectId: activeProjectId || undefined })} 
      />

      <AddHierarchyDialog 
        open={folderDialogOpen}
        onOpenChange={setFolderDialogOpen}
        type="folder"
        onSubmit={addFolder}
      />

      <AddHierarchyDialog 
        open={projectDialogOpen}
        onOpenChange={setProjectDialogOpen}
        type="project"
        onSubmit={(name) => targetFolderId && addProject(targetFolderId, name)}
      />
    </div>
  );
};

export default Index;