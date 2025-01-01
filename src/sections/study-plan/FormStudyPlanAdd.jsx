import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// material ui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import DialogContent from '@mui/material/DialogContent';
import OutlinedInput from '@mui/material/OutlinedInput';
import DialogActions from '@mui/material/DialogActions';
import FormHelperText from '@mui/material/FormHelperText';
import Select from '@mui/material/Select';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// third party
import _ from 'lodash';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';

// project imports
import AlertStudyPlanDelete from './AlertStudyPlanDelete';
import IconButton from '../../components/@extended/IconButton';
import CircularWithPath from '../../components/@extended/progress/CircularWithPath';
import { insertCurso, updateCurso } from '../../api/cursos';
import { openSnackbar } from '../../api/snackbar';

// assets
import { Trash } from 'iconsax-react';

// CONSTANT
const getInitialValues = (curso) => {
  const newCurso = {
    nombre: '',
    carrera: '',
    estado_curso: '',
    plan_estudios: '2024',
    semestre: '',
    creditos: 1,
    tipo_curso: '',
  };

  if (curso) {
    return _.merge({}, newCurso, curso);
  }

  return newCurso;
};

const allCarreras = [
  { value: 'Administracion_Empresas', label: 'Administración de Empresas' },
  { value: 'Gastronomia', label: 'Gastronomia' }
];

const allTypeClass = [
  { value: 'Teorico', label: 'Teórico' },
  { value: 'Practico', label: 'Práctico' },
  { value: 'Taller', label: 'Taller' },
  { value: 'Demostracion', label: 'Demostración' }
];

const allSemesters = [
  { value: 11, label: 'Prop.' }, // AQUI
  { value: 1, label: 'I' },
  { value: 2, label: 'II' },
  { value: 3, label: 'III' },
  { value: 4, label: 'IV' },
  { value: 5, label: 'V' },
  { value: 6, label: 'VI' },
  { value: 7, label: 'VII' },
  { value: 8, label: 'VIII' },
  { value: 9, label: 'IX' },
  { value: 10, label: 'X' }
];

const allPlans = [
  { value: 'Carrera', label: 'Carrera' },
  { value: 'Formativo', label: 'Formativo' }
];

// ==============================|| CURSO ADD / EDIT - FORM ||============================== //

