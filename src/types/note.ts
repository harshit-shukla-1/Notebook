export type NoteType = 'text' | 'image' | 'voice';

export interface Folder {
  id: string;
  name: string;
  createdAt: number;
}

export interface Project {
  id: string;
  folderId: string;
  name: string;
  createdAt: number;
}

export interface Note {
  id: string;
  projectId?: string; // Optional to support notes outside projects
  type: NoteType;
  title: string;
  content: string;
  mediaUrl?: string;
  createdAt: number;
  color: string;
}