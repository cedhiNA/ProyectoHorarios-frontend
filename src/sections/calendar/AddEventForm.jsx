import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import DialogTitle from '@mui/material/DialogTitle';
import ListItemText from '@mui/material/ListItemText';
import OutlinedInput from '@mui/material/OutlinedInput';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FormHelperText from '@mui/material/FormHelperText';
import { LocalizationProvider } from '@mui/x-date-pickers';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third-party
import _ from 'lodash';
import * as Yup from 'yup';
import { FieldArray, useFormik, Form, FormikProvider } from 'formik';

// project-imports
import IconButton from '../../components/@extended/IconButton';
import CircularWithPath from '../../components/@extended/progress/CircularWithPath';
import { useGetUnidadDidactica } from '../../api/unidadDidactica';
import { useGetAulas } from '../../api/aula';
import { openSnackbar } from '../../api/snackbar';
import { insertSesiones, updateSesiones } from '../../api/sesiones';
import { deleteSesiones } from '../../api/sesiones';
// import { createEvent, updateEvent, deleteEvent } from 'api/calender';

// assets
import { Trash } from 'iconsax-react';

// constant
const getInitialValues = (classSession) => {
  const newClassSession = {
    unidad_didactica: '',
    horario: []
  };

  if (classSession) {
    return _.merge({}, newClassSession, classSession);
  }

  return newClassSession;
};

const allDays = [
  { value: 'lunes', label: 'Lunes' },
  { value: 'martes', label: 'Martes' },
  { value: 'miercoles', label: 'Miércoles' },
  { value: 'jueves', label: 'Jueves' },
  { value: 'viernes', label: 'Viernes' },
  { value: 'sabado', label: 'Sabado' },
  { value: 'domingo', label: 'Domingo' }
];

// ==============================|| CALENDAR - EVENT ADD / EDIT / DELETE ||============================== //

