// material-ui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';

import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import OutlinedInput from '@mui/material/OutlinedInput';
// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project-imports
import useAuth from '../../hooks/useAuth';
import MainCard from '../../components/MainCard';
import { openSnackbar } from '../../api/snackbar';

const allCategorys = [
  { value: 'administrador', label: 'Administrador' },
  { value: 'director', label: 'Director' },
  { value: 'secretario', label: 'Secretario' }
];

// ==============================|| USER PROFILE - PERSONAL ||============================== //

export default function TabPersonal() {
  const { user } = useAuth();

  return (
    <MainCard content={false} title="Información personal" sx={{ '& .MuiInputLabel-root': { fontSize: '.875rem' } }}>
      <Formik
        initialValues={{
          email: user?.email || '',
          categoria: user?.categoria || '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Dirección de correo electrónico no válida.').max(255).required('El correo es obligatorio.'),
          categoria: Yup.number().required('El cargo es obligatorio'),
        })}
        onSubmit={(values, { setErrors, setStatus, setSubmitting }) => {
          try {
            openSnackbar({
              open: true,
              message: 'Perfil personal actualizado exitosamente.',
              variant: 'alert',
              alert: { color: 'success' }
            });
            setStatus({ success: false });
            setSubmitting(false);
          } catch (err) {
            openSnackbar({
              open: true,
              message: 'Ocurrió un error inesperado. Por favor, inténtelo nuevamente.',
              variant: 'alert',
              alert: { color: 'error' }
            });
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Box sx={{ p: 2.5 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="personal-email">Correo Electrónico</InputLabel>
                    <TextField
                      type="email"
                      fullWidth
                      value={values.email}
                      name="email"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      id="personal-email"
                      placeholder="Email Address"
                    />
                  </Stack>
                  {touched.email && errors.email && (
                    <FormHelperText error id="personal-email-helper">
                      {errors.email}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Stack spacing={1}>
                    <InputLabel htmlFor="personal-cargo">Cargo</InputLabel>
                    <FormControl fullWidth>
                      <Select
                        id="personal-cargo"
                        name="categoria"
                        displayEmpty
                        value={values.categoria}
                        onChange={handleChange}
                        input={<OutlinedInput id="select-personal-cargo" placeholder="Sort by" />}
                        renderValue={(selected) => {
                          if (!selected) {
                            return <Typography variant="subtitle2">Selecciona Cargo</Typography>;
                          }

                          const selectedStatus = allCategorys.filter((item) => item.value === selected);
                          return (
                            <Typography variant="subtitle2">{selectedStatus.length > 0 ? selectedStatus[0].label : 'Pending'}</Typography>
                          );
                        }}
                      >
                        {allCategorys.map((column) => (
                          <MenuItem key={column.value} value={column.value}>
                            <ListItemText primary={column.label} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {touched.categoria && errors.categoria && (
                      <FormHelperText error id="standard-weight-helper-text-personal-cargo-login" sx={{ pl: 1.75 }}>
                        {errors.categoria}
                      </FormHelperText>
                    )}
                  </Stack>
                </Grid>

              </Grid>
            </Box>
            <Box sx={{ p: 2.5 }}>
              <Stack direction="row" justifyContent="flex-end" alignItems="center" spacing={2} sx={{ mt: 2.5 }}>
                <Button variant="outlined" color="secondary">
                  Cancelar
                </Button>
                <Button disabled={isSubmitting || Object.keys(errors).length !== 0} type="submit" variant="contained">
                  Guardar
                </Button>
              </Stack>
            </Box>
          </form>
        )}
      </Formik>
    </MainCard>
  );
}
