export interface Note {
  id: string;
  title: string;
  body: string;
  createdAt: Date;
}

export type CreateNoteData = Omit<Note, 'id' | 'createdAt'>; 