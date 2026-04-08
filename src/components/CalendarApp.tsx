import { useState, useEffect } from 'react';
import { format, addMonths, subMonths } from 'date-fns';
import HeroSection from './HeroSection';
import CalendarGrid from './CalendarGrid';
import NotesPanel from './NotesPanel';

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface Note {
  id: string;
  dateKey: string; // 'YYYY-MM-DD' or 'MonthYYYY' for general
  content: string;
}

const CalendarApp = () => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(2026, 0, 1));
  const [selectedRange, setSelectedRange] = useState<DateRange>({ start: null, end: null });
  const [notes, setNotes] = useState<Note[]>([]);

  // Load notes from local storage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('calendarNotes');
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (e) {
        console.error("Failed to parse notes", e);
      }
    }
  }, []);

  // Save notes whenever they change
  useEffect(() => {
    localStorage.setItem('calendarNotes', JSON.stringify(notes));
  }, [notes]);

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const handleDateClick = (day: Date) => {
    if (!selectedRange.start || (selectedRange.start && selectedRange.end)) {
      // Start new range
      setSelectedRange({ start: day, end: null });
    } else if (day < selectedRange.start) {
      // Selected day is before start, so make it the new start
      setSelectedRange({ start: day, end: selectedRange.start });
    } else {
      // Complete the range
      setSelectedRange({ ...selectedRange, end: day });
    }
  };

  const currentSelectionKey = selectedRange.start 
    ? (selectedRange.end 
        ? `${format(selectedRange.start, 'yyyy-MM-dd')}_${format(selectedRange.end, 'yyyy-MM-dd')}`
        : format(selectedRange.start, 'yyyy-MM-dd'))
    : format(currentMonth, 'MMMM_yyyy'); // general month note

  const currentSelectionLabel = selectedRange.start
    ? (selectedRange.end 
        ? `${format(selectedRange.start, 'MMM d')} - ${format(selectedRange.end, 'MMM d')}`
        : format(selectedRange.start, 'MMMM d, yyyy'))
    : `${format(currentMonth, 'MMMM yyyy')} Memos`;

  return (
    <div className="calendar-wrapper">
      <div className="left-panel">
        <HeroSection currentMonth={currentMonth} />
        <NotesPanel 
          dateKey={currentSelectionKey} 
          label={currentSelectionLabel}
          notes={notes}
          setNotes={setNotes}
        />
      </div>
      <div className="right-panel">
        <CalendarGrid 
          currentMonth={currentMonth}
          selectedRange={selectedRange}
          onDateClick={handleDateClick}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          notes={notes}
        />
      </div>
    </div>
  );
};

export default CalendarApp;
