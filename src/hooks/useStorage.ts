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

  const addProject = (folderId: string, name: string) => {
    const newProject = { id: crypto.randomUUID(), folderId, name, createdAt: Date.now() };
    saveData(folders, [...projects, newProject], notes);
    return newProject;
  };

  const addNote = (note: Note) => {
    saveData(folders, projects, [note, ...notes]);
  };

  const deleteNote = (id: string) => {
    saveData(folders, projects, notes.filter(n => n.id !== id));
  };

  return { folders, projects, notes, addFolder, addProject, addNote, deleteNote };
};