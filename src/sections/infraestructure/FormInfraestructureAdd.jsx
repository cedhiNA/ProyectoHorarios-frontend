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
import AlertInfraestructureDelete from './AlertInfraestructureDelete';
import IconButton from '../../components/@extended/IconButton';
import CircularWithPath from '../../components/@extended/progress/CircularWithPath';
import { insertAula, updateAula } from '../../api/aula';

import { openSnackbar } from '../../api/snackbar';

// assets
import { Trash } from 'iconsax-react';

// CONSTANT
const getInitialValues = (aula) => {
  const newAula = {
    tipo_aula: '',
    nombre: '',
    local: 'Principal',
    capacidad: 10,
    formato_aula: 'Teorico'
  };

  if (aula) {
    return _.merge({}, newAula, aula);
  }

  return newAula;
};

const allTypeLocal = [
  { value: 'Aula', label: 'Aula' },
  { value: 'Auditorio', label: 'Auditorio' },
  { value: 'Laboratorio', label: 'Laboratorio' },
  { value: 'Biblioteca', label: 'Biblioteca' },
  { value: 'Aula_Virtual', label: 'Aula Virtual' }
];

const allCampus = [
  { value: 'Principal', label: 'Principal' },
  { value: 'Segundo', label: 'Segundo' },
  { value: 'Tercero', label: 'Tercero' }
];

const allTypeClass = [
  { value: 'Teorico', label: 'Teórico' },
  { value: 'Practico', label: 'Práctico' },
  { value: 'Taller', label: 'Taller' },
  { value: 'Demostracion', label: 'Demostración' },
  { value: 'Teorico/Practico', label: 'Teórico/Práctico' },
];

// ==============================|| AULA ADD / EDIT - FORM ||============================== //

