import { useState, useEffect } from 'react';
import { PenLine } from 'lucide-react';
import type { Note } from './CalendarApp';

interface NotesPanelProps {
  dateKey: string;
  label: string;
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
}

const NotesPanel = ({ dateKey, label, notes, setNotes }: NotesPanelProps) => {
  const [currentText, setCurrentText] = useState('');

  useEffect(() => {
    const existingNote = notes.find(n => n.dateKey === dateKey);
    setCurrentText(existingNote ? existingNote.content : '');
  }, [dateKey, notes]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setCurrentText(text);
    
    // Save to notes array on change
    setNotes(prevNotes => {
      const existingIdx = prevNotes.findIndex(n => n.dateKey === dateKey);
      if (existingIdx >= 0) {
        if (text.trim() === '') {
          // Remove auto empty
          return prevNotes.filter(n => n.dateKey !== dateKey);
        }
        const newNotes = [...prevNotes];
        newNotes[existingIdx] = { ...newNotes[existingIdx], content: text };
        return newNotes;
      } else {
        if (text.trim() === '') return prevNotes;
        return [...prevNotes, { id: crypto.randomUUID(), dateKey, content: text }];
      }
    });
  };

  return (
    <div className="notes-panel">
      <div className="notes-header">
        <PenLine className="notes-icon" size={18} />
        <h3>{label}</h3>
      </div>
      <textarea
        className="notes-textarea"
        placeholder={`Add some notes for ${label}...`}
        value={currentText}
        onChange={handleChange}
      />
    </div>
  );
};

export default NotesPanel;
