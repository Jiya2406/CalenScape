import { useState } from 'react';
import { PenLine, Plus, Trash2 } from 'lucide-react';
import type { Note } from './CalendarApp';

interface NotesPanelProps {
  dateKey: string;
  label: string;
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
}

const NotesPanel = ({ dateKey, label, notes, setNotes }: NotesPanelProps) => {
  const [draftText, setDraftText] = useState('');

  const currentNotes = notes.filter(n => n.dateKey === dateKey);

  const handleAddNote = () => {
    if (draftText.trim() === '') return;
    
    const newNote: Note = {
      id: crypto.randomUUID(),
      dateKey,
      content: draftText.trim()
    };

    setNotes(prev => [...prev, newNote]);
    setDraftText('');
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="notes-panel">
      <div className="notes-header">
        <PenLine className="notes-icon" size={18} />
        <h3>{label}</h3>
      </div>
      
      <div className="notes-list">
        {currentNotes.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic', textAlign: 'center', marginTop: '1rem' }}>
            No notes for this selection yet.
          </p>
        ) : (
          currentNotes.map(note => (
            <div key={note.id} className="note-item">
              <p>{note.content}</p>
              <button 
                className="note-delete-btn" 
                onClick={() => handleDeleteNote(note.id)}
                aria-label="Delete note"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="draft-note-area">
        <textarea
          className="notes-textarea"
          placeholder="Type a new note..."
          value={draftText}
          onChange={(e) => setDraftText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleAddNote();
            }
          }}
        />
        <button 
          className="add-note-btn" 
          onClick={handleAddNote}
          disabled={draftText.trim() === ''}
          style={{ opacity: draftText.trim() === '' ? 0.5 : 1, cursor: draftText.trim() === '' ? 'not-allowed' : 'pointer' }}
        >
          <Plus size={16} /> Add Note
        </button>
      </div>
    </div>
  );
};

export default NotesPanel;
