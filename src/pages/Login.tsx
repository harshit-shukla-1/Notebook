"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn, ShieldAlert } from "lucide-react";
import { showError, showSuccess } from '@/utils/toast';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // For this app, we'll use usernames by mapping them to internal emails
    // Ravan -> ravan@notebook.com
    const email = `${username.toLowerCase()}@notebook.com`;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      showError("Invalid credentials. Try Ravan/lanka or harshit/Harshit1@");
      setLoading(false);
    } else {
      showSuccess("Welcome back!");
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FE] dark:bg-zinc-950 p-4">
      <Card className="w-full max-w-md border-none shadow-2xl rounded-[32px] overflow-hidden">
        <div className="h-2 bg-indigo-600 w-full" />
        <CardHeader className="space-y-1 text-center pt-8">
          <div className="mx-auto w-16 h-16 bg-indigo-50 dark:bg-zinc-900 rounded-2xl flex items-center justify-center mb-4">
            <ShieldAlert className="text-indigo-600" size={32} />
          </div>
          <CardTitle className="text-2xl font-black">Notebook Access</CardTitle>
          <CardDescription>Enter your credentials to manage your notes</CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Username (e.g. Ravan)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="rounded-xl border-none bg-secondary/50 h-12"
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded-xl border-none bg-secondary/50 h-12"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-100" 
              disabled={loading}
            >
              {loading ? "Authenticating..." : <><LogIn className="mr-2" size={18} /> Login</>}
            </Button>
          </form>
          <div className="mt-8 pt-6 border-t border-dashed text-center">
            <p className="text-xs text-muted-foreground">
              Restricted area. Unauthorized access is logged.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;