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
import AlertTeachingUnitDelete from './AlertTeachingUnitDelete';
import IconButton from '../../components/@extended/IconButton';
import CircularWithPath from '../../components/@extended/progress/CircularWithPath';
import { insertUnidadDidactica, updateUnidadDidactica } from '../../api/unidadDidactica';
import { useGetProfesor } from '../../api/profesores';
import { useGetCursos } from '../../api/cursos';
import { openSnackbar } from '../../api/snackbar';

// assets
import { Trash } from 'iconsax-react';

// CONSTANT
const getInitialValues = (teachingUnit) => {
  const newTeachingUnit = {
    periodo_academico: '',
    seccion: '',
    profesor_principal: '',
    profesor_apoyo: '',

    programa: '',
    tipo_plan: 'modular',
    plan_estudios: '',
    modalidad: '',
    enfoque: '',
    horas_semanales: '',
    unidad_didactica: '',
    semestre: ''
  };

  if (teachingUnit) {
    return _.merge({}, newTeachingUnit, teachingUnit);
  }

  return newTeachingUnit;
};

const allAcademicPeriod = [
  { value: '2024-01', label: '2024-01' },
  { value: '2024-02', label: '2024-02' },
  { value: '2025-01', label: '2025-01' },
  { value: '2025-02', label: '2025-02' },
  { value: '2026-01', label: '2026-01' },
  { value: '2026-02', label: '2026-02' },
  { value: '2027-01', label: '2027-01' },
  { value: '2027-02', label: '2027-02' },
  { value: '2028-01', label: '2028-01' },
  { value: '2028-02', label: '2028-02' },
  { value: '2029-01', label: '2029-01' },
  { value: '2029-02', label: '2029-02' },
  { value: '2030-01', label: '2030-01' },
  { value: '2030-02', label: '2030-02' }
];

const allSeccions = [
  { value: 'A', label: 'A' },
  { value: 'B', label: 'B' },
  { value: 'C', label: 'C' },
  { value: 'D', label: 'D' },
  { value: 'E', label: 'E' },
  { value: 'F', label: 'F' },
  { value: 'G', label: 'G' },
  { value: 'H', label: 'H' },
  { value: 'I', label: 'I' },
  { value: 'J', label: 'J' },
  { value: 'K', label: 'K' },
  { value: 'L', label: 'L' },
  { value: 'M', label: 'M' },
  { value: 'N', label: 'N' },
  { value: 'Ñ', label: 'Ñ' },
  { value: 'O', label: 'O' },
  { value: 'P', label: 'P' },
  { value: 'Q', label: 'Q' },
  { value: 'R', label: 'R' },
  { value: 'S', label: 'S' },
  { value: 'T', label: 'T' },
  { value: 'U', label: 'U' },
  { value: 'V', label: 'V' },
  { value: 'W', label: 'W' },
  { value: 'X', label: 'X' },
  { value: 'Y', label: 'Y' },
  { value: 'Z', label: 'Z' }
];

const allTypeStudyPlan = [{ value: 'modular', label: 'Modular' }];

const allMode = [
  { value: 'presencial', label: 'Presencial' },
  { value: 'semi-presencial', label: 'Semi-presencial' }
];

const allFocus = [
  { value: 'presencial', label: 'Presencial' },
  { value: 'virtual', label: 'Virtual' }
];

// ==============================|| TEACHING UNIT ADD / EDIT - FORM ||============================== //

