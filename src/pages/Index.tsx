import React, { useState } from 'react';
import { useStorage } from '../hooks/useStorage';
import NoteCard from '../components/NoteCard';
import CreateNoteDialog from '../components/CreateNoteDialog';
import NoteDetailDialog from '../components/NoteDetailDialog';
import Sidebar from '../components/Sidebar';
import AddHierarchyDialog from '../components/AddHierarchyDialog';
import { ThemeToggle } from '../components/ThemeToggle';
import Logo from '../components/Logo';
import { Input } from "@/components/ui/input";
import { Search, Menu, Loader2, ArrowLeft, Home } from "lucide-react";
import { AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Folder, Project, Note } from '../types/note';
import { showSuccess } from '@/utils/toast';

const Index = () => {
  const { 
    folders, projects, notes, loading,
    addFolder, updateFolder, deleteFolder,
    addProject, updateProject, deleteProject,
    addNote, updateNote, deleteNote 
  } = useStorage();
  
  const [search, setSearch] = useState('');
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const [folderDialog, setFolderDialog] = useState<{ open: boolean; folder?: Folder }>({ open: false });
  const [projectDialog, setProjectDialog] = useState<{ open: boolean; project?: Project; folderId?: string }>({ open: false });
  const [viewNote, setViewNote] = useState<{ open: boolean; note: Note | null }>({ open: false, note: null });

  const activeProject = projects.find(p => p.id === activeProjectId);
  const filteredNotes = notes.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(search.toLowerCase()) || 
                         n.content.toLowerCase().includes(search.toLowerCase());
    const matchesProject = activeProjectId ? n.project_id === activeProjectId : !n.project_id;
    return matchesSearch && matchesProject;
  });

  const handleSelectProject = (id: string | null) => {
    setActiveProjectId(id);
    if (isMobile) setMobileMenuOpen(false);
  };

  const onFolderSubmit = (name: string) => {
    if (folderDialog.folder) {
      updateFolder(folderDialog.folder.id, name);
      showSuccess("Folder updated");
    } else {
      addFolder(name);
      showSuccess("Folder created");
    }
  };

  const onProjectSubmit = (name: string) => {
    if (projectDialog.project) {
      updateProject(projectDialog.project.id, name);
      showSuccess("Project updated");
    } else if (projectDialog.folderId) {
      addProject(projectDialog.folderId, name);
      showSuccess("Project created");
    }
  };

  const handleNoteClick = (note: Note) => {
    setViewNote({ open: true, note });
  };

  return (
    <div className="flex h-screen bg-[#F8F9FE] dark:bg-zinc-950 overflow-hidden">
      {!isMobile && (
        <Sidebar 
          folders={folders}
          projects={projects}
          activeProjectId={activeProjectId}
          onSelectProject={handleSelectProject}
          onAddFolder={() => setFolderDialog({ open: true })}
          onEditFolder={(folder) => setFolderDialog({ open: true, folder })}
          onDeleteFolder={(id) => { deleteFolder(id); showSuccess("Folder removed"); }}
          onAddProject={(folderId) => setProjectDialog({ open: true, folderId })}
          onEditProject={(project) => setProjectDialog({ open: true, project })}
          onDeleteProject={(id) => { deleteProject(id); showSuccess("Project removed"); }}
          className="w-72 border-r border-indigo-50 dark:border-zinc-800"
        />
      )}

      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-indigo-50 dark:border-zinc-800 px-4 sm:px-8 py-4 sm:py-6">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-1 sm:gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                  onClick={() => navigate(-1)}
                  title="Go Back"
                >
                  <ArrowLeft size={18} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                  onClick={() => handleSelectProject(null)}
                  title="Home / Inbox"
                >
                  <Home size={18} />
                </Button>
              </div>

              <div className="flex items-center gap-3">
                {isMobile && (
                  <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-secondary/50">
                        <Menu size={20} />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-72 border-none">
                      <Sidebar 
                        folders={folders}
                        projects={projects}
                        activeProjectId={activeProjectId}
                        onSelectProject={handleSelectProject}
                        onAddFolder={() => setFolderDialog({ open: true })}
                        onEditFolder={(folder) => setFolderDialog({ open: true, folder })}
                        onDeleteFolder={deleteFolder}
                        onAddProject={(folderId) => setProjectDialog({ open: true, folderId })}
                        onEditProject={(project) => setProjectDialog({ open: true, project })}
                        onDeleteProject={deleteProject}
                      />
                    </SheetContent>
                  </Sheet>
                )}
                <div className="hidden xs:flex w-10 h-10 sm:w-12 sm:h-12 bg-indigo-950 rounded-2xl items-center justify-center shadow-lg shadow-amber-200/20 shrink-0 border border-amber-500/20">
                  <Logo size={28} />
                </div>
                <div className="min-w-0">
                  <h1 className="text-base sm:text-2xl font-black tracking-tight text-indigo-950 dark:text-white leading-none truncate">
                    {activeProjectId ? activeProject?.name : "Inbox"}
                  </h1>
                  <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-amber-600 mt-1 truncate">
                    Lanka Notebook
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 flex-1 max-w-[280px] justify-end">
              <div className="relative flex-1 max-w-[160px] sm:max-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                <Input
                  placeholder="Search..."
                  className="pl-9 h-9 sm:h-10 bg-secondary/30 border-none rounded-xl text-xs sm:text-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 sm:py-8">
          <div className="max-w-5xl mx-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-amber-500 animate-spin mb-4" />
                <p className="font-bold text-muted-foreground">Syncing kingdom archives...</p>
              </div>
            ) : filteredNotes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 sm:py-32 text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-amber-50 dark:bg-zinc-900 rounded-[32px] sm:rounded-[40px] flex items-center justify-center mb-6">
                  <Logo size={48} />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">No entries in the kingdom</h3>
                <p className="text-sm text-muted-foreground max-w-[280px]">
                  {activeProjectId ? 'Start your first project-specific entry here.' : 'Capture a quick thought or an uncategorized note.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredNotes.map((note) => (
                    <NoteCard 
                      key={note.id} 
                      note={note} 
                      onDelete={deleteNote} 
                      onClick={handleNoteClick}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </main>
      </div>

      <CreateNoteDialog 
        onAddNote={(note) => addNote({ ...note, project_id: activeProjectId || undefined })} 
      />

      <NoteDetailDialog 
        note={viewNote.note}
        open={viewNote.open}
        onOpenChange={(open) => setViewNote({ ...viewNote, open })}
        onUpdateNote={updateNote}
      />

      <AddHierarchyDialog 
        open={folderDialog.open}
        onOpenChange={(open) => setFolderDialog({ ...folderDialog, open })}
        type="folder"
        onSubmit={onFolderSubmit}
        initialValue={folderDialog.folder?.name}
        isEditing={!!folderDialog.folder}
      />

      <AddHierarchyDialog 
        open={projectDialog.open}
        onOpenChange={(open) => setProjectDialog({ ...projectDialog, open })}
        type="project"
        onSubmit={onProjectSubmit}
        initialValue={projectDialog.project?.name}
        isEditing={!!projectDialog.project}
      />
    </div>
  );
};

export default Index;