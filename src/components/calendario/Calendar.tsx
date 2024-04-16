import React, { useState } from 'react';
import './Calendar.css';
import '@fortawesome/fontawesome-free/css/all.css';

interface CalendarProps {
  
}

const Calendar: React.FC<CalendarProps> = (props) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getMonthStartDay = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const generateDaysArray = () => {
    const totalDays = daysInMonth(currentDate);
    const startDay = getMonthStartDay(currentDate);
    const daysArray: JSX.Element[] = [];
    const today = new Date().getDate();

    // Add days from previous month
    const prevMonthDays = (startDay === 0 ? 6 : startDay - 1);
    const prevMonthLastDay = daysInMonth(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    for (let i = prevMonthLastDay - prevMonthDays + 1; i <= prevMonthLastDay; i++) {
      daysArray.push(
        <div key={`prev-${i}`} className="day prev-month">{i}</div>
      );
    }

    // Add days from current month
    for (let i = 1; i <= totalDays; i++) {
      const isSelected = selectedDate === i;
      const isToday = currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear() && i === today;
      const dayClassName = isSelected ? 'day selected' : isToday ? 'day today' : 'day';
      daysArray.push(
        <div key={`current-${i}`} className={dayClassName} onClick={() => handleDayClick(i)}>
          {i}
        </div>
      );
    }

    // Add days from next month
    const nextMonthDays = 42 - daysArray.length; // 42 days for 6 rows
    for (let i = 1; i <= nextMonthDays; i++) {
      daysArray.push(
        <div key={`next-${i}`} className="day next-month">{i}</div>
      );
    }

    return daysArray;
  };

  const handleDayClick = (day: number) => {
    setSelectedDate(day);
    // lógica cuando se hace clic en un día
  };

  const prevMonth = () => {
    setCurrentDate(prevDate => {
      const prevMonthDate = new Date(prevDate.getFullYear(), prevDate.getMonth() - 1);
      return prevMonthDate;
    });
  };

  const nextMonth = () => {
    setCurrentDate(prevDate => {
      const nextMonthDate = new Date(prevDate.getFullYear(), prevDate.getMonth() + 1);
      return nextMonthDate;
    });
  };

  return (
    <div className="container">
      <div className="left">
        <div className="calendar">
          <div className="month">
            <i className="fas fa-angle-left prev" onClick={prevMonth}></i>
            <div className="date">{currentDate.toLocaleString('default', { month: 'long' })} {currentDate.getFullYear()}</div>
            <i className="fas fa-angle-right next" onClick={nextMonth}></i>
          </div>
          <div className="weekdays">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>
          <div className="days">
            {generateDaysArray()}
          </div>
          <div className="goto-today">
            <div className="goto">
              <input type="text" placeholder="mm/yyyy" className="date-input" />
              <button className="goto-btn">Go</button>
            </div>
            <button className="today-btn">Today</button>
          </div>
        </div>
      </div>
      <div className="right">
        {/* eventos y agregar lógica para manejarlos */}
      </div>
      <button className="add-event">
        <i className="fas fa-plus"></i>
      </button>
    </div>
  );
}

export default Calendar;