export default function FormTeachingUnitAdd({ teachingUnit, closeModal }) {
  const { profesoresLoading: loadingProfesores, profesores: listsProfesores } = useGetProfesor();
  const { cursosLoading: loadingCursos, cursos: listCursos } = useGetCursos();

  // Estados para los filtros
  const [selectedCarrera, setSelectedCarrera] = useState('');
  const [selectedPlanEstudio, setSelectedPlanEstudio] = useState('');
  const [selectedSemestre, setSelectedSemestre] = useState('');
  const [filteredCursos, setFilteredCursos] = useState([]);

  // Actualizar cursos filtrados cuando cambien los filtros o la lista original de cursos
  useEffect(() => {
    if (listCursos) {
      const filtered = listCursos.filter(
        (curso) =>
          (!selectedCarrera || curso.carrera === selectedCarrera) &&
          (!selectedPlanEstudio || curso.plan_estudios === Number(selectedPlanEstudio)) &&
          (!selectedSemestre || curso.semestre === Number(selectedSemestre))
      );
      setFilteredCursos(filtered);
    }
  }, [selectedCarrera, selectedPlanEstudio, selectedSemestre, listCursos]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const TeachingUnitSchema = Yup.object().shape({
    periodo_academico: Yup.string().max(255).required('El periodo es obligatorio'),
    seccion: Yup.string().max(255).required('La sección es obligatorio'),
    profesor_principal: Yup.string().max(255).required('El docente es obligatorio'),
    profesor_apoyo: Yup.string().max(255).required('El docente es obligatorio'),

    programa: Yup.string().max(255).required('El programa es obligatorio'),
    tipo_plan: Yup.string().max(255).required('El tipo de plan es obligatorio'),
    plan_estudios: Yup.number().required('El plan es obligatorio'),
    modalidad: Yup.string().max(255).required('La modalidad es obligatorio'),
    enfoque: Yup.string().max(255).required('El enfoque es obligatorio'),
    horas_semanales: Yup.number().required('La cantidad de horas es obligatorio'),
    unidad_didactica: Yup.string().max(255).required('La unidad es obligatorio'),
    semestre: Yup.number().required('El semestre es obligatorio').min(1, 'Debe ser mayor o igual a 1').max(10, 'Debe ser menor o igual a 10')
  });

  const [openAlert, setOpenAlert] = useState(false);

  const handleAlertClose = () => {
    setOpenAlert(!openAlert);
    closeModal();
  };

  const handleProgramaEstudio = (programa) => {
    setSelectedCarrera(programa);
    setFieldValue('programa', programa);
  };
  const handlePlanEstudio = (plan) => {
    setSelectedPlanEstudio(plan);
    setFieldValue('plan_estudios', plan);
  };
  const handleSemestre = (semestre) => {
    setSelectedSemestre(semestre);
    setFieldValue('semestre', semestre);
  };

  const formik = useFormik({
    initialValues: getInitialValues(teachingUnit),
    validationSchema: TeachingUnitSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        let newTeachingUnit = values;
        if (teachingUnit) {
          updateUnidadDidactica(teachingUnit.unidad_id, newTeachingUnit).then(() => {
            openSnackbar({
              open: true,
              message: 'La unidad didáctica se actualizó correctamente.',
              variant: 'alert',

              alert: {
                color: 'success'
              }
            });
            setSubmitting(false);
            closeModal();
          });
        } else {
          await insertUnidadDidactica(newTeachingUnit).then(() => {
            openSnackbar({
              open: true,
              message: 'La unidad didáctica se agregó correctamente.',
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
            <DialogTitle>{teachingUnit ? 'Editar Unidad Didáctica' : 'Nueva Unidad Didáctica'}</DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 2.5 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={2}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="teachingUnit-periodo_academico">Periodo Académico</InputLabel>
                        <FormControl fullWidth>
                          <Select
                            id="column-hiding-periodo_academico"
                            displayEmpty
                            {...getFieldProps('periodo_academico')}
                            onChange={(event) => setFieldValue('periodo_academico', event.target.value)}
                            input={<OutlinedInput id="select-column-hiding-periodo_academico" placeholder="Sort by" />}
                            renderValue={(selected) => {
                              if (!selected) {
                                return <Typography variant="subtitle2">Seleccionar</Typography>;
                              }

                              const selectedPeriodoAcademico = allAcademicPeriod.filter((item) => item.value === selected);
                              return (
                                <Typography variant="subtitle2">
                                  {selectedPeriodoAcademico.length > 0 ? selectedPeriodoAcademico[0].label : 'Pendiente'}
                                </Typography>
                              );
                            }}
                          >
                            {allAcademicPeriod.map((column) => (
                              <MenuItem key={column.value} value={column.value}>
                                <ListItemText primary={column.label} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {touched.periodo_academico && errors.periodo_academico && (
                          <FormHelperText error id="standard-weight-helper-text-email-login-periodo_academico" sx={{ pl: 1.75 }}>
                            {errors.periodo_academico}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>

                    <Grid item xs={12} sm={2}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="teachingUnit-seccion">Sección</InputLabel>
                        <FormControl fullWidth>
                          <Select
                            id="column-hiding-seccion"
                            displayEmpty
                            {...getFieldProps('seccion')}
                            onChange={(event) => setFieldValue('seccion', event.target.value)}
                            input={<OutlinedInput id="select-column-hiding-seccion" placeholder="Sort by" />}
                            renderValue={(selected) => {
                              if (!selected) {
                                return <Typography variant="subtitle2">Seleccionar</Typography>;
                              }

                              const selectedSeccion = allSeccions.filter((item) => item.value === selected);
                              return (
                                <Typography variant="subtitle2">
                                  {selectedSeccion.length > 0 ? selectedSeccion[0].label : 'Pendiente'}
                                </Typography>
                              );
                            }}
                          >
                            {allSeccions.map((column) => (
                              <MenuItem key={column.value} value={column.value}>
                                <ListItemText primary={column.label} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {touched.seccion && errors.seccion && (
                          <FormHelperText error id="standard-weight-helper-text-email-login-Sección" sx={{ pl: 1.75 }}>
                            {errors.seccion}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="teachingUnit-profesor_principal">Docente Principal</InputLabel>
                        <FormControl fullWidth>
                          <Select
                            id="column-hiding-profesor_principal"
                            displayEmpty
                            {...getFieldProps('profesor_principal')}
                            onChange={(event) => setFieldValue('profesor_principal', event.target.value)}
                            input={<OutlinedInput id="select-column-hiding-profesor_principal" placeholder="Sort by" />}
                            renderValue={(selected) => {
                              if (loadingProfesores) {
                                return <Typography variant="subtitle2">Cargando docentes...</Typography>;
                              }

                              if (!selected) {
                                return <Typography variant="subtitle2">Seleccionar docente</Typography>;
                              }

                              return <Typography variant="subtitle2">{selected}</Typography>;
                            }}
                          >
                            {loadingProfesores ? (
                              <MenuItem disabled>
                                <ListItemText primary="Cargando docentes..." />
                              </MenuItem>
                            ) : (
                              listsProfesores?.map((profesor) => (
                                <MenuItem key={profesor.profesor_id} value={profesor.nombres}>
                                  <ListItemText primary={profesor.nombres} />
                                </MenuItem>
                              ))
                            )}
                          </Select>
                        </FormControl>
                        {touched.profesor_principal && errors.profesor_principal && (
                          <FormHelperText error id="standard-weight-helper-text-email-login-profesor_principal" sx={{ pl: 1.75 }}>
                            {errors.profesor_principal}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="teachingUnit-profesor_apoyo">Docente de Apoyo</InputLabel>
                        <FormControl fullWidth>
                          <Select
                            id="column-hiding-profesor_apoyo"
                            displayEmpty
                            {...getFieldProps('profesor_apoyo')}
                            onChange={(event) => setFieldValue('profesor_apoyo', event.target.value)}
                            input={<OutlinedInput id="select-column-hiding-profesor_apoyo" placeholder="Sort by" />}
                            renderValue={(selected) => {
                              if (loadingProfesores) {
                                return <Typography variant="subtitle2">Cargando docentes...</Typography>;
                              }

                              if (!selected) {
                                return <Typography variant="subtitle2">Seleccionar docente</Typography>;
                              }

                              return <Typography variant="subtitle2">{selected}</Typography>;
                            }}
                          >
                            {loadingProfesores ? (
                              <MenuItem disabled>
                                <ListItemText primary="Cargando docentes..." />
                              </MenuItem>
                            ) : (
                              listsProfesores?.map((profesor) => (
                                <MenuItem key={profesor.profesor_id} value={profesor.nombres}>
                                  <ListItemText primary={profesor.nombres} />
                                </MenuItem>
                              ))
                            )}
                          </Select>
                        </FormControl>
                        {touched.profesor_apoyo && errors.profesor_apoyo && (
                          <FormHelperText error id="standard-weight-helper-text-email-login-profesor_apoyo" sx={{ pl: 1.75 }}>
                            {errors.profesor_apoyo}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>

                    <Divider sx={{ my: 2 }} />

                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="teachingUnit-programa">Programa de Estudios</InputLabel>
                        <FormControl fullWidth>
                          <Select
                            id="column-hiding-programa"
                            displayEmpty
                            {...getFieldProps('programa')}
                            onChange={(event) => handleProgramaEstudio(event.target.value)}
                            input={<OutlinedInput placeholder="Seleccionar programa de estudio" />}
                            renderValue={(selected) => (selected ? selected : 'Seleccionar programa de estudio')}
                          >
                            {[...new Set(listCursos?.map((curso) => curso.carrera))].map((carrera) => (
                              <MenuItem key={carrera} value={carrera}>
                                {carrera}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Stack>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="teachingUnit-tipoPlanEstudios">Tipo de Plan de Estudios</InputLabel>
                        <FormControl fullWidth>
                          <Select
                            id="column-hiding-tipoPlanEstudios"
                            displayEmpty
                            {...getFieldProps('tipo_plan')}
                            onChange={(event) => setFieldValue('tipo_plan', event.target.value)}
                            input={<OutlinedInput id="select-column-hiding-tipoPlanEstudios" placeholder="Sort by" />}
                            renderValue={(selected) => {
                              if (!selected) {
                                return <Typography variant="subtitle2">Seleccionar tipo de plan</Typography>;
                              }

                              const selectedTipoPlanEstudios = allTypeStudyPlan.filter((item) => item.value === selected);
                              return (
                                <Typography variant="subtitle2">
                                  {selectedTipoPlanEstudios.length > 0 ? selectedTipoPlanEstudios[0].label : 'Pendiente'}
                                </Typography>
                              );
                            }}
                          >
                            {allTypeStudyPlan.map((column) => (
                              <MenuItem key={column.value} value={column.value}>
                                <ListItemText primary={column.label} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {touched.tipo_plan && errors.tipo_plan && (
                          <FormHelperText error id="standard-weight-helper-text-email-login-tipoPlanEstudios" sx={{ pl: 1.75 }}>
                            {errors.tipo_plan}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="teachingUnit-planEstudio">Plan de Estudio</InputLabel>
                        <FormControl fullWidth>
                          <Select
                            id="column-hiding-planEstudio"
                            displayEmpty
                            {...getFieldProps('plan_estudios')}
                            onChange={(event) => handlePlanEstudio(event.target.value)}
                            input={<OutlinedInput placeholder="Seleccionar plan" />}
                            renderValue={(selected) => (selected ? selected : 'Seleccionar plan')}
                          >
                            {[...new Set(listCursos?.map((curso) => curso.plan_estudios))].map((plan) => (
                              <MenuItem key={plan} value={plan}>
                                {plan}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Stack>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="teachingUnit-semestre">Semestre</InputLabel>
                        <FormControl fullWidth>
                          <Select
                            id="column-hiding-semestre"
                            displayEmpty
                            {...getFieldProps('semestre')}
                            onChange={(event) => handleSemestre(event.target.value)}
                            input={<OutlinedInput placeholder="Seleccionar semestre" />}
                            renderValue={(selected) => (selected ? selected : 'Seleccionar semestre')}
                          >
                            {[...new Set(listCursos?.map((curso) => curso.semestre))].map((semestre) => (
                              <MenuItem key={semestre} value={semestre}>
                                {semestre}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Stack>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="teachingUnit-modalidad">Modalidad</InputLabel>
                        <FormControl fullWidth>
                          <Select
                            id="column-hiding-modalidad"
                            displayEmpty
                            {...getFieldProps('modalidad')}
                            onChange={(event) => setFieldValue('modalidad', event.target.value)}
                            input={<OutlinedInput id="select-column-hiding-modalidad" placeholder="Sort by" />}
                            renderValue={(selected) => {
                              if (!selected) {
                                return <Typography variant="subtitle2">Seleccionar modalidad</Typography>;
                              }

                              const selectedModalidad = allMode.filter((item) => item.value === selected);
                              return (
                                <Typography variant="subtitle2">
                                  {selectedModalidad.length > 0 ? selectedModalidad[0].label : 'Pendiente'}
                                </Typography>
                              );
                            }}
                          >
                            {allMode.map((column) => (
                              <MenuItem key={column.value} value={column.value}>
                                <ListItemText primary={column.label} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {touched.modalidad && errors.modalidad && (
                          <FormHelperText error id="standard-weight-helper-text-email-login-modalidad" sx={{ pl: 1.75 }}>
                            {errors.modalidad}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="teachingUnit-enfoque">Enfoque</InputLabel>
                        <FormControl fullWidth>
                          <Select
                            id="column-hiding-enfoque"
                            displayEmpty
                            {...getFieldProps('enfoque')}
                            onChange={(event) => setFieldValue('enfoque', event.target.value)}
                            input={<OutlinedInput id="select-column-hiding-enfoque" placeholder="Sort by" />}
                            renderValue={(selected) => {
                              if (!selected) {
                                return <Typography variant="subtitle2">Seleccionar enfoque</Typography>;
                              }

                              const selectedEnfoque = allFocus.filter((item) => item.value === selected);
                              return (
                                <Typography variant="subtitle2">
                                  {selectedEnfoque.length > 0 ? selectedEnfoque[0].label : 'Pendiente'}
                                </Typography>
                              );
                            }}
                          >
                            {allFocus.map((column) => (
                              <MenuItem key={column.value} value={column.value}>
                                <ListItemText primary={column.label} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {touched.enfoque && errors.enfoque && (
                          <FormHelperText error id="standard-weight-helper-text-email-login-enfoque" sx={{ pl: 1.75 }}>
                            {errors.enfoque}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="teachingUnit-horas_semanales">Cantidad de horas/semana*</InputLabel>
                        <TextField
                          type="number"
                          fullWidth
                          id="teachingUnit-horas_semanales"
                          placeholder="Introducir las horas"
                          {...getFieldProps('horas_semanales')}
                          error={Boolean(touched.horas_semanales && errors.horas_semanales)}
                          helperText={touched.horas_semanales && errors.horas_semanales}
                        />
                      </Stack>
                    </Grid>

                    <Grid item xs={12}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="teachingUnit-unidadDidactica">Unidad Didáctica</InputLabel>
                        <FormControl fullWidth>
                          <Select
                            id="column-hiding-unidadDidactica"
                            displayEmpty
                            {...getFieldProps('unidad_didactica')}
                            onChange={(event) => setFieldValue('unidad_didactica', event.target.value)}
                            input={<OutlinedInput placeholder="Seleccionar unidad didáctica" />}
                            renderValue={(selected) => {
                              if (!selected) return 'Seleccionar unidad didáctica';
                              const selectedUnidadDidactica = filteredCursos.find((curso) => curso.nombre === selected);
                              return selectedUnidadDidactica?.nombre || 'Pendiente';
                            }}
                          >
                            {filteredCursos.map((curso) => (
                              <MenuItem key={curso.nombre} value={curso.nombre}>
                                {curso.nombre}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
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
                  {teachingUnit && (
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
                      {teachingUnit ? 'Editar' : 'Agregar'}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </DialogActions>
          </Form>
        </LocalizationProvider>
      </FormikProvider>
      {teachingUnit && (
        <AlertTeachingUnitDelete
          id={teachingUnit.unidad_id}
          title={teachingUnit.unidad_id.toString()}
          open={openAlert}
          handleClose={handleAlertClose}
        />
      )}
    </>
  );
}

FormTeachingUnitAdd.propTypes = { teachingUnit: PropTypes.any, closeModal: PropTypes.func };
