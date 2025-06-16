import React, { useState } from 'react';
import { CreateNoteData, Note } from '../../../../types/note';
import styles from './NoteForm.module.css';

interface NoteFormProps {
  onSubmit: (data: CreateNoteData) => Promise<Note | undefined>;
}

export const NoteForm: React.FC<NoteFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !body.trim()) return;

    try {
      setIsSubmitting(true);
      await onSubmit({
        title: title.trim(),
        body: body.trim()
      });
      
      // Reset form
      setTitle('');
      setBody('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.inputGroup}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
          className={styles.titleInput}
          disabled={isSubmitting}
          required
        />
      </div>
      
      <div className={styles.inputGroup}>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Note content"
          className={styles.bodyInput}
          rows={4}
          disabled={isSubmitting}
          required
        />
      </div>

      <button
        type="submit"
        className={styles.submitButton}
        disabled={isSubmitting || !title.trim() || !body.trim()}
      >
        {isSubmitting ? 'Creating...' : 'Create Note'}
      </button>
    </form>
  );
}; 