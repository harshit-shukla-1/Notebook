export type NoteType = 'text' | 'image' | 'voice';

export interface Note {
  id: string;
  type: NoteType;
  title: string;
  content: string; // For text notes, this is the text. For others, it might be a description or transcript.
  mediaUrl?: string; // Data URL for images or voice recordings
  createdAt: number;
  color: string;
}