export default function FormInfraestructureAdd({ aula, closeModal }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const AulaSchema = Yup.object().shape({
    tipo_aula: Yup.string().max(255).required('El tipo de aula es obligatorio'),
    nombre: Yup.string().max(255).required('El aula es obligatorio'),
    local: Yup.string().max(255).required('El local es obligatorio'),
    capacidad: Yup.number().required('El aforo es obligatorio'),
    formato_aula: Yup.string().max(255).required('El formato es obligatorio')
  });

  const [openAlert, setOpenAlert] = useState(false);

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
    closeModal();
  };

  const formik = useFormik({
    initialValues: getInitialValues(aula),
    validationSchema: AulaSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        let newAula = values;
        if (aula) {
          updateAula(aula.aula_id, newAula).then(() => {
            openSnackbar({
              open: true,
              message: 'Aula editada con éxito.',
              variant: 'alert',

              alert: {
                color: 'success'
              }
            });
            setSubmitting(false);
            closeModal();
          });
        } else {
          await insertAula(newAula).then(() => {
            openSnackbar({
              open: true,
              message: 'Aula añadida con éxito.',
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
            <DialogTitle>{aula ? 'Editar Aula' : 'Nueva Aula'}</DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 2.5 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="aula-tipo_aula">Tipo de Aula</InputLabel>
                        <FormControl fullWidth>
                          <Select
                            id="column-hiding-tipo_aula"
                            displayEmpty
                            {...getFieldProps('tipo_aula')}
                            onChange={(event) => setFieldValue('tipo_aula', event.target.value)}
                            input={<OutlinedInput id="select-column-hiding-tipo_aula" placeholder="Sort by" />}
                            renderValue={(selected) => {
                              if (!selected) {
                                return <Typography variant="subtitle2">Seleccionar tipo de aula</Typography>;
                              }

                              const selectedtipo_aula = allTypeLocal.filter((item) => item.value === selected);
                              return (
                                <Typography variant="subtitle2">
                                  {selectedtipo_aula.length > 0 ? selectedtipo_aula[0].label : 'Pendiente'}
                                </Typography>
                              );
                            }}
                          >
                            {allTypeLocal.map((column) => (
                              <MenuItem key={column.value} value={column.value}>
                                <ListItemText primary={column.label} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {touched.tipo_aula && errors.tipo_aula && (
                          <FormHelperText error id="standard-weight-helper-text-email-login-tipo_aula" sx={{ pl: 1.75 }}>
                            {errors.tipo_aula}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="aula-nombre">Aula</InputLabel>
                        <TextField
                          fullWidth
                          id="aula-nombre"
                          placeholder="Introduzca el nombre del aula"
                          {...getFieldProps('nombre')}
                          error={Boolean(touched.nombre && errors.nombre)}
                          helperText={touched.nombre && errors.nombre}
                        />
                      </Stack>
                    </Grid>

                    <Grid item xs={12} sm={5}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="aula-localcampus">Local</InputLabel>
                        <FormControl fullWidth>
                          <Select
                            id="column-hiding-localcampus"
                            displayEmpty
                            {...getFieldProps('local')}
                            onChange={(event) => setFieldValue('local', event.target.value)}
                            input={<OutlinedInput id="select-column-hiding-localcampus" placeholder="Sort by" />}
                            renderValue={(selected) => {
                              if (!selected) {
                                return <Typography variant="subtitle2">Seleccionar local</Typography>;
                              }

                              const selectedLocalcampus = allCampus.filter((item) => item.value === selected);
                              return (
                                <Typography variant="subtitle2">
                                  {selectedLocalcampus.length > 0 ? selectedLocalcampus[0].label : 'Pendiente'}
                                </Typography>
                              );
                            }}
                          >
                            {allCampus.map((column) => (
                              <MenuItem key={column.value} value={column.value}>
                                <ListItemText primary={column.label} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {touched.local && errors.local && (
                          <FormHelperText error id="standard-weight-helper-text-email-login-localcampus" sx={{ pl: 1.75 }}>
                            {errors.local}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>

                    <Grid item xs={12} sm={5}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="aula-formatoAula">Formato de Aula</InputLabel>
                        <FormControl fullWidth>
                          <Select
                            id="column-hiding-formatoAula"
                            displayEmpty
                            {...getFieldProps('formato_aula')}
                            onChange={(event) => setFieldValue('formato_aula', event.target.value)}
                            input={<OutlinedInput id="select-column-hiding-formatoAula" placeholder="Sort by" />}
                            renderValue={(selected) => {
                              if (!selected) {
                                return <Typography variant="subtitle2">Seleccionar formato de aula</Typography>;
                              }

                              const selectedFormatoAula = allTypeClass.filter((item) => item.value === selected);
                              return (
                                <Typography variant="subtitle2">
                                  {selectedFormatoAula.length > 0 ? selectedFormatoAula[0].label : 'Pendiente'}
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
                        {touched.formato_aula && errors.formato_aula && (
                          <FormHelperText error id="standard-weight-helper-text-email-login-formatoAula" sx={{ pl: 1.75 }}>
                            {errors.formato_aula}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>

                    <Grid item xs={12} sm={2}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="aula-capacidad">Aforo</InputLabel>
                        <TextField
                          type="number"
                          fullWidth
                          id="aula-capacidad"
                          placeholder="Introducir el capacidad"
                          {...getFieldProps('capacidad')}
                          error={Boolean(touched.capacidad && errors.capacidad)}
                          helperText={touched.capacidad && errors.capacidad}
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
                  {aula && (
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
                      {aula ? 'Editar' : 'Agregar'}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </DialogActions>
          </Form>
        </LocalizationProvider>
      </FormikProvider>
      {aula && (
        <AlertInfraestructureDelete id={aula.aula_id} title={aula.aula_id.toString()} open={openAlert} handleClose={handleAlertClose} />
      )}
    </>
  );
}

FormInfraestructureAdd.propTypes = { aula: PropTypes.any, closeModal: PropTypes.func };
