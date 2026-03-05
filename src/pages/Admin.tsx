"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Logo from '@/components/Logo';
import { Users, Trash2, UserPlus, LogOut, Edit2, Search, Eye, EyeOff } from "lucide-react";
import { showError, showSuccess } from '@/utils/toast';

const Admin = () => {
  const { isAdmin, signOut, loading: authLoading } = useAuth();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'user'
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
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('username', { ascending: true });

    if (error) showError("Failed to fetch kingdom records");
    else setProfiles(data || []);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this profile? This action is permanent.")) return;
    
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (error) showError("Could not remove record");
    else {
      showSuccess("Record removed from archives");
      fetchProfiles();
    }
  };

  const handleOpenDialog = (profile?: any) => {
    if (profile) {
      setEditingProfile(profile);
      setFormData({ username: profile.username || '', password: '', role: profile.role || 'user' });
    } else {
      setEditingProfile(null);
      setFormData({ username: '', password: '', role: 'user' });
    }
    setShowPassword(false);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.username.trim()) {
      showError("Identity is required");
      return;
    }

    if (!editingProfile && !formData.password.trim()) {
      showError("Security key is required for new accounts");
      return;
    }

    setLoading(true);

    if (editingProfile) {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          username: formData.username, 
          role: formData.role,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingProfile.id);

      if (error) {
        showError("Update failed");
        setLoading(false);
      } else {
        showSuccess("Record updated");
        setIsDialogOpen(false);
        fetchProfiles();
      }
    } else {
      // Create new user via Edge Function
      try {
        const { data, error } = await supabase.functions.invoke('manage-users', {
          body: {
            action: 'CREATE_USER',
            username: formData.username,
            password: formData.password,
            role: formData.role
          }
        });

        if (error) throw error;
        if (data?.error) throw new Error(data.error);

        showSuccess(`Identity established for ${formData.username}`);
        setIsDialogOpen(false);
        fetchProfiles();
      } catch (err: any) {
        showError(err.message || "Failed to create identity");
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredProfiles = profiles.filter(p => 
    p.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  if (authLoading || (loading && profiles.length === 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FE] dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="font-bold text-indigo-950 dark:text-white">Connecting to Command Center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FE] dark:bg-zinc-950 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-[40px] shadow-xl shadow-amber-500/5 border border-indigo-50 dark:border-zinc-800">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-indigo-950 rounded-[24px] flex items-center justify-center text-white shadow-lg shadow-amber-500/10 cursor-pointer border border-amber-500/20" onClick={() => navigate('/')}>
              <Logo size={40} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-indigo-950 dark:text-white leading-none">
                Command Center
              </h1>
              <p className="text-amber-600 font-bold text-[10px] uppercase tracking-widest mt-2">
                Kingdom Management Console
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="rounded-2xl border-indigo-100 hover:bg-destructive/10 hover:text-destructive h-12 px-6 font-bold transition-all"
            >
              <LogOut className="mr-2" size={18} /> Logout
            </Button>
            <Button 
              className="rounded-2xl bg-indigo-950 hover:bg-indigo-900 text-white border border-amber-500/20 shadow-lg shadow-amber-500/10 font-bold h-12 px-6 transition-all"
              onClick={() => handleOpenDialog()}
            >
              <UserPlus className="mr-2 text-amber-500" size={18} /> New Identity
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="relative group max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-amber-600 transition-colors" size={20} />
          <Input 
            placeholder="Find kingdom subjects..." 
            className="pl-12 h-14 rounded-2xl bg-white dark:bg-zinc-900 border-none shadow-sm focus-visible:ring-amber-500/20 text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* User Table */}
        <Card className="border-none shadow-2xl rounded-[40px] overflow-hidden bg-white dark:bg-zinc-900">
          <CardHeader className="border-b border-indigo-50 dark:border-zinc-800 p-8 bg-secondary/10">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-black text-indigo-950 dark:text-white">Active Identities</CardTitle>
                <CardDescription className="font-medium mt-1">Manage kingdom access and permissions</CardDescription>
              </div>
              <div className="bg-white dark:bg-zinc-800 px-4 py-2 rounded-2xl shadow-sm border border-indigo-50 dark:border-zinc-700">
                <span className="text-xs font-black text-amber-600 uppercase tracking-tighter">Subjects: {profiles.length}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-indigo-50 dark:border-zinc-800 hover:bg-transparent">
                    <TableHead className="font-black px-8 py-4 text-xs uppercase tracking-widest text-muted-foreground">Identity</TableHead>
                    <TableHead className="font-black py-4 text-xs uppercase tracking-widest text-muted-foreground">Power Level</TableHead>
                    <TableHead className="font-black py-4 text-xs uppercase tracking-widest text-muted-foreground">Last Seen</TableHead>
                    <TableHead className="text-right font-black px-8 py-4 text-xs uppercase tracking-widest text-muted-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProfiles.map((profile) => (
                    <TableRow key={profile.id} className="hover:bg-indigo-50/30 dark:hover:bg-zinc-800/30 transition-colors border-indigo-50/50 dark:border-zinc-800/50">
                      <TableCell className="font-bold px-8 py-6 text-base text-indigo-950 dark:text-zinc-200">
                        {profile.username}
                      </TableCell>
                      <TableCell>
                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                          profile.role === 'admin' 
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' 
                            : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300'
                        }`}>
                          {profile.role}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm font-medium">
                        {new Date(profile.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </TableCell>
                      <TableCell className="text-right px-8">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-indigo-600 hover:bg-indigo-50 dark:hover:bg-zinc-800 rounded-xl"
                            onClick={() => handleOpenDialog(profile)}
                          >
                            <Edit2 size={16} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-destructive hover:bg-destructive/10 rounded-xl"
                            onClick={() => handleDelete(profile.id)}
                            disabled={profile.username?.toLowerCase() === 'ravan'} 
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredProfiles.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="h-40 text-center">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Users size={40} className="text-muted-foreground/30" />
                          <p className="font-bold text-muted-foreground">No subjects found in current archives</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CRUD Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="rounded-[40px] sm:max-w-[450px] p-8 border-none shadow-2xl overflow-hidden bg-white dark:bg-zinc-900">
          <div className="absolute top-0 left-0 w-full h-2 bg-indigo-950" />
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-indigo-950 dark:text-white">
              {editingProfile ? 'Edit Record' : 'New Identity'}
            </DialogTitle>
            <DialogDescription className="font-medium">
              {editingProfile ? 'Update kingdom records and permissions' : 'Establish a new secure identity with a key'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="font-black uppercase text-[10px] tracking-widest text-muted-foreground pl-1">Identity Name</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="rounded-2xl bg-secondary/30 border-none h-14 text-lg font-bold px-5 focus-visible:ring-amber-500/20"
                placeholder="Enter username..."
              />
            </div>

            {!editingProfile && (
              <div className="space-y-2">
                <Label htmlFor="password" className="font-black uppercase text-[10px] tracking-widest text-muted-foreground pl-1">Secret Key</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="rounded-2xl bg-secondary/30 border-none h-14 text-lg font-bold px-5 pr-12 focus-visible:ring-amber-500/20"
                    placeholder="Enter key..."
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-amber-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="role" className="font-black uppercase text-[10px] tracking-widest text-muted-foreground pl-1">Power Level</Label>
              <Select 
                value={formData.role} 
                onValueChange={(v) => setFormData({ ...formData, role: v })}
              >
                <SelectTrigger className="rounded-2xl bg-secondary/30 border-none h-14 text-lg font-bold px-5 focus-visible:ring-amber-500/20">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-none shadow-xl">
                  <SelectItem value="user" className="font-bold py-3">Subject (User)</SelectItem>
                  <SelectItem value="admin" className="font-bold py-3">Archon (Admin)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="flex flex-row gap-3 pt-2">
            <Button 
              variant="ghost" 
              onClick={() => setIsDialogOpen(false)}
              className="flex-1 rounded-2xl h-14 font-black text-muted-foreground hover:bg-secondary transition-all"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              className="flex-1 rounded-2xl bg-indigo-950 text-white border border-amber-500/20 hover:bg-indigo-900 h-14 font-black shadow-lg shadow-amber-500/10 transition-all"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Secure Records'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;