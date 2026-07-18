import React, { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface DatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  placeholder?: string;
}

const INDONESIAN_MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const WEEKDAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export default function DatePicker({ value, onChange, placeholder = 'hh / bb / tttt' }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Local state for calendar navigation
  const [navDate, setNavDate] = useState(() => {
    if (value) {
      const parts = value.split('-');
      if (parts.length === 3) {
        return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, 1);
      }
    }
    return new Date();
  });

  const [showMonthYearPicker, setShowMonthYearPicker] = useState(false);

  // Update navDate if value changes externally
  useEffect(() => {
    if (value) {
      const parts = value.split('-');
      if (parts.length === 3) {
        setNavDate(new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, 1));
      }
    }
  }, [value]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowMonthYearPicker(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navYear = navDate.getFullYear();
  const navMonth = navDate.getMonth();

  // Helper to change month
  const handlePrevMonth = () => {
    setNavDate(new Date(navYear, navMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setNavDate(new Date(navYear, navMonth + 1, 1));
  };

  const handleMonthSelect = (m: number) => {
    setNavDate(new Date(navYear, m, 1));
  };

  const handleYearSelect = (y: number) => {
    setNavDate(new Date(y, navMonth, 1));
  };

  // Format date display
  const getDisplayValue = () => {
    if (!value) return '';
    const parts = value.split('-');
    if (parts.length === 3) {
      return `${parts[2].padStart(2, '0')} / ${parts[1].padStart(2, '0')} / ${parts[0]}`;
    }
    return value;
  };

  // Parse text input typing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    
    // Allow users to clear
    if (!raw) {
      onChange('');
      return;
    }

    // Keep only numbers and slashes/spaces
    const cleaned = raw.replace(/[^0-9/]/g, '');
    
    // Simple parsing if we have enough numbers
    const digits = cleaned.replace(/\D/g, '');
    if (digits.length === 8) {
      const d = digits.slice(0, 2);
      const m = digits.slice(2, 4);
      const y = digits.slice(4, 8);
      onChange(`${y}-${m}-${d}`);
    }
  };

  // Generate the 42 days grid for calendar
  const getCalendarDays = () => {
    const firstDayIndex = new Date(navYear, navMonth, 1).getDay();
    const totalDays = new Date(navYear, navMonth + 1, 0).getDate();
    const prevMonthTotalDays = new Date(navYear, navMonth, 0).getDate();

    const days = [];

    // Prev month days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = prevMonthTotalDays - i;
      const prevMonthIdx = navMonth === 0 ? 11 : navMonth - 1;
      const prevYearIdx = navMonth === 0 ? navYear - 1 : navYear;
      const isSun = new Date(prevYearIdx, prevMonthIdx, dayNum).getDay() === 0;
      const isSat = new Date(prevYearIdx, prevMonthIdx, dayNum).getDay() === 6;
      days.push({
        day: dayNum,
        isCurrentMonth: false,
        dateStr: `${prevYearIdx}-${String(prevMonthIdx + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`,
        isSunday: isSun,
        isSaturday: isSat
      });
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      const isSun = new Date(navYear, navMonth, i).getDay() === 0;
      const isSat = new Date(navYear, navMonth, i).getDay() === 6;
      days.push({
        day: i,
        isCurrentMonth: true,
        dateStr: `${navYear}-${String(navMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`,
        isSunday: isSun,
        isSaturday: isSat
      });
    }

    // Next month days to complete grid (42 cells)
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const nextMonthIdx = navMonth === 11 ? 0 : navMonth + 1;
      const nextYearIdx = navMonth === 11 ? navYear + 1 : navYear;
      const isSun = new Date(nextYearIdx, nextMonthIdx, i).getDay() === 0;
      const isSat = new Date(nextYearIdx, nextMonthIdx, i).getDay() === 6;
      days.push({
        day: i,
        isCurrentMonth: false,
        dateStr: `${nextYearIdx}-${String(nextMonthIdx + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`,
        isSunday: isSun,
        isSaturday: isSat
      });
    }

    return days;
  };

  const daysGrid = getCalendarDays();

  // Handle day click
  const handleDayClick = (dateStr: string) => {
    onChange(dateStr);
    setIsOpen(false);
    setShowMonthYearPicker(false);
  };

  // Clear date
  const handleClear = () => {
    onChange('');
    setIsOpen(false);
    setShowMonthYearPicker(false);
  };

  // Year choices (2020 to 2030)
  const years = [];
  for (let y = 2020; y <= 2035; y++) {
    years.push(y);
  }

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="relative">
        <input
          type="text"
          value={getDisplayValue()}
          onChange={handleInputChange}
          onClick={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-3 pr-10 py-1.5 bg-[#0F172A] border border-slate-700 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-indigo-500/80 focus:ring-2 focus:ring-indigo-500/20 font-mono transition placeholder-slate-500 cursor-pointer"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition"
        >
          <CalendarIcon size={14} />
        </button>
      </div>

      {/* CALENDAR CONTAINER MODAL */}
      {isOpen && (
        <div className="absolute left-0 mt-2 z-50 w-[290px] bg-white border border-slate-200 rounded-2xl p-4 shadow-2xl transition-all animate-in fade-in slide-in-from-top-1">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 hover:bg-slate-100 rounded-lg text-slate-600 transition"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Month & Year Button Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowMonthYearPicker(!showMonthYearPicker)}
                className="px-3 py-1 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition flex items-center gap-1.5 shadow-sm"
              >
                {INDONESIAN_MONTH_NAMES[navMonth]} {navYear}
                <span className="text-[10px] text-slate-500">▼</span>
              </button>

              {/* Month & Year Selectors Menu */}
              {showMonthYearPicker && (
                <div className="absolute left-1/2 -translate-x-1/2 mt-1 z-50 bg-white border border-slate-200 rounded-xl p-3 shadow-xl w-[220px] grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Bulan</label>
                    <select
                      value={navMonth}
                      onChange={(e) => {
                        handleMonthSelect(parseInt(e.target.value, 10));
                        setShowMonthYearPicker(false);
                      }}
                      className="w-full text-xs p-1 border border-slate-200 rounded bg-white text-slate-700 font-medium focus:outline-none"
                    >
                      {INDONESIAN_MONTH_NAMES.map((name, idx) => (
                        <option key={idx} value={idx}>{name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Tahun</label>
                    <select
                      value={navYear}
                      onChange={(e) => {
                        handleYearSelect(parseInt(e.target.value, 10));
                        setShowMonthYearPicker(false);
                      }}
                      className="w-full text-xs p-1 border border-slate-200 rounded bg-white text-slate-700 font-medium focus:outline-none"
                    >
                      {years.map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 hover:bg-slate-100 rounded-lg text-slate-600 transition"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Weekday Names */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {WEEKDAYS.map((day, i) => {
              const isWeekend = i === 0 || i === 6;
              return (
                <div
                  key={day}
                  className={`text-[11px] font-bold ${
                    isWeekend ? 'text-rose-500' : 'text-slate-400'
                  }`}
                >
                  {day}
                </div>
              );
            })}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {daysGrid.map((cell, idx) => {
              const isSelected = value === cell.dateStr;
              
              // Text Color logic based on screenshot:
              // Sunday / Saturday in red/pinkish.
              // Faded colors for other month days.
              let textClass = 'text-slate-700 font-medium';
              if (cell.isSunday || cell.isSaturday) {
                textClass = cell.isCurrentMonth ? 'text-rose-500 font-bold' : 'text-rose-300 font-normal';
              } else if (!cell.isCurrentMonth) {
                textClass = 'text-slate-300 font-normal';
              }

              // Selected style: rounded rectangle (blue border) and slate/grey background.
              const cellStyle = isSelected
                ? 'bg-slate-200 border-2 border-blue-500 rounded-lg shadow-sm text-slate-900 font-bold scale-105'
                : 'hover:bg-slate-100 rounded-lg';

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleDayClick(cell.dateStr)}
                  className={`aspect-square flex items-center justify-center text-xs transition-all relative ${cellStyle} ${textClass}`}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>

          {/* Footer - Bersihkan Button */}
          <div className="border-t border-slate-100 mt-3 pt-3 flex items-center justify-between">
            <button
              type="button"
              onClick={handleClear}
              className="px-3 py-1 text-[11px] font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-md shadow-sm transition active:scale-95"
            >
              Bersihkan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
