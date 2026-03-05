"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Logo from '@/components/Logo';
import { LogIn } from "lucide-react";
import { showError, showSuccess } from '@/utils/toast';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Map username to internal email system
    const email = `${username.toLowerCase().trim()}@notebook.com`;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      showError("Authentication failed. Access Denied.");
      setLoading(false);
    } else {
      showSuccess("Welcome, King.");
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FE] dark:bg-zinc-950 p-4">
      <Card className="w-full max-w-md border-none shadow-2xl rounded-[40px] overflow-hidden bg-white dark:bg-zinc-900">
        <div className="h-2 bg-indigo-950 w-full relative">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-amber-500/20 via-transparent to-amber-500/20" />
        </div>
        <CardHeader className="space-y-1 text-center pt-10">
          <div className="mx-auto w-20 h-20 bg-indigo-950 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-amber-500/10 border border-amber-500/20">
            <Logo size={48} />
          </div>
          <CardTitle className="text-3xl font-black text-indigo-950 dark:text-white">Lanka Notebook</CardTitle>
          <CardDescription className="font-bold text-amber-600 uppercase text-[10px] tracking-[0.2em] mt-2">
            Kingdom Management System
          </CardDescription>
        </CardHeader>
        <CardContent className="p-10">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Identity"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="rounded-2xl border-none bg-secondary/50 h-14 text-lg font-bold px-6 focus-visible:ring-amber-500/20"
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Secret Key"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded-2xl border-none bg-secondary/50 h-14 text-lg font-bold px-6 focus-visible:ring-amber-500/20"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-14 rounded-2xl bg-indigo-950 hover:bg-indigo-900 text-white font-black shadow-xl shadow-amber-500/10 transition-all active:scale-[0.98] border border-amber-500/20" 
              disabled={loading}
            >
              {loading ? "Verifying..." : <><LogIn className="mr-2 text-amber-500" size={20} /> Enter Kingdom</>}
            </Button>
          </form>
          <div className="mt-10 pt-8 border-t border-dashed border-indigo-50 dark:border-zinc-800 text-center">
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
              Restricted Area • Monitoring Active
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;