"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DatePickerProps {
  onDateSelect: (date: Date) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ onDateSelect }) => {
  const [view, setView] = useState<"day" | "month" | "year">("day");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentYear, setCurrentYear] = useState(selectedDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(selectedDate.getMonth());
  const [yearRangeStart, setYearRangeStart] = useState(
    Math.floor(currentYear / 10) * 10
  );

  const daysInMonth = (month: number, year: number) =>
    new Date(year, month + 1, 0).getDate();

  const handleDayClick = (day: number) => {
    const newDate = new Date(currentYear, currentMonth, day);
    setSelectedDate(newDate);
    onDateSelect(newDate);
    setView("day");
  };

  const handleMonthClick = (month: number) => {
    setCurrentMonth(month);
    setView("day");
  };

  const handleYearClick = (year: number) => {
    setCurrentYear(year);
    setView("month");
  };

  const handlePrevRange = () => {
    if (view === "year") {
      setYearRangeStart(yearRangeStart - 10);
    } else if (view === "month") {
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth === 0 ? 11 : currentMonth - 1);
      if (currentMonth === 0) setCurrentYear(currentYear - 1);
    }
  };

  const handleNextRange = () => {
    if (view === "year") {
      setYearRangeStart(yearRangeStart + 10);
    } else if (view === "month") {
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth === 11 ? 0 : currentMonth + 1);
      if (currentMonth === 11) setCurrentYear(currentYear + 1);
    }
  };

  const monthsInTurkish = [
    "Oca", "Şub", "Mar", "Nis", "May", "Haz",
    "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara",
  ];

  return (
    <div className="w-72 bg-gray-800 text-white rounded-lg shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handlePrevRange}
          className="hover:text-blue-400 p-2 rounded-full"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div
          className="cursor-pointer font-bold text-lg"
          onClick={() =>
            setView(view === "day" ? "month" : view === "month" ? "year" : "day")
          }
        >
          {view === "day"
            ? `${new Intl.DateTimeFormat("tr-TR", { month: "long" }).format(
                new Date(currentYear, currentMonth)
              )} ${currentYear}`
            : view === "month"
            ? `${currentYear}`
            : `${yearRangeStart}-${yearRangeStart + 9}`}
        </div>
        <button
          onClick={handleNextRange}
          className="hover:text-blue-400 p-2 rounded-full"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Days, Months, or Years */}
      <div
        className={`grid ${
          view === "day" ? "grid-cols-7" : "grid-cols-4"
        } gap-2`}
      >
        {view === "day" &&
          Array.from({ length: daysInMonth(currentMonth, currentYear) }, (_, i) => (
            <button
              key={i}
              onClick={() => handleDayClick(i + 1)}
              className={`p-2 rounded text-center ${
                selectedDate.getDate() === i + 1 &&
                selectedDate.getMonth() === currentMonth &&
                selectedDate.getFullYear() === currentYear
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-700"
              }`}
            >
              {i + 1}
            </button>
          ))}

        {view === "month" &&
          monthsInTurkish.map((month, i) => (
            <button
              key={i}
              onClick={() => handleMonthClick(i)}
              className={`p-3 rounded text-center ${
                i === currentMonth ? "bg-blue-600 text-white" : "hover:bg-gray-700"
              }`}
            >
              {month}
            </button>
          ))}

        {view === "year" &&
          Array.from({ length: 10 }, (_, i) => (
            <button
              key={i}
              onClick={() => handleYearClick(yearRangeStart + i)}
              className={`p-3 rounded text-center ${
                yearRangeStart + i === currentYear
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-700"
              }`}
            >
              {yearRangeStart + i}
            </button>
          ))}
      </div>
    </div>
  );
};

export default DatePicker;
