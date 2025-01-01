import { useEffect, useRef, useState } from 'react';
import { addDays, startOfMonth } from 'date-fns';

import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import SpeedDial from '@mui/material/SpeedDial';
import Typography from '@mui/material/Typography';

// third-party
import FullCalendar from '@fullcalendar/react';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import esLocale from '@fullcalendar/core/locales/es';

// project imports
import { PopupTransition } from '../../components/@extended/Transitions';
import CalendarStyled from '../../sections/calendar/CalendarStyled';
import Toolbar from '../../sections/calendar/Toolbar';
import useConfig from '../../hooks/useConfig';
import AddEventForm from '../../sections/calendar/AddEventForm';

import { useGetSesiones } from '../../api/sesiones';


// assets
import { Add } from 'iconsax-react';


// Función para convertir el horario en eventos del calendario
const convertScheduleToEvents = (scheduleClassList) => {
  const events = [];
  
  // Determinamos el inicio de la semana actual (lunes)
  const today = new Date();
  //const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 }); // 1 = lunes
  const startOfCurrentMonth = startOfMonth(today);
  
  scheduleClassList.forEach((classItem) => {
    classItem.horario.forEach((session, sessionIndex) => {
      // Generamos los eventos para cada semana del mes actual
      const startDates = getStartDatesForMonth(session.dia, startOfCurrentMonth); // Obtenemos fechas para cada semana

      startDates.forEach((startDate, weekIndex) => {
        const startTime = session.hora_inicio;  // Asegúrate de que esto esté en formato 'HH:mm'
        const endTime = session.hora_fin;      // Asegúrate de que esto esté en formato 'HH:mm'

        // Verificamos si startTime y endTime son válidos
        if (!isValidTime(startTime) || !isValidTime(endTime)) {
          console.error('Invalid time value:', startTime, endTime);
          return; // Ignoramos este evento si la hora es inválida
        }

        // Creamos un objeto de evento para cada sesión y semana
        const event = {
          id: `${classItem.sesion_academica_id}-${sessionIndex}-${weekIndex}`, // Un ID único usando índices
          title: `${classItem.unidad_didactica} - ${classItem.profesor_principal}`, // Título del evento
          start: createEventDate(startDate, startTime), // Fecha de inicio con hora
          end: createEventDate(startDate, endTime), // Fecha de fin con hora
          description: `Profesor: ${classItem.profesor_principal}`, // Descripción del evento
          allDay: false, // El evento no es todo el día
          color: classItem.color,

          extendedProps: {
            id: classItem.sesion_academica_id,
            unidad_didactica: classItem.unidad_didactica,
            tipo_curso: classItem.tipo_curso,
            profesor_principal: classItem.profesor_principal,
            profesor_apoyo: classItem.profesor_apoyo,
            aula: session.aula, 
            horario: classItem.horario
          },
        };

        events.push(event);
      });
    });
  });

  return events;
};

// Función para obtener las fechas de inicio de las 4 semanas del mes actual para un día específico
const getStartDatesForMonth = (dia, startOfCurrentMonth) => {
  const daysOfWeek = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
  const dayIndex = daysOfWeek.indexOf(dia.toLowerCase());

  const startDates = [];
  for (let weekOffset = 0; weekOffset < 4; weekOffset++) {
    const startOfWeek = addDays(startOfCurrentMonth, weekOffset * 7); // Inicio de cada semana
    const startDate = addDays(startOfWeek, dayIndex); // Fecha del día correspondiente en esa semana
    startDates.push(startDate);
  }

  return startDates;
};

// Función para verificar si el tiempo es válido
const isValidTime = (time) => {
  const timeRegex = /^([0-9]{2}):([0-9]{2})$/;  // Formato 'HH:mm'
  return timeRegex.test(time);
};

// Función para analizar las horas y minutos de una cadena 'HH:mm'
const parseTime = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return [hours, minutes];
};

// Función para crear la fecha completa con hora (fecha + hora)
const createEventDate = (date, time) => {
  const [hours, minutes] = parseTime(time);
  const eventDate = new Date(date);  // Creamos una nueva instancia de la fecha base
  eventDate.setHours(hours, minutes, 0, 0);  // Asignamos las horas y minutos
  return eventDate;
};

// ==============================|| CALENDAR - MAIN ||============================== //

