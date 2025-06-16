import { useState, useEffect, useCallback } from 'react';
import { noteService } from '../services/noteService';
import { Note, CreateNoteData } from '../types/note';

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedNotes = await noteService.getNotes();
      setNotes(fetchedNotes);
    } catch (err) {
      console.error('Error fetching notes:', err);
      setError('Failed to fetch notes. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const createNote = async (data: CreateNoteData) => {
    try {
      setError(null);
      const newNote = await noteService.createNote(data);
      setNotes(prev => [newNote, ...prev]);
      return newNote;
    } catch (err) {
      console.error('Error creating note:', err);
      setError('Failed to create note. Please try again.');
    }
  };

  const completeNote = async (noteId: string) => {
    try {
      setError(null);
      await noteService.completeNote(noteId);
      setNotes(prev => prev.filter(note => note.id !== noteId));
    } catch (err) {
      console.error('Error completing note:', err);
      setError('Failed to complete note. Please try again.');
    }
  };

  return {
    notes,
    loading,
    error,
    createNote,
    completeNote,
  };
}; 