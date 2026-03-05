import { useState, useEffect } from 'react';
import { Note } from '../types/note';

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('aura-notes');
    if (saved) {
      try {
        setNotes(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse notes", e);
      }
    }
  }, []);

  const saveNotes = (newNotes: Note[]) => {
    setNotes(newNotes);
    localStorage.setItem('aura-notes', JSON.stringify(newNotes));
  };

  const addNote = (note: Note) => {
    saveNotes([note, ...notes]);
  };

  const deleteNote = (id: string) => {
    saveNotes(notes.filter(n => n.id !== id));
  };

  return { notes, addNote, deleteNote };
};