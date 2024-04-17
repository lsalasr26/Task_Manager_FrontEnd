import React, { useState } from 'react';
import './Calendar.css';
import '@fortawesome/fontawesome-free/css/all.css';

interface Day {
  date: Date;
  isCurrentMonth: boolean;
}

const Calendar: React.FC = () => {
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

    const getCalendarDates = (selectedDate: Date): Day[] => {
      const currentYear = selectedDate.getFullYear();
      const currentMonth = selectedDate.getMonth();
      const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
      const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  
      const daysInMonth: Day[] = [];
      const daysInPrevMonth: Day[] = [];
      const daysInNextMonth: Day[] = [];
  
      //Completa los dias del mes anterior
      const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
      const prevMonthStartDay = firstDayOfMonth.getDay();
      for (let i = prevMonthStartDay - 1; i >= 0; i--) {
          const prevDate = new Date(currentYear, currentMonth - 1, prevMonthLastDay - i);
          daysInPrevMonth.push({ date: prevDate, isCurrentMonth: false });
      }
  
      //Completa los dias del mes actual
      for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
          const currentDate = new Date(currentYear, currentMonth, i);
          daysInMonth.push({ date: currentDate, isCurrentMonth: true });
      }
  
      //Completa los dias del proximo mes
      const nextMonthDaysCount = 6 * 7 - (daysInPrevMonth.length + daysInMonth.length);
      for (let i = 1; i <= nextMonthDaysCount; i++) {
          const nextDate = new Date(currentYear, currentMonth + 1, i);
          daysInNextMonth.push({ date: nextDate, isCurrentMonth: false });
      }
  
      return [...daysInPrevMonth, ...daysInMonth, ...daysInNextMonth];
    };

    const calendarDates = getCalendarDates(currentDate);

    //Agrega los dias en la matriz de dias
    calendarDates.forEach(dayObj => {
      const day = dayObj.date.getDate();
      const isSelected = selectedDate === day;
      const isToday = dayObj.isCurrentMonth && day === today;
      const dayClassName = isSelected ? 'day selected' : isToday ? 'day today' : 'day';
      daysArray.push(
        <div
          key={`${dayObj.date.getFullYear()}-${dayObj.date.getMonth()}-${day}`}
          className={dayClassName}
          onClick={() => handleDayClick(day)}
        >
          {day}
        </div>
      );
    });

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
    <div className='bodyCalendar'>
    <div className="containerCalendar">
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
    </div>
  );
}

export default Calendar;

