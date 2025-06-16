import React from 'react';
import { Note } from '../../../../types/note';
import styles from './NoteCard.module.css';

interface NoteCardProps {
  note: Note;
  onComplete: (noteId: string) => Promise<void>;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, onComplete }) => {
  const [isCompleting, setIsCompleting] = React.useState(false);

  const handleComplete = async () => {
    try {
      setIsCompleting(true);
      await onComplete(note.id);
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <h3 className={styles.title}>{note.title}</h3>
        <p className={styles.body}>{note.body}</p>
        <div className={styles.footer}>
          <span className={styles.date}>
            {note.createdAt.toLocaleDateString()}
          </span>
          <button
            onClick={handleComplete}
            disabled={isCompleting}
            className={styles.completeButton}
          >
            {isCompleting ? 'Completing...' : 'Complete ✓'}
          </button>
        </div>
      </div>
    </div>
  );
}; 