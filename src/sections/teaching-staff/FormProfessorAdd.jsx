import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material ui
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import RadioGroup from '@mui/material/RadioGroup';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';
import ListItemText from '@mui/material/ListItemText';
import DialogContent from '@mui/material/DialogContent';
import OutlinedInput from '@mui/material/OutlinedInput';
import DialogActions from '@mui/material/DialogActions';
import FormHelperText from '@mui/material/FormHelperText';
import FormControlLabel from '@mui/material/FormControlLabel';
import Select from '@mui/material/Select';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third party
import _ from 'lodash';
import * as Yup from 'yup';
import { FieldArray, useFormik, Form, FormikProvider } from 'formik';

// project imports
import AlertProfessorDelete from './AlertProfessorDelete';
import IconButton from '../../components/@extended/IconButton';
import CircularWithPath from '../../components/@extended/progress/CircularWithPath';
import { insertProfesor, updateProfesor } from '../../api/profesores';
import { Gender } from '../../config';
import { useGetCursos } from '../../api/cursos';
import { openSnackbar } from '../../api/snackbar';

// assets
import { Trash, CloseCircle } from 'iconsax-react';

// CONSTANT
const getInitialValues = (professor) => {
  const newProfessor = {
    nombres: '',
    email: '',
    contacto: '',
    edad: 18,
    status: 'Laborando',
    especialidad: [],
    genero: Gender.MALE,
    jornada: 'parcial',
    prioridad: 10,
    disponibilidad: [] // Aquí se inicializa
  };

  if (professor) {
    return _.merge({}, newProfessor, professor);
  }

  return newProfessor;
};

const allStatus = [
  { value: 'Laborando', label: 'Laborando' },
  { value: 'Licencia', label: 'Licencia' }
];

const allJornadas = [
  { value: 'parcial', label: 'Parcial' },
  { value: 'completo', label: 'Completo' }
];

const allDays = [
  { value: 'lunes', label: 'Lunes' },
  { value: 'martes', label: 'Martes' },
  { value: 'miercoles', label: 'Miercoles' },
  { value: 'jueves', label: 'Jueves' },
  { value: 'viernes', label: 'Viernes' },
  { value: 'sábado', label: 'Sábado' },
  { value: 'domingo', label: 'Domingo' }
];

// ==============================|| PROFESSOR ADD / EDIT - FORM ||============================== //