export default function Calendar() {

  const { scheduleClassLoading: loadingSesiones, scheduleClass: listSesiones } = useGetSesiones();

  const { i18n } = useConfig();
  const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState();
  const [calendarView, setCalendarView] = useState();
  const [date, setDate] = useState(new Date());
  const [selectedRange, setSelectedRange] = useState(null);
  const calendarRef = useRef(null);


  useEffect(() => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      const newView = matchDownSM ? 'listWeek' : 'dayGridMonth';
      calendarApi.changeView(newView);
      setCalendarView(newView);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchDownSM]);

  // calendar toolbar events
  const handleDateToday = () => {
    const calendarEl = calendarRef.current;

    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.today();
      setDate(calendarApi.getDate());
    }
  };

  const handleViewChange = (newView) => {
    const calendarEl = calendarRef.current;

    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.changeView(newView);
      setCalendarView(newView);
    }
  };

  const handleDatePrev = () => {
    const calendarEl = calendarRef.current;

    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.prev();
      setDate(calendarApi.getDate());
    }
  };

  const handleDateNext = () => {
    const calendarEl = calendarRef.current;

    if (calendarEl) {
      const calendarApi = calendarEl.getApi();

      calendarApi.next();
      setDate(calendarApi.getDate());
    }
  };

  // calendar events
  const handleRangeSelect = (arg) => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.unselect();
    }

    setSelectedRange({ start: arg.start, end: arg.end });
    setModalOpen(true);
  };

  const handleEventSelect = (arg) => {
    if (arg?.event?.id) {
      const event = convertScheduleToEvents(listSesiones).find((event) => event.id === arg.event.id);
      setSelectedEvent(event);
    }

    setModalOpen(true);
  };

  // const handleEventUpdate = async ({ event }) => {
  //   await updateEvent(event.id, {
  //     allDay: event.allDay,
  //     start: event.start,
  //     end: event.end
  //   });
  //   setModalOpen(true);
  // };

  const modalCallback = (openModal) => {
    // open/close modal based on dialog state
    if (isModalOpen) {
      setSelectedEvent(undefined);
    }
    setModalOpen(openModal);
  };

  const handleModal = () => {
    if (isModalOpen) {
      setSelectedEvent(undefined);
    }
    setModalOpen(!isModalOpen);
  };

  return (
    <Box sx={{ position: 'relative' }}>
    <CalendarStyled>
      <Toolbar
        date={date}
        view={calendarView}
        onClickNext={handleDateNext}
        onClickPrev={handleDatePrev}
        onClickToday={handleDateToday}
        onChangeView={handleViewChange}
      />

      {loadingSesiones ? (
        <Typography variant="subtitle2">Cargando datos...</Typography>
      ) : (
        <FullCalendar
          locales={i18n === 'es' ? [esLocale] : ''}
          locale={i18n === 'es' ? 'es' : 'en'}
          weekends
          editable
          droppable
          selectable
          events={convertScheduleToEvents(listSesiones)}
          ref={calendarRef}
          rerenderDelay={10}
          initialDate={date}
          initialView={calendarView}
          dayMaxEventRows={3}
          eventDisplay="block"
          headerToolbar={false}
          allDayMaintainDuration
          eventResizableFromStart
          select={handleRangeSelect}
          // eventDrop={handleEventUpdate}
          eventClick={handleEventSelect}
          // eventResize={handleEventUpdate}
          height={matchDownSM ? 'auto' : 720}
          plugins={[listPlugin, dayGridPlugin, timelinePlugin, timeGridPlugin, interactionPlugin]}
        />
      )}
    </CalendarStyled>

    {/* Dialog renders its body even if not open */}
    <Dialog
      maxWidth="sm"
      TransitionComponent={PopupTransition}
      fullWidth
      onClose={handleModal}
      open={isModalOpen}
      sx={{ '& .MuiDialog-paper': { p: 0, bgcolor: 'secondary.lighter' } }}
    >
      <AddEventForm
        modalCallback={modalCallback}
        classSession={selectedEvent?.extendedProps}
        onCancel={handleModal}
      />
    </Dialog>
    <Tooltip title="Add New Event">
      <SpeedDial
        ariaLabel="add-event-fab"
        sx={{
          display: 'inline-flex',
          position: 'sticky',
          bottom: 24,
          left: '100%',
          transform: 'translate(-50%, -50%)',
        }}
        icon={<Add />}
        onClick={handleModal}
      />
    </Tooltip>
  </Box>
  );
}
