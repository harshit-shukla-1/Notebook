"use client";

import React, { useState } from 'react';
import { Folder as FolderIcon, ChevronRight, ChevronDown, Plus, Package } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Folder, Project } from '../types/note';
import { cn } from '@/lib/utils';

interface SidebarProps {
  folders: Folder[];
  projects: Project[];
  activeProjectId: string | null;
  onSelectProject: (id: string) => void;
  onAddFolder: () => void;
  onAddProject: (folderId: string) => void;
}

const Sidebar = ({ 
  folders, 
  projects, 
  activeProjectId, 
  onSelectProject, 
  onAddFolder, 
  onAddProject 
}: SidebarProps) => {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});

  const toggleFolder = (id: string) => {
    setExpandedFolders(prev => ({ 
      ...prev, 
      [id]: !prev[id] 
    }));
  };

  return (
    <div className="w-72 h-full bg-white dark:bg-zinc-950 border-r border-indigo-50 dark:border-zinc-800 flex flex-col p-4 gap-6">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Library</h2>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 hover:bg-indigo-50 dark:hover:bg-zinc-800" 
          onClick={onAddFolder}
        >
          <Plus size={14} />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-1">
        {folders.map(folder => (
          <div key={folder.id} className="space-y-1">
            <div
              className="w-full flex items-center gap-2 p-2 hover:bg-secondary/50 rounded-xl transition-colors text-sm font-semibold group cursor-pointer"
              onClick={() => toggleFolder(folder.id)}
            >
              <div className="text-muted-foreground">
                {expandedFolders[folder.id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </div>
              <FolderIcon size={16} className="text-indigo-500" />
              <span className="flex-1 text-left truncate">{folder.name}</span>
              <button 
                className="p-1 hover:bg-indigo-100 dark:hover:bg-zinc-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity" 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onAddProject(folder.id); 
                }}
              >
                <Plus size={14} className="text-indigo-600" />
              </button>
            </div>

            {expandedFolders[folder.id] && (
              <div className="ml-4 space-y-1 border-l-2 border-indigo-50 dark:border-zinc-800 pl-2">
                {projects.filter(p => p.folderId === folder.id).map(project => (
                  <button
                    key={project.id}
                    onClick={() => onSelectProject(project.id)}
                    className={cn(
                      "w-full flex items-center gap-2 p-2 rounded-xl text-xs transition-all",
                      activeProjectId === project.id 
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" 
                        : "hover:bg-secondary/50 text-muted-foreground"
                    )}
                  >
                    <Package size={14} />
                    <span className="truncate font-medium">{project.name}</span>
                  </button>
                ))}
                {projects.filter(p => p.folderId === folder.id).length === 0 && (
                  <p className="text-[10px] text-muted-foreground/50 py-2 pl-6 italic">No projects</p>
                )}
              </div>
            )}
          </div>
        ))}
        {folders.length === 0 && (
          <div className="text-center py-8 px-4 border-2 border-dashed border-muted-foreground/10 rounded-2xl">
            <p className="text-xs text-muted-foreground">Create a folder to start organizing</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;