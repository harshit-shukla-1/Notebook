"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the PWA install');
    }
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="fixed bottom-24 left-0 right-0 px-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-[100] w-full max-w-lg"
      >
        <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-indigo-100 dark:border-zinc-800 p-4 sm:p-5 flex items-center gap-3 sm:gap-4">
          <div className="w-12 h-12 bg-indigo-950 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-amber-200/20 border border-amber-500/20 overflow-hidden">
            <img src="/logo.svg" alt="Logo" className="w-8 h-8" />
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm sm:text-base font-black text-indigo-950 dark:text-white truncate">Install App</p>
            <p className="text-[11px] sm:text-xs text-muted-foreground font-medium truncate">Quick access from your home screen</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button 
              size="sm" 
              onClick={handleInstallClick}
              className="rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold px-4 h-9"
            >
              Install
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={() => setIsVisible(false)}
              className="h-9 w-9 rounded-xl hover:bg-secondary"
            >
              <X size={18} />
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PWAInstallPrompt;