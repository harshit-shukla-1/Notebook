"use client";

import React, { useState } from 'react';
import { Folder as FolderIcon, ChevronRight, ChevronDown, Plus, Package, Inbox } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Folder, Project } from '../types/note';
import { cn } from '@/lib/utils';

interface SidebarProps {
  folders: Folder[];
  projects: Project[];
  activeProjectId: string | null;
  onSelectProject: (id: string | null) => void;
  onAddFolder: () => void;
  onAddProject: (folderId: string) => void;
  className?: string;
}

const Sidebar = ({ 
  folders, 
  projects, 
  activeProjectId, 
  onSelectProject, 
  onAddFolder, 
  onAddProject,
  className
}: SidebarProps) => {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});

  const toggleFolder = (id: string) => {
    setExpandedFolders(prev => ({ 
      ...prev, 
      [id]: !prev[id] 
    }));
  };

  return (
    <div className={cn("w-full h-full bg-white dark:bg-zinc-950 flex flex-col p-4 gap-6", className)}>
      <div className="flex items-center justify-between px-2">
        <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Library</h2>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 hover:bg-indigo-50 dark:hover:bg-zinc-800 rounded-xl" 
          onClick={onAddFolder}
        >
          <Plus size={16} />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        <button
          onClick={() => onSelectProject(null)}
          className={cn(
            "w-full flex items-center gap-3 p-3 rounded-2xl text-sm transition-all",
            activeProjectId === null 
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" 
              : "hover:bg-secondary/50 text-muted-foreground font-semibold"
          )}
        >
          <Inbox size={18} className={activeProjectId === null ? "text-white" : "text-indigo-500"} />
          <span className="flex-1 text-left">Inbox / Quick Notes</span>
        </button>

        <div className="space-y-2">
          {folders.map(folder => (
            <div key={folder.id} className="space-y-1">
              <div
                className="w-full flex items-center gap-2 p-2.5 hover:bg-secondary/50 rounded-2xl transition-colors text-sm font-semibold group cursor-pointer"
                onClick={() => toggleFolder(folder.id)}
              >
                <div className="text-muted-foreground">
                  {expandedFolders[folder.id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </div>
                <FolderIcon size={18} className="text-indigo-500" />
                <span className="flex-1 text-left truncate">{folder.name}</span>
                <button 
                  className="p-1.5 hover:bg-indigo-100 dark:hover:bg-zinc-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    onAddProject(folder.id); 
                  }}
                >
                  <Plus size={14} className="text-indigo-600" />
                </button>
              </div>

              {expandedFolders[folder.id] && (
                <div className="ml-5 space-y-1 border-l-2 border-indigo-50 dark:border-zinc-800 pl-3">
                  {projects.filter(p => p.folderId === folder.id).map(project => (
                    <button
                      key={project.id}
                      onClick={() => onSelectProject(project.id)}
                      className={cn(
                        "w-full flex items-center gap-3 p-2.5 rounded-xl text-xs transition-all",
                        activeProjectId === project.id 
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" 
                          : "hover:bg-secondary/50 text-muted-foreground"
                      )}
                    >
                      <Package size={16} />
                      <span className="truncate font-medium">{project.name}</span>
                    </button>
                  ))}
                  {projects.filter(p => p.folderId === folder.id).length === 0 && (
                    <p className="text-[10px] text-muted-foreground/50 py-2 pl-7 italic">No projects yet</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {folders.length === 0 && (
          <div className="text-center py-10 px-6 border-2 border-dashed border-muted-foreground/10 rounded-[32px]">
            <p className="text-xs text-muted-foreground leading-relaxed">Create your first folder to start organizing your work.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;