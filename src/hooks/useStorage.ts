import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { Folder, Project, Note } from '../types/note';
import { showError } from '@/utils/toast';

export const useStorage = () => {
  const { user } = useAuth();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [fRes, pRes, nRes] = await Promise.all([
        supabase.from('folders').select('*').order('created_at', { ascending: true }),
        supabase.from('projects').select('*').order('created_at', { ascending: true }),
        supabase.from('notes').select('*').order('created_at', { ascending: false })
      ]);

      if (fRes.error) throw fRes.error;
      if (pRes.error) throw pRes.error;
      if (nRes.error) throw nRes.error;

      setFolders(fRes.data || []);
      setProjects(pRes.data || []);
      setNotes(nRes.data || []);
    } catch (e: any) {
      showError("Failed to fetch records from kingdom archives");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const addFolder = async (name: string) => {
    if (!user) return;
    const { data, error } = await supabase
      .from('folders')
      .insert([{ name, user_id: user.id }])
      .select()
      .single();

    if (error) {
      showError("Failed to establish new archive folder");
      return null;
    }
    setFolders([...folders, data]);
    return data;
  };

  const updateFolder = async (id: string, name: string) => {
    const { error } = await supabase
      .from('folders')
      .update({ name })
      .eq('id', id);

    if (error) {
      showError("Failed to rename folder");
      return;
    }
    setFolders(folders.map(f => f.id === id ? { ...f, name } : f));
  };

  const deleteFolder = async (id: string) => {
    const { error } = await supabase
      .from('folders')
      .delete()
      .eq('id', id);

    if (error) {
      showError("Failed to remove folder");
      return;
    }
    setFolders(folders.filter(f => f.id !== id));
    // Associated projects and notes are deleted by DB cascade
    setProjects(projects.filter(p => p.folder_id !== id));
    const projectIdsToRemove = projects.filter(p => p.folder_id === id).map(p => p.id);
    setNotes(notes.filter(n => !n.project_id || !projectIdsToRemove.includes(n.project_id)));
  };

  const addProject = async (folderId: string, name: string) => {
    if (!user) return;
    const { data, error } = await supabase
      .from('projects')
      .insert([{ name, folder_id: folderId, user_id: user.id }])
      .select()
      .single();

    if (error) {
      showError("Failed to create new collection");
      return null;
    }
    setProjects([...projects, data]);
    return data;
  };

  const updateProject = async (id: string, name: string) => {
    const { error } = await supabase
      .from('projects')
      .update({ name })
      .eq('id', id);

    if (error) {
      showError("Failed to rename collection");
      return;
    }
    setProjects(projects.map(p => p.id === id ? { ...p, name } : p));
  };

  const deleteProject = async (id: string) => {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      showError("Failed to remove collection");
      return;
    }
    setProjects(projects.filter(p => p.id !== id));
    setNotes(notes.filter(n => n.project_id !== id));
  };

  const addNote = async (note: Partial<Note>) => {
    if (!user) return;
    const { data, error } = await supabase
      .from('notes')
      .insert([{
        ...note,
        user_id: user.id,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      showError("Failed to capture note");
      return null;
    }
    setNotes([data, ...notes]);
    return data;
  };

  const updateNote = async (updatedNote: Note) => {
    const { error } = await supabase
      .from('notes')
      .update({
        title: updatedNote.title,
        content: updatedNote.content,
        color: updatedNote.color
      })
      .eq('id', updatedNote.id);

    if (error) {
      showError("Failed to sync note changes");
      return;
    }
    setNotes(notes.map(n => n.id === updatedNote.id ? updatedNote : n));
  };

  const deleteNote = async (id: string) => {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id);

    if (error) {
      showError("Failed to delete note");
      return;
    }
    setNotes(notes.filter(n => n.id !== id));
  };

  return { 
    folders, projects, notes, loading,
    addFolder, updateFolder, deleteFolder,
    addProject, updateProject, deleteProject,
    addNote, updateNote, deleteNote 
  };
};