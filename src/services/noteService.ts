import { collection, addDoc, deleteDoc, doc, query, getDocs, Timestamp, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import { Note, CreateNoteData } from '../types/note';

const COLLECTION_NAME = 'notes';

export const noteService = {
  async createNote(data: CreateNoteData): Promise<Note> {
    try {
      const noteData = {
        ...data,
        createdAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, COLLECTION_NAME), noteData);
      
      return {
        id: docRef.id,
        ...data,
        createdAt: new Date(),
      };
    } catch (error) {
      console.error('Error creating note:', error);
      throw new Error('Failed to create note');
    }
  },

  async getNotes(): Promise<Note[]> {
    try {
      const notesQuery = query(
        collection(db, COLLECTION_NAME),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(notesQuery);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      })) as Note[];
    } catch (error) {
      console.error('Error fetching notes:', error);
      throw new Error('Failed to fetch notes');
    }
  },

  async completeNote(noteId: string): Promise<void> {
    try {
      const noteRef = doc(db, COLLECTION_NAME, noteId);
      await deleteDoc(noteRef);
    } catch (error) {
      console.error('Error completing note:', error);
      throw new Error('Failed to complete note');
    }
  },
}; 