export default function FormStudyPlanAdd({ curso, closeModal }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const CursoSchema = Yup.object().shape({
    nombre: Yup.string().max(255).required('El nombre del curso es obligatorio'),
    carrera: Yup.string().max(255).required('La carrera es obligatorio'),
    estado_curso: Yup.string().max(255).required('El plan es obligatorio'),
    plan_estudios: Yup.number()
      .required('El plan es obligatorio')
      .min(2000, 'Debe ser mayor o igual a 2000')
      .max(4000, 'Debe ser menor o igual a 4000'),
    semestre: Yup.number().required('El semestre es obligatorio'),
    creditos: Yup.number().required('El crédito es obligatorio'),
    tipo_curso: Yup.string().max(255).required('El tipo de curso es obligatorio'),
  });

  const [openAlert, setOpenAlert] = useState(false);

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
    closeModal();
  };

  const formik = useFormik({
    initialValues: getInitialValues(curso),
    validationSchema: CursoSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        let newCurso = values;

        if (curso) {
          updateCurso(curso.curso_id, newCurso).then(() => {
            openSnackbar({
              open: true,
              message: 'Curso actualizado exitosamente.',
              variant: 'alert',

              alert: {
                color: 'success'
              }
            });
            setSubmitting(false);
            closeModal();
          });
        } else {
          await insertCurso(newCurso).then(() => {
            openSnackbar({
              open: true,
              message: 'Curso añadido con éxito.',
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

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue } = formik;

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
            <DialogTitle>{curso ? 'Editar curso' : 'Nueva curso'}</DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 2.5 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="curso-nombreCurso">Curso*</InputLabel>
                        <TextField
                          fullWidth
                          id="curso-nombreCurso"
                          placeholder="Introduzca el nombre del curso"
                          {...getFieldProps('nombre')}
                          error={Boolean(touched.nombre && errors.nombre)}
                          helperText={touched.nombre && errors.nombre}
                        />
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="curso-carrera">Carrera*</InputLabel>
                        <FormControl fullWidth>
                          <Select
                            id="column-hiding"
                            displayEmpty
                            {...getFieldProps('carrera')}
                            onChange={(event) => setFieldValue('carrera', event.target.value)}
                            input={<OutlinedInput id="select-column-hiding-carrera" placeholder="Sort by" />}
                            renderValue={(selected) => {
                              if (!selected) {
                                return <Typography variant="subtitle2">Seleccione carrera</Typography>;
                              }

                              const selectedcategoria = allCarreras.filter((item) => item.value === selected);
                              return (
                                <Typography variant="subtitle2">
                                  {selectedcategoria.length > 0 ? selectedcategoria[0].label : 'Pendiente'}
                                </Typography>
                              );
                            }}
                          >
                            {allCarreras.map((column) => (
                              <MenuItem key={column.value} value={column.value}>
                                <ListItemText primary={column.label} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {touched.carrera && errors.carrera && (
                          <FormHelperText error id="standard-weight-helper-text-email-login-carrera" sx={{ pl: 1.75 }}>
                            {errors.carrera}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="curso-tipoCurso">Tipo de Curso*</InputLabel>
                        <FormControl fullWidth>
                          <Select
                            id="column-hiding-tipoCurso"
                            displayEmpty
                            {...getFieldProps('tipo_curso')}
                            onChange={(event) => setFieldValue('tipo_curso', event.target.value)}
                            input={<OutlinedInput id="select-column-hiding-tipoCurso" placeholder="Sort by" />}
                            renderValue={(selected) => {
                              if (!selected) {
                                return <Typography variant="subtitle2">Seleccione tipo de curso</Typography>;
                              }

                              const selectedtipoCurso = allTypeClass.filter((item) => item.value === selected);
                              return (
                                <Typography variant="subtitle2">
                                  {selectedtipoCurso.length > 0 ? selectedtipoCurso[0].label : 'Pendiente'}
                                </Typography>
                              );
                            }}
                          >
                            {allTypeClass.map((column) => (
                              <MenuItem key={column.value} value={column.value}>
                                <ListItemText primary={column.label} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {touched.tipo_curso && errors.tipo_curso && (
                          <FormHelperText error id="standard-weight-helper-text-email-login-tipoCurso" sx={{ pl: 1.75 }}>
                            {errors.tipo_curso}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>

                    <Grid item xs={12} sm={3}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="curso-estado_curso">Plan*</InputLabel>
                        <FormControl fullWidth>
                          <Select
                            id="column-hiding-estado_curso"
                            displayEmpty
                            {...getFieldProps('estado_curso')}
                            onChange={(event) => setFieldValue('estado_curso', event.target.value)}
                            input={<OutlinedInput id="select-column-hiding-estado_curso" placeholder="Sort by" />}
                            renderValue={(selected) => {
                              if (!selected) {
                                return <Typography variant="subtitle2">Seleccione plan</Typography>;
                              }

                              const selectedPlan = allPlans.filter((item) => item.value === selected);
                              return (
                                <Typography variant="subtitle2">{selectedPlan.length > 0 ? selectedPlan[0].label : 'Pendiente'}</Typography>
                              );
                            }}
                          >
                            {allPlans.map((column) => (
                              <MenuItem key={column.value} value={column.value}>
                                <ListItemText primary={column.label} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {touched.estado_curso && errors.estado_curso && (
                          <FormHelperText error id="standard-weight-helper-text-email-login-estado_curso" sx={{ pl: 1.75 }}>
                            {errors.estado_curso}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>

                    <Grid item xs={12} sm={3}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="curso-planEstudio">Plan de Estudios (Año)*</InputLabel>
                        <TextField
                          type="number"
                          fullWidth
                          id="curso-planEstudio"
                          placeholder="Introducir el plan"
                          {...getFieldProps('plan_estudios')}
                          error={Boolean(touched.plan_estudios && errors.plan_estudios)}
                          helperText={touched.plan_estudios && errors.plan_estudios}
                        />
                      </Stack>
                    </Grid>

                    <Grid item xs={12} sm={3}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="curso-semestre">Semestre*</InputLabel>
                        <FormControl fullWidth>
                          <Select
                            id="column-hiding-semestre"
                            displayEmpty
                            {...getFieldProps('semestre')}
                            onChange={(event) => setFieldValue('semestre', event.target.value)}
                            input={<OutlinedInput id="select-column-hiding-semestre" placeholder="Sort by" />}
                            renderValue={(selected) => {
                              if (!selected) {
                                return <Typography variant="subtitle2">Seleccionar el semestre</Typography>;
                              }

                              const selectedSemestre = allSemesters.filter((item) => item.value === selected);
                              return (
                                <Typography variant="subtitle2">
                                  {selectedSemestre.length > 0 ? selectedSemestre[0].label : 'Pendiente'}
                                </Typography>
                              );
                            }}
                          >
                            {allSemesters.map((column) => (
                              <MenuItem key={column.value} value={column.value}>
                                <ListItemText primary={column.label} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {touched.semestre && errors.semestre && (
                          <FormHelperText error id="standard-weight-helper-text-email-login-semestre" sx={{ pl: 1.75 }}>
                            {errors.semestre}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>

                    <Grid item xs={12} sm={3}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="curso-creditos">Créditos*</InputLabel>
                        <TextField
                          type="number"
                          fullWidth
                          id="curso-creditos"
                          placeholder="Introducir los creditos"
                          {...getFieldProps('creditos')}
                          error={Boolean(touched.creditos && errors.creditos)}
                          helperText={touched.creditos && errors.creditos}
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
                  {curso && (
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
                      {curso ? 'Editar' : 'Agregar'}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </DialogActions>
          </Form>
        </LocalizationProvider>
      </FormikProvider>
      {curso && (
        <AlertStudyPlanDelete id={curso.curso_id} cursoId={curso.curso_id.toString()} open={openAlert} handleClose={handleAlertClose} />
      )}
    </>
  );
}

FormStudyPlanAdd.propTypes = { curso: PropTypes.any, closeModal: PropTypes.func };
