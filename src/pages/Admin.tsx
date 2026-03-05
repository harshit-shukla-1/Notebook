"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Trash2, ShieldCheck, UserPlus, ArrowLeft } from "lucide-react";
import { showError, showSuccess } from '@/utils/toast';

const Admin = () => {
  const { isAdmin, loading: authLoading } = useAuth();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/');
      return;
    }
    fetchProfiles();
  }, [isAdmin, authLoading]);

  const fetchProfiles = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('username', { ascending: true });

    if (error) showError("Failed to fetch profiles");
    else setProfiles(data || []);
    setLoading(false);
  };

  const deleteUser = async (id: string) => {
    // Note: Deleting from profiles is easy, but deleting from auth.users 
    // requires admin privileges which usually happen via Edge Functions.
    // For this UI, we'll simulate the management flow.
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (error) showError("Could not remove user profile");
    else {
      showSuccess("User profile removed");
      fetchProfiles();
    }
  };

  if (authLoading || loading) return <div className="p-8 text-center font-bold">Checking Clearance...</div>;

  return (
    <div className="min-h-screen bg-[#F8F9FE] dark:bg-zinc-950 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="rounded-xl">
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-3xl font-black flex items-center gap-3">
                <ShieldCheck className="text-indigo-600" size={32} />
                Command Center
              </h1>
              <p className="text-muted-foreground font-medium">Lanka User Management</p>
            </div>
          </div>
          <Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 font-bold h-12 px-6">
            <UserPlus className="mr-2" size={18} /> New Agent
          </Button>
        </div>

        <Card className="border-none shadow-xl rounded-[32px] overflow-hidden">
          <CardHeader className="bg-white dark:bg-zinc-900 border-b border-indigo-50 dark:border-zinc-800 p-6">
            <CardTitle className="flex items-center gap-2">
              <Users size={20} className="text-indigo-600" />
              Active Profiles
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-secondary/30">
                <TableRow>
                  <TableHead className="font-bold">Username</TableHead>
                  <TableHead className="font-bold">Role</TableHead>
                  <TableHead className="font-bold">Last Active</TableHead>
                  <TableHead className="text-right font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profiles.map((profile) => (
                  <TableRow key={profile.id} className="hover:bg-secondary/10">
                    <TableCell className="font-bold">{profile.username}</TableCell>
                    <TableCell>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        profile.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-zinc-100 text-zinc-700'
                      }`}>
                        {profile.role}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(profile.updated_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:bg-destructive/10 rounded-lg"
                        onClick={() => deleteUser(profile.id)}
                        disabled={profile.username === 'Ravan'} // Protect the admin
                      >
                        <Trash2 size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;