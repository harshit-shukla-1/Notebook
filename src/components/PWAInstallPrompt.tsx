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
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the PWA install');
    } else {
      console.log('User dismissed the PWA install');
    }

    // We've used the prompt, and can't use it again
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md"
      >
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-indigo-100 dark:border-zinc-800 p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shrink-0">
              <Download size={20} />
            </div>
            <div>
              <p className="text-sm font-black text-indigo-950 dark:text-white">Install Notebook</p>
              <p className="text-xs text-muted-foreground">Access your notes faster</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              onClick={handleInstallClick}
              className="rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold"
            >
              Install
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={() => setIsVisible(false)}
              className="h-8 w-8 rounded-lg"
            >
              <X size={16} />
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PWAInstallPrompt;