export default function AddEventFrom({ classSession, onCancel, modalCallback }) {
  const { unidadesDidacticasLoading: loadingUnidadDidactica, unidadesDidacticas: listsUnidadDidactica } = useGetUnidadDidactica();
  const { aulasLoading: loadingAulas, aulas: listsAulas } = useGetAulas();

  const [loading, setLoading] = useState(true);
  const [selectedUnidad, setSelectedUnidad] = useState(classSession);

  useEffect(() => {
    setLoading(false);
  }, []);

  const isCreating = !classSession;

  const ClassSessionSchema = Yup.object().shape({
    unidad_didactica: Yup.string().max(255).required('La unidad es obligatorio')
  });

  const deleteHandler = async () => {
    await deleteSesiones(classSession?.id);
    openSnackbar({
      open: true,
      message: 'Sesión eliminada exitosamente.',
      anchorOrigin: { vertical: 'top', horizontal: 'right' },
      variant: 'alert',

      alert: {
        color: 'success'
      }
    });
    modalCallback(false);
  };

  const formik = useFormik({
    initialValues: getInitialValues(classSession),
    validationSchema: ClassSessionSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        let newClassSession = values;
        if (classSession) {
          updateSesiones(classSession.sesion_academica_id, newClassSession).then(() => {
            openSnackbar({
              open: true,
              message: 'La sesion fue acualizada con éxito.',
              variant: 'alert',
              alert: {
                color: 'success'
              }
            });
            setSubmitting(false);
          });
          modalCallback(false);
        } else {
          await insertSesiones(newClassSession).then(() => {
            openSnackbar({
              open: true,
              message: 'La sesión fue agregada con éxito.',
              variant: 'alert',
              alert: {
                color: 'success'
              }
            });
            setSubmitting(false);
          });
          modalCallback(false);
        }

        setSubmitting(false);
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

  const { values, errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue } = formik;

  // Manejar el cambio de unidadDidactica
  const handleUnidadChange = (event) => {
    const unidadSeleccionada = listsUnidadDidactica.find((unidad) => unidad.unidad_didactica === event.target.value);
    setFieldValue('unidad_didactica', event.target.value);
    setSelectedUnidad(unidadSeleccionada || null); // Actualizar los datos de la unidad seleccionada
  };

  if (loading)
    return (
      <Box sx={{ p: 5 }}>
        <Stack direction="row" justifyContent="center">
          <CircularWithPath />
        </Stack>
      </Box>
    );

  return (
    <FormikProvider value={formik}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <DialogTitle>{classSession ? 'Editar Sesión Académica' : 'Nueva Sesión Académica'}</DialogTitle>
          <Divider />
          <DialogContent sx={{ p: 2.5 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="teachingUnit-unidadDidactica">Unidad Didáctica</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      id="column-hiding-unidadDidactica"
                      displayEmpty
                      {...getFieldProps('unidad_didactica')}
                      onChange={handleUnidadChange}
                      input={<OutlinedInput id="select-column-hiding-unidadDidactica" placeholder="Sort by" />}
                      renderValue={(selected) => {
                        if (loadingUnidadDidactica) {
                          return <Typography variant="subtitle2">Cargando unidades...</Typography>;
                        }

                        if (!selected) {
                          return <Typography variant="subtitle2">Seleccionar unidad</Typography>;
                        }

                        return <Typography variant="subtitle2">{selected}</Typography>;
                      }}
                    >
                      {loadingUnidadDidactica ? (
                        <MenuItem disabled>
                          <ListItemText primary="Cargando unidades..." />
                        </MenuItem>
                      ) : (
                        listsUnidadDidactica?.map((unidad) => (
                          <MenuItem key={unidad.unidad_id} value={unidad.unidad_didactica}>
                            <ListItemText primary={unidad.unidad_didactica} />
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  </FormControl>
                  {touched.unidad_didactica && errors.unidad_didactica && (
                    <FormHelperText error id="standard-weight-helper-text-email-login-unidadDidactica" sx={{ pl: 1.75 }}>
                      {errors.unidad_didactica}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="classSession-tipo_curso">Tipo de Curso</InputLabel>
                  <TextField
                    fullWidth
                    id="classSession-tipo_curso"
                    value={selectedUnidad?.tipo_curso || ''}
                    InputProps={{
                      readOnly: true
                    }}
                  />
                </Stack>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="classSession-profesor_principal">Docente Principal</InputLabel>
                  <TextField
                    fullWidth
                    id="classSession-profesor_principal"
                    value={selectedUnidad?.profesor_principal || ''}
                    InputProps={{
                      readOnly: true
                    }}
                  />
                </Stack>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="classSession-profesor_apoyo">Docente de Apoyo</InputLabel>
                  <TextField
                    fullWidth
                    id="classSession-profesor_apoyo"
                    value={selectedUnidad?.profesor_apoyo || ''}
                    InputProps={{
                      readOnly: true
                    }}
                  />
                </Stack>
              </Grid>

              <Grid item xs={12}>
                <Stack spacing={1}>
                  <Typography variant="h6">Horario</Typography>
                  <FieldArray
                    name="horario"
                    render={(arrayHelpers) => (
                      <>
                        {values.horario.map((item, index) => (
                          <Grid container spacing={1} key={index}>
                            <Grid item xs={12} sm={3}>
                              <Stack spacing={1}>
                                <FormControl fullWidth>
                                  <InputLabel id={`aula-label-${index}`}>Aula</InputLabel>
                                  <Select
                                    labelId={`aula-label-${index}`}
                                    id={`aula-${index}`}
                                    displayEmpty
                                    value={item.aula}
                                    onChange={(e) => setFieldValue(`horario.${index}.aula`, e.target.value)}
                                    input={<OutlinedInput id="select-column-hiding-aula" placeholder="Sort by" />}
                                    renderValue={(selected) => {
                                      if (loadingAulas) {
                                        return <Typography variant="subtitle2">Cargando...</Typography>;
                                      }

                                      if (!selected) {
                                        return <Typography variant="subtitle2"> </Typography>;
                                      }

                                      return <Typography variant="subtitle2">{selected}</Typography>;
                                    }}
                                  >
                                    {loadingAulas ? (
                                      <MenuItem disabled>
                                        <ListItemText primary="Cargando unidades..." />
                                      </MenuItem>
                                    ) : (
                                      listsAulas?.map((aula) => (
                                        <MenuItem key={aula.aula_id} value={aula.nombre}>
                                          <ListItemText primary={aula.nombre} />
                                        </MenuItem>
                                      ))
                                    )}
                                  </Select>
                                </FormControl>
                                {touched.aula && errors.aula && (
                                  <FormHelperText error id="standard-weight-helper-text-email-login-aula" sx={{ pl: 1.75 }}>
                                    {errors.aula}
                                  </FormHelperText>
                                )}
                              </Stack>
                            </Grid>

                            <Grid item xs={12} sm={2}>
                              <FormControl fullWidth>
                                <InputLabel id={`day-label-${index}`}>Día</InputLabel>
                                <Select
                                  labelId={`day-label-${index}`}
                                  id={`day-${index}`}
                                  value={item.dia}
                                  onChange={(e) => setFieldValue(`horario.${index}.dia`, e.target.value)}
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
                                value={item.hora_inicio}
                                onChange={(e) => setFieldValue(`horario.${index}.hora_inicio`, e.target.value)}
                              />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                              <TextField
                                fullWidth
                                type="time"
                                label="Hora Fin"
                                InputLabelProps={{ shrink: true }}
                                value={item.hora_fin}
                                onChange={(e) => setFieldValue(`horario.${index}.hora_fin`, e.target.value)}
                              />
                            </Grid>
                            <Grid item xs={12} sm={1}>
                              {/* <Button variant="outlined" color="error" onClick={() => arrayHelpers.remove(index)}>
                                Eliminar
                              </Button> */}
                              <Tooltip title="Eliminar" placement="top">
                                <IconButton onClick={() => arrayHelpers.remove(index)} size="large" color="error">
                                  <Trash variant="Bold" />
                                </IconButton>
                              </Tooltip>
                            </Grid>
                          </Grid>
                        ))}
                        <Button
                          variant="contained"
                          onClick={() => arrayHelpers.push({ aula: '', dia: '', hora_inicio: '', hora_fin: '' })}
                          sx={{ mt: 2 }}
                        >
                          Agregar horario
                        </Button>
                      </>
                    )}
                  />
                </Stack>
              </Grid>
            </Grid>
          </DialogContent>
          <Divider />
          <DialogActions sx={{ p: 2.5 }}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item>
                {!isCreating && (
                  <Tooltip title="Eliminar Sesión" placement="top">
                    <IconButton onClick={deleteHandler} size="large" color="error">
                      <Trash variant="Bold" />
                    </IconButton>
                  </Tooltip>
                )}
              </Grid>
              <Grid item>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Button color="error" onClick={onCancel}>
                    Cancelar
                  </Button>
                  <Button type="submit" variant="contained" disabled={isSubmitting}>
                    {classSession ? 'Editar' : 'Agregar'}
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </DialogActions>
        </Form>
      </LocalizationProvider>
    </FormikProvider>
  );
}

AddEventFrom.propTypes = { classSession: PropTypes.any, onCancel: PropTypes.func, modalCallback: PropTypes.func };
