import { useState, useEffect } from 'react';
import { Folder, Project, Note } from '../types/note';

export const useStorage = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const data = localStorage.getItem('harshits-notebook-data');
    if (data) {
      try {
        const parsed = JSON.parse(data);
        setFolders(parsed.folders || []);
        setProjects(parsed.projects || []);
        setNotes(parsed.notes || []);
      } catch (e) {
        console.error("Failed to parse storage", e);
      }
    }
  }, []);

  const saveData = (f: Folder[], p: Project[], n: Note[]) => {
    setFolders(f);
    setProjects(p);
    setNotes(n);
    localStorage.setItem('harshits-notebook-data', JSON.stringify({ folders: f, projects: p, notes: n }));
  };

  const addFolder = (name: string) => {
    const newFolder = { id: crypto.randomUUID(), name, createdAt: Date.now() };
    saveData([...folders, newFolder], projects, notes);
    return newFolder;
  };

  const updateFolder = (id: string, name: string) => {
    const updated = folders.map(f => f.id === id ? { ...f, name } : f);
    saveData(updated, projects, notes);
  };

  const deleteFolder = (id: string) => {
    const remainingFolders = folders.filter(f => f.id !== id);
    const remainingProjects = projects.filter(p => p.folderId !== id);
    // When deleting a folder, we also delete associated projects and their notes
    const projectIdsToRemove = projects.filter(p => p.folderId === id).map(p => p.id);
    const remainingNotes = notes.filter(n => !n.projectId || !projectIdsToRemove.includes(n.projectId));
    saveData(remainingFolders, remainingProjects, remainingNotes);
  };

  const addProject = (folderId: string, name: string) => {
    const newProject = { id: crypto.randomUUID(), folderId, name, createdAt: Date.now() };
    saveData(folders, [...projects, newProject], notes);
    return newProject;
  };

  const updateProject = (id: string, name: string) => {
    const updated = projects.map(p => p.id === id ? { ...p, name } : p);
    saveData(folders, updated, notes);
  };

  const deleteProject = (id: string) => {
    const remainingProjects = projects.filter(p => p.id !== id);
    const remainingNotes = notes.filter(n => n.projectId !== id);
    saveData(folders, remainingProjects, remainingNotes);
  };

  const addNote = (note: Note) => {
    saveData(folders, projects, [note, ...notes]);
  };

  const updateNote = (updatedNote: Note) => {
    const updated = notes.map(n => n.id === updatedNote.id ? updatedNote : n);
    saveData(folders, projects, updated);
  };

  const deleteNote = (id: string) => {
    saveData(folders, projects, notes.filter(n => n.id !== id));
  };

  return { 
    folders, projects, notes, 
    addFolder, updateFolder, deleteFolder,
    addProject, updateProject, deleteProject,
    addNote, updateNote, deleteNote 
  };
};