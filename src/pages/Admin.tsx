"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Trash2, ShieldCheck, UserPlus, ArrowLeft, Edit2, Key, Info } from "lucide-react";
import { showError, showSuccess } from '@/utils/toast';

const Admin = () => {
  const { isAdmin, loading: authLoading } = useAuth();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    username: '',
    role: 'user',
    password_note: '' // Note: Real passwords aren't stored in 'profiles' for security, this is a management hint
  });

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

  const handleOpenDialog = (user: any = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        username: user.username || '',
        role: user.role || 'user',
        password_note: user.password_note || ''
      });
    } else {
      setEditingUser(null);
      setFormData({ username: '', role: 'user', password_note: '' });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (editingUser) {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: formData.username,
          role: formData.role,
          password_note: formData.password_note,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingUser.id);

      if (error) showError("Update failed");
      else {
        showSuccess("User updated successfully");
        fetchProfiles();
        setDialogOpen(false);
      }
    } else {
        showError("New user creation requires Auth setup in Supabase dashboard first.");
    }
    setLoading(false);
  };

  const deleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to remove this profile?")) return;
    
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (error) showError("Could not remove user profile");
    else {
      showSuccess("User profile removed");
      fetchProfiles();
    }
  };

  if (authLoading || loading) return <div className="p-8 text-center font-bold">Accessing Command Center...</div>;

  return (
    <div className="min-h-screen bg-[#F8F9FE] dark:bg-zinc-950 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="rounded-xl bg-white dark:bg-zinc-900 shadow-sm">
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-3xl font-black flex items-center gap-3 text-indigo-950 dark:text-white">
                <ShieldCheck className="text-indigo-600" size={32} />
                Command Center
              </h1>
              <p className="text-muted-foreground font-medium">User Management & Security</p>
            </div>
          </div>
          <Button 
            className="rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 font-bold h-12 px-6"
            onClick={() => handleOpenDialog()}
          >
            <UserPlus className="mr-2" size={18} /> Add New Profile
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-none shadow-sm rounded-3xl bg-indigo-600 text-white">
                <CardContent className="p-6">
                    <Users className="mb-2 opacity-50" size={24} />
                    <p className="text-sm font-bold opacity-80">Total Agents</p>
                    <h3 className="text-3xl font-black">{profiles.length}</h3>
                </CardContent>
            </Card>
            <Card className="border-none shadow-sm rounded-3xl bg-white dark:bg-zinc-900">
                <CardContent className="p-6">
                    <ShieldCheck className="mb-2 text-indigo-600" size={24} />
                    <p className="text-sm font-bold text-muted-foreground">Admins</p>
                    <h3 className="text-3xl font-black">{profiles.filter(p => p.role === 'admin').length}</h3>
                </CardContent>
            </Card>
            <Card className="border-none shadow-sm rounded-3xl bg-white dark:bg-zinc-900">
                <CardContent className="p-6">
                    <Info className="mb-2 text-indigo-600" size={24} />
                    <p className="text-sm font-bold text-muted-foreground">System Status</p>
                    <h3 className="text-xl font-black text-emerald-500 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Operational
                    </h3>
                </CardContent>
            </Card>
        </div>

        <Card className="border-none shadow-xl rounded-[40px] overflow-hidden bg-white dark:bg-zinc-900">
          <CardHeader className="border-b border-indigo-50 dark:border-zinc-800 p-8">
            <CardTitle className="flex items-center gap-2 text-xl font-black">
              <Users size={24} className="text-indigo-600" />
              Active Profiles
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-secondary/20">
                <TableRow>
                  <TableHead className="font-black px-8">USERNAME</TableHead>
                  <TableHead className="font-black">ROLE</TableHead>
                  <TableHead className="font-black">PASSWORD HINT</TableHead>
                  <TableHead className="font-black">LAST SYNC</TableHead>
                  <TableHead className="text-right font-black px-8">ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profiles.map((profile) => (
                  <TableRow key={profile.id} className="hover:bg-secondary/10 border-indigo-50/30 dark:border-zinc-800/50">
                    <TableCell className="font-bold px-8 py-5 text-base">{profile.username}</TableCell>
                    <TableCell>
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        profile.role === 'admin' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'
                      }`}>
                        {profile.role}
                      </span>
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium bg-secondary/30 px-3 py-1.5 rounded-lg w-fit">
                            <Key size={12} />
                            {profile.password_note || 'None set'}
                        </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm font-medium">
                      {new Date(profile.updated_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right px-8 space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="rounded-xl hover:bg-indigo-50 dark:hover:bg-zinc-800"
                        onClick={() => handleOpenDialog(profile)}
                      >
                        <Edit2 size={16} className="text-indigo-600" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:bg-destructive/10 rounded-xl"
                        onClick={() => deleteUser(profile.id)}
                        disabled={profile.username === 'Ravan'} 
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="rounded-[32px] sm:max-w-[450px] p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="p-8 pb-4">
            <DialogTitle className="text-2xl font-black flex items-center gap-3">
              <div className="p-2 bg-indigo-50 dark:bg-zinc-800 rounded-xl">
                <ShieldCheck className="text-indigo-600" size={24} />
              </div>
              {editingUser ? 'Edit Profile' : 'Add New Profile'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="p-8 pt-2 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Username</label>
                <Input
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="rounded-2xl border-none bg-secondary/50 h-12 text-base font-bold px-5"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">System Role</label>
                <Select 
                  value={formData.role} 
                  onValueChange={(v) => setFormData({ ...formData, role: v })}
                >
                  <SelectTrigger className="rounded-2xl border-none bg-secondary/50 h-12 text-base font-bold px-5">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="user">Standard User</SelectItem>
                    <SelectItem value="admin">System Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Password Hint</label>
                <div className="relative">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <Input
                        placeholder="Management password hint..."
                        value={formData.password_note}
                        onChange={(e) => setFormData({ ...formData, password_note: e.target.value })}
                        className="rounded-2xl border-none bg-secondary/50 h-12 text-base font-bold pl-12"
                    />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 ml-1 leading-relaxed">
                    This is for administrative reference only. To change actual login credentials, use the Supabase Auth panel.
                </p>
              </div>
            </div>

            <DialogFooter className="flex-row gap-3 pt-4">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => setDialogOpen(false)}
                className="flex-1 rounded-2xl h-12 font-bold hover:bg-secondary"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1 rounded-2xl bg-indigo-600 h-12 font-black hover:bg-indigo-700 shadow-lg shadow-indigo-100"
              >
                {editingUser ? 'Save Changes' : 'Create Profile'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;