export default function FormProfessorAdd({ professor, closeModal }) {
  const { cursosLoading: loadingCursos, cursos: listCursos } = useGetCursos();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const ProfessorSchema = Yup.object().shape({
    nombres: Yup.string().max(255).required('El nombre es obligatorio'),
    email: Yup.string().max(255).required('Email is required').email('Must be a valid email'),
    contacto: Yup.string().max(255).required('El número es oligatorio'),
    edad: Yup.number().required('La edad es obligatorio'),
    status: Yup.string().max(255).required('El estado es obligatorio'),
    genero: Yup.string().max(255).required('El genero es obligatorio'),
    jornada: Yup.string().max(255).required('La jornada es obligatorio'),
    prioridad: Yup.number()
      .required('La prioridad es obligatorio')
      .min(1, 'Debe ser mayor o igual a 1')
      .max(50, 'Debe ser menor o igual a 50')
  });

  const [openAlert, setOpenAlert] = useState(false);

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
    closeModal();
  };

  const formik = useFormik({
    initialValues: getInitialValues(professor),
    validationSchema: ProfessorSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        let newProfessor = values;
        if (professor) {
          updateProfesor(professor.profesor_id, newProfessor).then(() => {
            openSnackbar({
              open: true,
              message: 'Docente actualizado exitosamente.',
              variant: 'alert',

              alert: {
                color: 'success'
              }
            });
            setSubmitting(false);
            closeModal();
          });
        } else {
          await insertProfesor(newProfessor).then(() => {
            openSnackbar({
              open: true,
              message: 'Docente añadido con éxito.',
              variant: 'alert',

              alert: {
                color: 'success'
              }
            });
            setSubmitting(false);
            closeModal();
          });
        }
      } catch (error) {
        console.error(error);
        openSnackbar({
          open: true,
          message: 'Ocurrió un error inesperado. Por favor, inténtelo nuevamente.',
          variant: 'alert',
          alert: { color: 'error' }
        });
      }
    }
  });

  const { errors, touched, handleSubmit, values, isSubmitting, getFieldProps, setFieldValue } = formik;

  if (loading)
    return (
      <Box sx={{ p: 5 }}>
        <Stack direction="row" justifyContent="center">
          <CircularWithPath />
        </Stack>
      </Box>
    );

  return (
    <>
      <FormikProvider value={formik}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <DialogTitle>{professor ? 'Editar Docente' : 'Nuevo Docente'}</DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 2.5 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="professor-nombres">Nombres*</InputLabel>
                        <TextField
                          fullWidth
                          id="professor-nombres"
                          placeholder="Introduzca el nombre"
                          {...getFieldProps('nombres')}
                          onChange={(e) => {
                            // Convertimos el valor a mayúsculas y lo actualizamos en Formik
                            const uppercaseValue = e.target.value.toUpperCase();
                            setFieldValue('nombres', uppercaseValue); // Esta función de Formik actualiza el valor internamente
                          }}
                          error={Boolean(touched.nombres && errors.nombres)}
                          helperText={touched.nombres && errors.nombres}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="professor-edad">Edad*</InputLabel>
                        <TextField
                          type="number"
                          fullWidth
                          id="professor-edad"
                          placeholder="Introducir edad"
                          {...getFieldProps('edad')}
                          error={Boolean(touched.edad && errors.edad)}
                          helperText={touched.edad && errors.edad}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="professor-genero">Genero*</InputLabel>
                        <RadioGroup row aria-label="payment-card" {...getFieldProps('genero')}>
                          <FormControlLabel control={<Radio value={Gender.FEMALE} />} label={Gender.FEMALE} />
                          <FormControlLabel control={<Radio value={Gender.MALE} />} label={Gender.MALE} />
                        </RadioGroup>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="professor-email">Email*</InputLabel>
                        <TextField
                          fullWidth
                          id="professor-email"
                          placeholder="Introduzca el correo electrónico"
                          {...getFieldProps('email')}
                          error={Boolean(touched.email && errors.email)}
                          helperText={touched.email && errors.email}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="professor-contacto">Número de Contacto*</InputLabel>
                        <TextField
                          fullWidth
                          id="professor-contacto"
                          placeholder="Introducir Número de Contacto"
                          {...getFieldProps('contacto')}
                          error={Boolean(touched.contacto && errors.contacto)}
                          helperText={touched.contacto && errors.contacto}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="professor-status">Estado*</InputLabel>
                        <FormControl fullWidth>
                          <Select
                            id="column-hiding"
                            displayEmpty
                            {...getFieldProps('status')}
                            onChange={(event) => setFieldValue('status', event.target.value)}
                            input={<OutlinedInput id="select-column-hiding-status" placeholder="Sort by" />}
                            renderValue={(selected) => {
                              if (!selected) {
                                return <Typography variant="subtitle2">Seleccionar estado</Typography>;
                              }

                              const selectedStatus = allStatus.filter((item) => item.value === selected);
                              return (
                                <Typography variant="subtitle2">
                                  {selectedStatus.length > 0 ? selectedStatus[0].label : 'Pendiente'}
                                </Typography>
                              );
                            }}
                          >
                            {allStatus.map((column) => (
                              <MenuItem key={column.value} value={column.value}>
                                <ListItemText primary={column.label} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {touched.status && errors.status && (
                          <FormHelperText error id="standard-weight-helper-text-email-login-status" sx={{ pl: 1.75 }}>
                            {errors.status}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="professor-jornada">Jornada*</InputLabel>
                        <FormControl fullWidth>
                          <Select
                            id="column-hiding-jornada"
                            displayEmpty
                            {...getFieldProps('jornada')}
                            onChange={(event) => setFieldValue('jornada', event.target.value)}
                            input={<OutlinedInput id="select-column-hiding-jornada" placeholder="Sort by" />}
                            renderValue={(selected) => {
                              if (!selected) {
                                return <Typography variant="subtitle2">Seleccionar jornada</Typography>;
                              }

                              const selectedJornada = allJornadas.filter((item) => item.value === selected);
                              return (
                                <Typography variant="subtitle2">
                                  {selectedJornada.length > 0 ? selectedJornada[0].label : 'Pendiente'}
                                </Typography>
                              );
                            }}
                          >
                            {allJornadas.map((column) => (
                              <MenuItem key={column.value} value={column.value}>
                                <ListItemText primary={column.label} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {touched.jornada && errors.jornada && (
                          <FormHelperText error id="standard-weight-helper-text-email-login-jornada" sx={{ pl: 1.75 }}>
                            {errors.jornada}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="professor-prioridad">Prioridad*</InputLabel>
                        <TextField
                          type="number"
                          fullWidth
                          id="professor-prioridad"
                          placeholder="Introducir prioridad"
                          {...getFieldProps('prioridad')}
                          error={Boolean(touched.prioridad && errors.prioridad)}
                          helperText={touched.prioridad && errors.prioridad}
                        />
                      </Stack>
                    </Grid>

                    <Grid item xs={12}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="customer-especialidad">Especialidad</InputLabel>
                        {loadingCursos ? (
                          <Typography variant="body2">Cargando cursos...</Typography>
                        ) : (
                          <Autocomplete
                            multiple
                            fullWidth
                            id="customer-especialidad"
                            options={listCursos?.map((curso) => curso.nombre) || []} // Usa solo los nombres como opciones
                            {...getFieldProps('especialidad')}
                            getOptionLabel={(option) => option || ''} // Muestra el nombre del curso
                            isOptionEqualToValue={(option, value) => option === value} // Compara nombres directamente
                            onChange={(event, newValue) => {
                              setFieldValue('especialidad', newValue); // Guarda solo los nombres seleccionados
                            }}
                            renderInput={(params) => <TextField {...params} name="especialidad" placeholder="Agregar cursos" />}
                            renderTags={(value, getTagProps) =>
                              value.map((option, index) => (
                                <Chip
                                  {...getTagProps({ index })}
                                  variant="combined"
                                  key={index}
                                  label={option}
                                  deleteIcon={<CloseCircle style={{ fontSize: '0.75rem' }} />}
                                  sx={{ color: 'text.primary' }}
                                />
                              ))
                            }
                          />
                        )}
                      </Stack>
                    </Grid>

                    <Grid item xs={12}>
                      <Stack spacing={1}>
                        <Typography variant="h6">Disponibilidad</Typography>
                        <FieldArray
                          name="disponibilidad"
                          render={(arrayHelpers) => (
                            <>
                              {values.disponibilidad.map((item, index) => (
                                <Grid container spacing={1} key={index}>
                                  <Grid item xs={12} sm={4}>
                                    <FormControl fullWidth>
                                      <InputLabel id={`day-label-${index}`}>Día</InputLabel>
                                      <Select
                                        labelId={`day-label-${index}`}
                                        id={`day-${index}`}
                                        value={item.dia}
                                        onChange={(e) => setFieldValue(`disponibilidad.${index}.dia`, e.target.value)}
                                      >
                                        {allDays.map((day) => (
                                          <MenuItem key={day.value} value={day.value}>
                                            {day.label}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                    </FormControl>
                                  </Grid>
                                  <Grid item xs={12} sm={3}>
                                    <TextField
                                      fullWidth
                                      type="time"
                                      label="Hora Inicio"
                                      InputLabelProps={{ shrink: true }}
                                      value={item.horaInicio}
                                      onChange={(e) => setFieldValue(`disponibilidad.${index}.horaInicio`, e.target.value)}
                                    />
                                  </Grid>
                                  <Grid item xs={12} sm={3}>
                                    <TextField
                                      fullWidth
                                      type="time"
                                      label="Hora Fin"
                                      InputLabelProps={{ shrink: true }}
                                      value={item.horaFin}
                                      onChange={(e) => setFieldValue(`disponibilidad.${index}.horaFin`, e.target.value)}
                                    />
                                  </Grid>
                                  <Grid item xs={12} sm={2}>
                                    <Button variant="outlined" color="error" onClick={() => arrayHelpers.remove(index)}>
                                      Eliminar
                                    </Button>
                                    {/* <Tooltip title="Eliminar Docente" placement="top">
                                      <IconButton onClick={() => arrayHelpers.remove(index)} size="large" color="error">
                                        <Trash variant="Bold" />
                                      </IconButton>
                                    </Tooltip> */}
                                  </Grid>
                                </Grid>
                              ))}
                              <Button
                                variant="contained"
                                onClick={() => arrayHelpers.push({ dia: '', horaInicio: '', horaFin: '' })}
                                sx={{ mt: 2 }}
                              >
                                Agregar Disponibilidad
                              </Button>
                            </>
                          )}
                        />
                      </Stack>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </DialogContent>
            <Divider />
            <DialogActions sx={{ p: 2.5 }}>
              <Grid container justifyContent="space-between" alignItems="center">
                <Grid item>
                  {professor && (
                    <Tooltip title="Eliminar Docente" placement="top">
                      <IconButton onClick={() => setOpenAlert(true)} size="large" color="error">
                        <Trash variant="Bold" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Grid>
                <Grid item>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Button color="error" onClick={closeModal}>
                      Cancelar
                    </Button>
                    <Button type="submit" variant="contained" disabled={isSubmitting}>
                      {professor ? 'Editar' : 'Agregar'}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </DialogActions>
          </Form>
        </LocalizationProvider>
      </FormikProvider>
      {professor && (
        <AlertProfessorDelete
          id={professor.profesor_id}
          title={professor.profesor_id.toString()}
          open={openAlert}
          handleClose={handleAlertClose}
        />
      )}
    </>
  );
}

FormProfessorAdd.propTypes = { professor: PropTypes.any, closeModal: PropTypes.func };
