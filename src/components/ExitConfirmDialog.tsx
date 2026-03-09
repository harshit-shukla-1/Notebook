"use client";

import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LogOut, AlertTriangle } from "lucide-react";

interface ExitConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

const ExitConfirmDialog = ({ open, onOpenChange, onConfirm }: ExitConfirmDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-[32px] border-none shadow-2xl bg-white dark:bg-zinc-900 p-8">
        <AlertDialogHeader className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-amber-50 dark:bg-amber-950/30 rounded-2xl flex items-center justify-center text-amber-600 mb-2 border border-amber-200 dark:border-amber-800/50">
            <AlertTriangle size={32} />
          </div>
          <AlertDialogTitle className="text-2xl font-black text-center text-indigo-950 dark:text-white">
            Exit Kingdom?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-muted-foreground font-medium text-base">
            Are you sure you want to leave your notebook? Any unsaved changes might be lost.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-row gap-3 sm:gap-3 mt-6">
          <AlertDialogCancel className="flex-1 h-14 rounded-2xl border-none bg-secondary/50 hover:bg-secondary text-indigo-950 dark:text-white font-bold transition-all">
            Stay Here
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="flex-1 h-14 rounded-2xl bg-indigo-950 hover:bg-indigo-900 text-white font-black shadow-lg shadow-amber-500/10 border border-amber-500/20 transition-all"
          >
            <LogOut className="mr-2 text-amber-500" size={18} /> Exit
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ExitConfirmDialog;