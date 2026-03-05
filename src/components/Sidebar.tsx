"use client";

import React from 'react';
import { LogOut, Shield, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from './AuthProvider';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const { isAdmin, signOut, profile } = useAuth();
  const navigate = useNavigate();

  return (
    <div className={cn("w-full h-full bg-white dark:bg-zinc-950 flex flex-col p-4", className)}>
      <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
         <div className="w-20 h-20 bg-indigo-50 dark:bg-zinc-900 rounded-[32px] flex items-center justify-center mb-4">
            <User className="text-indigo-200 dark:text-zinc-700" size={40} />
         </div>
         <h2 className="text-lg font-black text-indigo-950 dark:text-white">Notebook</h2>
         <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-500/60 mt-1">
            Personal Space
         </p>
      </div>

      <div className="pt-4 border-t border-indigo-50 dark:border-zinc-800 space-y-2">
        <div className="px-3 py-3 flex items-center gap-3 bg-secondary/30 rounded-2xl mb-2">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-sm font-black shadow-lg shadow-indigo-100">
            {profile?.username?.[0] || 'U'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-black truncate text-indigo-950 dark:text-white">{profile?.username || 'User'}</p>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{profile?.role}</p>
          </div>
        </div>

        {isAdmin && (
          <button
            onClick={() => navigate('/admin')}
            className="w-full flex items-center gap-3 p-3 rounded-2xl text-xs font-bold text-indigo-600 hover:bg-indigo-50 dark:hover:bg-zinc-900 transition-all"
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