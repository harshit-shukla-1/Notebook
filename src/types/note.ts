export type NoteType = 'text' | 'image' | 'voice';

export interface Folder {
  id: string;
  name: string;
  created_at: string;
  user_id: string;
}

export interface Project {
  id: string;
  folder_id: string;
  name: string;
  created_at: string;
  user_id: string;
}

export interface Note {
  id: string;
  project_id?: string;
  type: NoteType;
  title: string;
  content: string;
  media_url?: string;
  created_at: string;
  color: string;
  user_id: string;
}