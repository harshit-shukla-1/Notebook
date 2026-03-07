"use client";

import React, { useState } from 'react';
import { 
  Plus, ChevronDown, ChevronRight, Folder as FolderIcon, 
  Hash, Trash2, Edit2, MoreVertical, Inbox
} from "lucide-react";
import { Folder, Project } from '../types/note';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import { useAuth } from './AuthProvider';
import Logo from './Logo';
import { LogOut, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  folders: Folder[];
  projects: Project[];
  activeProjectId: string | null;
  onSelectProject: (id: string | null) => void;
  onAddFolder: () => void;
  onEditFolder: (folder: Folder) => void;
  onDeleteFolder: (id: string) => void;
  onAddProject: (folderId: string) => void;
  onEditProject: (project: Project) => void;
  onDeleteProject: (id: string) => void;
  className?: string;
}

const Sidebar = ({ 
  folders, projects, activeProjectId, onSelectProject, 
  onAddFolder, onEditFolder, onDeleteFolder,
  onAddProject, onEditProject, onDeleteProject,
  className 
}: SidebarProps) => {
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);
  const { isAdmin, signOut, profile, user } = useAuth();
  const navigate = useNavigate();

  const toggleFolder = (id: string) => {
    setExpandedFolders(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const displayName = profile?.username || user?.user_metadata?.username || user?.email?.split('@')[0] || 'User';
  const displayRole = profile?.role || user?.user_metadata?.role || 'User';

  return (
    <div className={cn("w-full h-full bg-white dark:bg-zinc-950 flex flex-col p-4 sm:p-6", className)}>
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-12 h-12 bg-indigo-950 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-amber-200/20 border border-amber-500/20">
          <Logo size={32} />
        </div>
        <div>
          <h2 className="text-lg font-black text-indigo-950 dark:text-white leading-none">Notebook</h2>
          <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600 mt-1">
            Kingdom of Lanka
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 scrollbar-hide">
        <div className="space-y-1">
          <button
            onClick={() => onSelectProject(null)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all",
              !activeProjectId 
                ? "bg-indigo-950 text-white shadow-lg shadow-amber-200/20" 
                : "text-muted-foreground hover:bg-secondary/50"
            )}
          >
            <Inbox size={18} />
            Uncategorized
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between px-2 mb-2">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Archives</h3>
            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-lg hover:text-amber-600" onClick={onAddFolder}>
              <Plus size={14} />
            </Button>
          </div>

          <div className="space-y-1">
            {folders.map(folder => (
              <div key={folder.id} className="space-y-1">
                <div className="group flex items-center gap-2 px-2 py-2 rounded-xl hover:bg-secondary/30 transition-colors">
                  <button onClick={() => toggleFolder(folder.id)} className="text-muted-foreground/60 hover:text-amber-600">
                    {expandedFolders.includes(folder.id) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>
                  <FolderIcon size={16} className="text-amber-500" />
                  <span className="flex-1 text-sm font-bold text-indigo-950/80 dark:text-zinc-300 truncate">{folder.name}</span>
                  
                  <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-6 w-6 rounded-md hover:text-amber-600" onClick={() => onAddProject(folder.id)}>
                      <Plus size={12} />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-md">
                          <MoreVertical size={12} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl">
                        <DropdownMenuItem className="font-bold text-xs" onClick={() => onEditFolder(folder)}>
                          <Edit2 className="mr-2 h-3 w-3" /> Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem className="font-bold text-xs text-destructive" onClick={() => onDeleteFolder(folder.id)}>
                          <Trash2 className="mr-2 h-3 w-3" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {expandedFolders.includes(folder.id) && (
                  <div className="ml-6 space-y-1 border-l-2 border-amber-500/10 dark:border-zinc-800 pl-2">
                    {projects.filter(p => p.folder_id === folder.id).map(project => (
                      <div key={project.id} className="group flex items-center gap-2">
                        <button
                          onClick={() => onSelectProject(project.id)}
                          className={cn(
                            "flex-1 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all",
                            activeProjectId === project.id 
                              ? "bg-amber-50 text-amber-700 dark:bg-zinc-900 dark:text-amber-400" 
                              : "text-muted-foreground/70 hover:bg-secondary/30"
                          )}
                        >
                          <Hash size={12} className={activeProjectId === project.id ? "text-amber-500" : "text-muted-foreground/40"} />
                          <span className="truncate">{project.name}</span>
                        </button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-md opacity-0 group-hover:opacity-100">
                              <MoreVertical size={12} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-xl">
                            <DropdownMenuItem className="font-bold text-xs" onClick={() => onEditProject(project)}>
                              <Edit2 className="mr-2 h-3 w-3" /> Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem className="font-bold text-xs text-destructive" onClick={() => onDeleteProject(project.id)}>
                              <Trash2 className="mr-2 h-3 w-3" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ))}
                    {projects.filter(p => p.folder_id === folder.id).length === 0 && (
                      <p className="text-[10px] text-muted-foreground/40 italic px-3 py-1">No collections</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-indigo-50 dark:border-zinc-800 space-y-2">
        <div className="px-3 py-3 flex items-center gap-3 bg-secondary/30 rounded-2xl mb-2">
          <div className="w-10 h-10 rounded-2xl bg-indigo-950 flex items-center justify-center text-amber-500 text-sm font-black shadow-lg shadow-amber-200/20 border border-amber-500/20">
            {displayName[0].toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-black truncate text-indigo-950 dark:text-white capitalize">{displayName}</p>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{displayRole}</p>
          </div>
        </div>

        {isAdmin && (
          <button
            onClick={() => navigate('/admin')}
            className="w-full flex items-center gap-3 p-3 rounded-2xl text-xs font-bold text-amber-600 hover:bg-amber-50 dark:hover:bg-zinc-900 transition-all"
          >
            <Shield size={16} />
            Command Center
          </button>
        )}
        
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 p-3 rounded-2xl text-xs font-bold text-destructive hover:bg-destructive/10 transition-all"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;