const scheduleClassList = {
  scheduleClass: [
    {
      id: 1,
      unidadDidactica: 'Negociación Empresarial',
      horario: [
        {
          dia: 'lunes',
          hora_inicio: '08:00',
          hora_fin: '10:00',
          aula: 'Aul-003',
          tipoAula: 'Aula',
          formatoAula: 'practico',
        },
        {
          dia: 'viernes',
          hora_inicio: '12:00',
          hora_fin: '14:00',
          aula: 'Aul-002',
          tipoAula: 'aula',
          formatoAula: 'practico',
        }
      ],
      sede: 'principal',
      tipo_curso: 'practico',
      PeriodoClases: '2024-02',
      seccion: 'A',
      semestre: 3,
      programaEstudios: 'Administración de Empresas',
      profesor_principal: 'Barney Thea',
      profesor_apoyo: 'Alice Smith',
      color: '#f5222d',
      flagCruce: false
    },

    {
      id: 2,
      unidadDidactica: 'Comportamiento Organizacional',
      horario: [
        {
          dia: 'lunes',
          hora_inicio: '06:00',
          hora_fin: '08:00',
          aula: 'Aul-003',
          tipoAula: 'aula',
          formatoAula: 'practico',
        },
        {
          dia: 'miercoles',
          hora_inicio: '14:00',
          hora_fin: '16:00',
          aula: 'Aul-004',
          tipoAula: 'aula',
          formatoAula: 'practico',
        }
      ],
      sede: 'principal',
      tipo_curso: 'practico',
      PeriodoClases: '2024-02',
      seccion: 'A',
      semestre: 3,
      programaEstudios: 'Administración de Empresas',
      profesor_principal: 'Alice Smith',
      profesor_apoyo: 'Linda Garcia',
      color: '#52c41a',
      flagCruce: false
    }
  ],
  scheduleClassEmpty: false,
  scheduleClassError: undefined,
  scheduleClassLoading: false,
  scheduleClassValidating: false
};

export default scheduleClassList;
