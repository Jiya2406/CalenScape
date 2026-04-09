import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  startOfMonth, 
  endOfMonth, 
  isSameMonth, 
  isSameDay,
  isBefore,
  isAfter,
  parseISO
} from 'date-fns';
import { ChevronLeft, ChevronRight, Pin } from 'lucide-react';
import type { DateRange, Note } from './CalendarApp';

interface CalendarGridProps {
  currentMonth: Date;
  selectedRange: DateRange;
  onDateClick: (day: Date) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  notes: Note[];
}

const CalendarGrid = ({
  currentMonth,
  selectedRange,
  onDateClick,
  onPrevMonth,
  onNextMonth,
  notes
}: CalendarGridProps) => {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = 'd';
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const isDaySelected = (day: Date) => {
    if (selectedRange.start && isSameDay(day, selectedRange.start)) return true;
    if (selectedRange.end && isSameDay(day, selectedRange.end)) return true;
    return false;
  };

  const isDayInRange = (day: Date) => {
    if (selectedRange.start && selectedRange.end) {
      if (isAfter(day, selectedRange.start) && isBefore(day, selectedRange.end)) {
        return true;
      }
    }
    return false;
  };

  const hasNote = (day: Date) => {
    const dayKey = format(day, 'yyyy-MM-dd');
    return notes.some(n => n.dateKey === dayKey);
  };

  const hasRangeNote = (day: Date) => {
    // Check if this day is within any range note (start_end)
    return notes.some(n => {
      const parts = n.dateKey.split('_');
      if (parts.length === 2) {
        const start = parseISO(parts[0]);
        const end = parseISO(parts[1]);
        return isSameDay(day, start) || isSameDay(day, end) || (isAfter(day, start) && isBefore(day, end));
      }
      return false;
    });
  };


  return (
    <div className="calendar-grid-container">
      <div className="calendar-header">
        <h2>{format(currentMonth, 'MMMM yyyy')}</h2>
        <div className="nav-buttons">
          <button onClick={onPrevMonth} className="nav-btn" aria-label="Previous Month">
            <ChevronLeft size={20} />
          </button>
          <button onClick={onNextMonth} className="nav-btn" aria-label="Next Month">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="days-row">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="day-name">{d}</div>
        ))}
      </div>

      <div className="days-grid">
        {days.map((day, i) => {
          const isSelected = isDaySelected(day);
          const inRange = isDayInRange(day);
          const isStart = selectedRange.start && isSameDay(day, selectedRange.start);
          const isEnd = selectedRange.end && isSameDay(day, selectedRange.end);
          
          let className = `day-cell`;
          if (!isSameMonth(day, monthStart)) className += ' disabled';
          if (isSelected) className += ' selected';
          if (inRange) className += ' in-range';
          if (isStart) className += ' range-start';
          if (isEnd) className += ' range-end';

          return (
            <div 
              key={day.toISOString() + i} 
              className={className}
              onClick={() => onDateClick(day)}
            >
              <div className="day-number">{format(day, dateFormat)}</div>
              {(hasNote(day) || hasRangeNote(day)) && (
                <div className="day-marker">
                  <Pin size={10} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;
