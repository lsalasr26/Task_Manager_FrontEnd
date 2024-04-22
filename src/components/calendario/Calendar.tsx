import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Calendar.css';
import '@fortawesome/fontawesome-free/css/all.css';
import Swal from 'sweetalert2';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface Day {
  date: Date;
  isCurrentMonth: boolean;
}

interface Event {
  taskId: string;
  title: string;
  description: string;
  dueDate: Date;
  status: string;
  priority: string;
}

const Calendar: React.FC = () => {

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [isTodayActive, setIsTodayActive] = useState(false);
  const [inputDate, setInputDate] = useState('');
  const [isAddEventActive, setIsAddEventActive] = useState(false);
  const hasEvents = events.length > 0;
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState('');
  const [lastname, setLastName] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date>(new Date());
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');

  //ENDPOINTS//

  //Endpoint para extrar el id del usuario logueado y poder enviarlo en el POST de creación
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`https://task-manager-backend-serverless.azurewebsites.net/api/GetUser/${localStorage.getItem('email')}`);
        const userData = response.data;
        setUser(response.data);
        setName(userData.name);
        setLastName(userData.lastname)
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, []);

  const generateRandomId = () => {
    return Math.random().toString(36).substr(2, 9);
  }

  //Endpoint para creación de tareas
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !dueDate || !status || !priority) {
      Swal.fire({
        title: 'Error!',
        text: 'Completa todos los campos',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    try {
      const userId = user.id;
      const id = generateRandomId();
      const taskId = generateRandomId();

      const formattedDueDate = dueDate.toISOString();

      const response = await axios.post(`https://task-manager-backend-serverless.azurewebsites.net/api/CreateTask`, {
        id: id,
        taskId: taskId,
        userId: userId,
        title: title,
        description: description,
        dueDate: formattedDueDate,
        status: status,
        priority: priority
      });

      if (response && response.data) {
        if (response.data.title === title ||
          response.data.description === description ||
          response.data.dueDate === formattedDueDate ||
          response.data.status === status ||
          response.data.priority === priority
        ) {
          Swal.fire({
            title: 'Tarea Registrada',
            text: response.data.message,
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            window.location.reload();
          })
        } else {
          Swal.fire({
            title: 'Error',
            text: response.data.error,
            icon: 'error',
            confirmButtonText: 'Intentalo de nuevo'
          });
        }
      } else {
        console.error('No se recibió ninguna respuesta del servidor');
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Error',
        text: 'Ocurrió un error al registrar la tarea',
        icon: 'error',
        confirmButtonText: 'Intentar de nuevo'
      });
    }
  };

  //Endpoint para listar las tareas del usuario
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`https://task-manager-backend-serverless.azurewebsites.net/api/GetAllTasksByUserId/${localStorage.getItem('email')}`);
        if (response && response.data) {
          setEvents(response.data);
        } else {
          console.error('No se recibió ninguna respuesta válida del servidor');
        }
      } catch (error) {
        console.error('Error al obtener los eventos:', error);
      }
    };

    fetchEvents();
  }, []);

  //Endpoint para eliminar tareas registradas
  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await axios.delete(`https://task-manager-backend-serverless.azurewebsites.net/api/DeleteTask/${taskId}`);
      if (response && response.data) {
        // Filtrar las tareas para eliminar la tarea con el taskId especificado
        const updatedEvents = events.filter(event => event.taskId !== taskId);
        setEvents(updatedEvents);
  
        Swal.fire({
          title: 'Tarea Eliminada',
          text: response.data.message,
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          window.location.reload();
        });
      }
    } catch (error) {
      console.error('Error al eliminar la tarea:', error);
      Swal.fire({
        title: 'Error',
        text: 'Ocurrió un error al eliminar la tarea',
        icon: 'error',
        confirmButtonText: 'OK'
      }).then(() => {
        window.location.reload();
      });
    }
  };

  //ENDPOINTS//

  //MANEJO DE EVENTOS Y FUNCIONALIDADES//

  //Opciones de dias de la semana
  const getDayOfWeek = (date: Date) => {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return days[date.getDay()];
  };

  // Opciones de formato para mostrar solo día, mes y año
  const getCurrentDate = (date: Date) => {
    
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    };
    return date.toLocaleDateString('es-ES', options);
  };

  //Generación del arreglo para los dias del calendario.
  const generateDaysArray = () => {
    const daysArray: JSX.Element[] = [];
    const today = new Date();
    const currentMonth = currentDate.getMonth();

    //Obtiene las fechas para el calendario
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

    //Agrega los dias en la matriz de dias, y actualiza su estado segun la acción.
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
    // Si el día seleccionado y no pertenece al mes actual, redirige al mes correspondiente.
    if (selectedDay.getMonth() !== currentDate.getMonth()) {
      setCurrentDate(selectedDay);
      setIsTodayActive(false); // Desactivar el estado del botón TODAY al seleccionar otro día.
    }
    if (selectedDate && isSameDay(selectedDate, selectedDay)) {
      // Si el día ya estaba seleccionado, se quita.
      setEvents(prevEvents => prevEvents.filter(event => !isSameDay(event.dueDate, selectedDay)));
      setSelectedDate(null);
    } else {
      // Quita la clase 'today' del día actual si está presente.
      const todayElements = document.querySelectorAll('.today');
      todayElements.forEach(element => {
        element.classList.remove('today');
      });
      // Si el día no estaba seleccionado, se marca.
      setSelectedDate(selectedDay);
      setIsTodayActive(false); // Desactiva el estado del botón TODAY al seleccionar otro día.
    }
  };

  //Logica boton today
  const handleTodayClick = () => {
    const today = new Date();
    setCurrentDate(today); // Establece la fecha actual como la fecha actual.
    setSelectedDate(today); // Establece la fecha actual como la seleccionada.
    setIsTodayActive(true); // Activa el estado del botón TODAY al hacer clic.
  };

  //Logica de manejo de clases css
  useEffect(() => {
    // Cuando el componente se monta o cuando se cambia el estado de isTodayActive, aplica la clase 'today' al día actual si isTodayActive es verdadero.
    if (isTodayActive) {
      const todayElements = document.querySelectorAll('.today');
      todayElements.forEach(element => {
        element.classList.add('today');
      });
    }
  }, [isTodayActive]);

  // Función auxiliar para comparar fechas (ignora la hora)
  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  // Lógica para manejar el click en el botón Go.
  const handleGotoButtonClick = () => {
    const [day, month, year] = inputDate.split('/');
    const newDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    setCurrentDate(newDate);
    setSelectedDate(newDate);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputDate(event.target.value);
  };

  //Maneja el mes previo al que estamos.
  const prevMonth = () => {
    setCurrentDate(prevDate => {
      const prevMonthDate = new Date(prevDate.getFullYear(), prevDate.getMonth() - 1);
      return prevMonthDate;
    });
  };

  //Maneja el mes proximo al que estamos
  const nextMonth = () => {
    setCurrentDate(prevDate => {
      const nextMonthDate = new Date(prevDate.getFullYear(), prevDate.getMonth() + 1);
      return nextMonthDate;
    });
  };

  // Cambia el estado del formulario de agregar evento
  const handleAddEventClick = () => {
    setIsAddEventActive(prevState => !prevState); 
  };

  // Cierra el formulario de agregar evento
  const handleCloseButtonClick = () => {
    setIsAddEventActive(false); 
  };

  //Redirecciona el calendario al perfil del usuario.
  const handlePerfilRedirect = () => {
    navigate('/perfil');
  };

  //Hace logout de la app.
  const handleLoginRedirect = () => {
    navigate('/login');
  };

  //MANEJO DE EVENTOS Y FUNCIONALIDADES//

  //Estructura HTML del calendario.
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
                <button className="goto-btn" onClick={handleGotoButtonClick}>Ir</button>
              </div>
              <button className="today-btn" onClick={handleTodayClick}>Hoy</button>
              <button onClick={handlePerfilRedirect}>
                <i className="fa-solid fa-user"></i>
              </button>
              <button onClick={handleLoginRedirect}>
                <i className="fa-solid fa-right-from-bracket"></i>
              </button>
            </div>
          </div>
        </div>
        <div className="right">
          <div className='userName'>
            <h2>{name} {lastname}</h2>
          </div>
          <div className='today-date'>
            <div className='event-day'>{getDayOfWeek(currentDate)}</div>
            <div className='event-date'>{getCurrentDate(currentDate)}</div>
          </div>
          <div className={hasEvents ? 'events' : 'events no-event'}>
            {hasEvents ? (
              events.map((event, index) => (
                <div key={index} className="event">
                  <div className="title">
                    <i className="fas fa-circle"></i>
                    <h3 className='event-title'>{event.title} : {event.description}</h3>
                  </div>
                  <div className='event-time'>
                    <span>Estado: {event.status} - Prioridad: {event.priority}</span>
                  </div>
                  <div className='event-time'>
                    <span>{event.dueDate.toLocaleString()}</span>
                  </div>
                  <button className="delete-event" onClick={() => handleDeleteTask(event.taskId)}>
                    <i className="fa-solid fa-delete-left"></i>
                  </button>
                </div>
              ))
            ) : (
              <div className="no-event">
                <h3>No Hay Tareas</h3>
              </div>
            )}
          </div>
          <div className={isAddEventActive ? "add-event-wrapper-active" : "add-event-wrapper"}>
            <div className='add-event-header'>
              <div className='title'>Agregar Tarea</div>
              <i className='fas fa-times close' onClick={handleCloseButtonClick}></i>
            </div>
            <form onSubmit={handleCreateTask}>
              <div className="add-event-body">
                <div className="add-event-input">
                  <input
                    type='text'
                    placeholder='Nombre de la tarea'
                    className='event-name'
                    id='title'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    aria-describedby='titleHelp'
                  />
                </div>
                <div className='add-event-input'>
                  <input
                    type='text'
                    placeholder='Descripción'
                    className='event-name'
                    id='description'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    aria-describedby='descriptionHelp'
                  />
                </div>
                <div className='add-event-input'>
                  <DatePicker
                    selected={dueDate}
                    onChange={(date) => setDueDate(date || new Date())}
                    showTimeInput
                    dateFormat="yyyy-MM-dd'T'HH:mm:ss"
                  />
                </div>
                <div className='add-event-input'>
                  <input
                    type='text'
                    placeholder='Estado'
                    className='event-name'
                    id='status'
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  />
                </div>
                <div className='add-event-input'>
                  <input
                    type='text'
                    placeholder='Prioridad'
                    className='event-name'
                    id='priority'
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  />
                </div>
              </div>
              <div className='add-event-footer'>
                <button type="submit" className='add-event-btn'>Agregar</button>
              </div>
            </form>
          </div>
          <button className="add-event" onClick={handleAddEventClick}>
            <i className="fas fa-plus"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Calendar;
