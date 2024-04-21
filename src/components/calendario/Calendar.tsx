import React, { useState, useEffect } from 'react';
import './Calendar.css';
import '@fortawesome/fontawesome-free/css/all.css';

interface Day {
  date: Date;
  isCurrentMonth: boolean;
}

const Calendar: React.FC = () => {

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [eventInput, setEventInput] = useState('');
  const [events, setEvents] = useState<{ date: Date; event: string }[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isTodayActive, setIsTodayActive] = useState(false);
  const [inputDate, setInputDate] = useState('');
  const [isAddEventActive, setIsAddEventActive] = useState(false);
  const hasEvents = events.length > 0;

  const getDayOfWeek = (date: Date) => {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return days[date.getDay()];
  };

  const getCurrentDate = (date: Date) => {
    // Opciones de formato para mostrar solo día, mes y año
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    };
    return date.toLocaleDateString('es-ES', options);
  };

  const generateDaysArray = () => {
    const daysArray: JSX.Element[] = [];
    const today = new Date();
    const currentMonth = currentDate.getMonth();

    const getCalendarDates = (selectedDate: Date): Day[] => {
      const currentYear = selectedDate.getFullYear();
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
      const isSelected = selectedDate ? isSameDay(selectedDate, dayObj.date) : false;
      const isToday = dayObj.isCurrentMonth && isSameDay(today, dayObj.date);

      let dayClassName = 'day';

      if (isSelected) {
        dayClassName += ' active';
      }

      if (isToday) {
        dayClassName += ' today active';
      }

      if (!dayObj.isCurrentMonth) {
        dayClassName += dayObj.date < today ? ' prev-date' : ' next-date';
      }

      daysArray.push(
        <div
          key={`${dayObj.date.getFullYear()}-${dayObj.date.getMonth()}-${day}`}
          className={dayClassName}
          onClick={() => handleDayClick(dayObj.date)}
        >
          {day}
        </div>
      );
    });

    return daysArray;
  };

  //Logica manejo de click sobre fechas
  const handleDayClick = (selectedDay: Date) => {
    // Si el día seleccionado no pertenece al mes actual, redirigir al mes correspondiente
    if (selectedDay.getMonth() !== currentDate.getMonth()) {
      setCurrentDate(selectedDay);
      setIsTodayActive(false); // Desactivar el estado del botón TODAY al seleccionar otro día
    }

    if (selectedDate && isSameDay(selectedDate, selectedDay)) {
      // Si el día ya estaba seleccionado, lo quitamos
      setEvents(prevEvents => prevEvents.filter(event => !isSameDay(event.date, selectedDay)));
      setSelectedDate(null);
    } else {
      // Quitamos la clase 'today' del día actual si está presente
      const todayElements = document.querySelectorAll('.today');
      todayElements.forEach(element => {
        element.classList.remove('today');
      });

      // Si el día no estaba seleccionado, lo marcamos
      setSelectedDate(selectedDay);
      setIsTodayActive(false); // Desactivar el estado del botón TODAY al seleccionar otro día
      // Lógica adicional si es necesario
    }
  };

  //Logica boton today
  const handleTodayClick = () => {
    const today = new Date();
    setCurrentDate(today); // Establecer la fecha actual como la fecha actual
    setSelectedDate(today); // Establecer la fecha actual como la seleccionada
    setIsTodayActive(true); // Activar el estado del botón TODAY al hacer clic en él
  };

  //Logica de manejo de clases css
  useEffect(() => {
    // Cuando el componente se monta o cuando se cambia el estado de isTodayActive, aplicar la clase 'today' al día actual si isTodayActive es verdadero
    if (isTodayActive) {
      const todayElements = document.querySelectorAll('.today');
      todayElements.forEach(element => {
        element.classList.add('today');
      });
    }
  }, [isTodayActive]);

  // Función auxiliar para comparar fechas (ignorando la hora)
  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };


  const handleGotoButtonClick = () => {
    // Lógica para manejar el click en el botón "Go"...
    const [day, month, year] = inputDate.split('/');
    const newDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    setCurrentDate(newDate);
    setSelectedDate(newDate);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputDate(event.target.value);
  };


  const handleEventInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEventInput(event.target.value);
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

  const handleAddEventClick = () => {
    setIsAddEventActive(prevState => !prevState); // Cambia el estado del formulario de agregar evento
  };

  const handleCloseButtonClick = () => {
    setIsAddEventActive(false); // Cierra el formulario de agregar evento
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
              <div>Dom</div>
              <div>Lun</div>
              <div>Mar</div>
              <div>Mie</div>
              <div>Jue</div>
              <div>Vie</div>
              <div>Sab</div>
            </div>
            <div className="days">
              {generateDaysArray()}
            </div>
            <div className="goto-today">
              <div className="goto">
                <input
                  type="text"
                  placeholder="dd/mm/yyyy"
                  className="date-input"
                  value={inputDate}
                  onChange={handleInputChange}
                />
                <button className="goto-btn" onClick={handleGotoButtonClick}>Go</button>
              </div>
              <button className="today-btn" onClick={handleTodayClick}>Today</button>
            </div>
          </div>
        </div>
        <div className="right">
          <div className='today-date'>
            <div className='event-day'>{getDayOfWeek(currentDate)}</div>
            <div className='event-date'>{getCurrentDate(currentDate)}</div>
          </div>
          <div className={hasEvents ? 'events' : 'events no-event'}>
            {/* Contenido de los eventos o el mensaje "No Events" */}
            {hasEvents ? (
              /* Renderizar eventos */
              events.map((event, index) => (
                <div key={index}>
                  {/* Renderizar cada evento */}
                </div>
              ))
            ) : (
              /* Mostrar el mensaje "No Events" si no hay eventos */
              <div className="no-event">
                <h3>No Events</h3>
              </div>
            )}
          </div>
          <div className={isAddEventActive ? "add-event-wrapper-active" : "add-event-wrapper"}>
            <div className='add-event-header'>
              <div className='title'>Agregar Tarea</div>
              <i className='fas fa-times close' onClick={handleCloseButtonClick}></i>
            </div>
            <div className="add-event-body">
            <div className="add-event-input">
              <input type="text" placeholder="Event Name" className="event-name" />
            </div>
            <div className="add-event-input">
              <input
                type="text"
                placeholder="Event Time From"
                className="event-time-from"
              />
            </div>
            <div className="add-event-input">
              <input
                type="text"
                placeholder="Event Time To"
                className="event-time-to"
              />
            </div>
          </div>
            <div className='add-event-footer'>
              <button className='add-event-btn'>Add</button>
            </div>
          </div>
        </div>
        <button className="add-event" onClick={handleAddEventClick}>
          <i className="fas fa-plus"></i>
        </button>
      </div>
    </div>
  );
}

export default Calendar;
