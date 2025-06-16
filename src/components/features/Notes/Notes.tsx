import React from 'react';
import { useNotes } from '../../../hooks/useNotes';
import { NoteForm } from './components/NoteForm';
import { NoteCard } from './components/NoteCard';
import { Note } from '../../../types/note';
import styles from './Notes.module.css';

export const Notes: React.FC = () => {
  const { notes, loading, error, createNote, completeNote } = useNotes();

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Notes & Todo</h1>
          <p className={styles.subtitle}>Loading your notes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Notes & Todo</h1>
          <p className={styles.error}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Notes & Todo</h1>
        <p className={styles.subtitle}>Manage your tasks and notes</p>
      </div>

      <div className={styles.content}>
        <NoteForm onSubmit={createNote} />

        {notes.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No notes yet. Create your first note above!</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {notes.map((note: Note) => (
              <NoteCard
                key={note.id}
                note={note}
                onComplete={completeNote}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 