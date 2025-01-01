import { useState } from 'react';

// material-ui
import Grid from '@mui/material/Grid';
import FormHelperText from '@mui/material/FormHelperText';
import Stack from '@mui/material/Stack';

// project-imports
import MainCard from '../../components/MainCard';
import UploadMultiFile from '../../components/third-party/dropzone/MultiFile';

// third-party
import { Formik } from 'formik';
import IconButton from '../../components/@extended/IconButton';
import { openSnackbar } from '../../api/snackbar';
import { getModeloAula, getModeloFullAula } from '../../api/gestionArchivos';

// assets
import { Category, TableDocument, Document, DocumentText1 } from 'iconsax-react';

// ==============================|| PLUGIN - DROPZONE ||============================== //

export default function DropzoneInfrastructure() {
  const [listBook, setListBook] = useState(false);

  const getModeloAulaHandler = async () => {
    await getModeloAula().then(() => {
      openSnackbar({
        open: true,
        message: 'Documento generado con éxito',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        variant: 'alert',

        alert: {
          color: 'success'
        }
      });
    });
  };

  const getModeloFullAulaHandler = async () => {
    await getModeloFullAula().then(() => {
      openSnackbar({
        open: true,
        message: 'Documento generado con éxito',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        variant: 'alert',

        alert: {
          color: 'success'
        }
      });
    });
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <MainCard
          title="Actualización Masiva de la Infraestructura"
          secondary={
            <Stack direction="row" alignItems="center" spacing={1.25}>
              <IconButton
                color="warning"
                size="big"
                title="Exportar Plantilla"
                onClick={getModeloFullAulaHandler}
              >
                <DocumentText1 style={{ fontSize: '1.15rem' }} />
              </IconButton>
              <IconButton
                color="info"
                size="big"
                title="Exportar Plantilla"
                onClick={getModeloAulaHandler}
                
              >
                <Document style={{ fontSize: '1.15rem' }} />
              </IconButton>
              <IconButton color={listBook ? 'secondary' : 'primary'} size="small" onClick={() => setListBook(false)}>
                <TableDocument style={{ fontSize: '1.15rem' }} />
              </IconButton>
              <IconButton color={listBook ? 'primary' : 'secondary'} size="small" onClick={() => setListBook(true)}>
                <Category style={{ fontSize: '1.15rem' }} />
              </IconButton>
            </Stack>
          }
        >
          <Formik
            initialValues={{ files: null }}
            onSubmit={async (values, formikHelpers) => {
              const { setFieldValue } = formikHelpers;
              console.log(values.files[0]);
              // submit form
              try {
                const formData = new FormData();
                formData.append('file', values.files[0]);

                console.log(formData);

                setFieldValue('files', null);
              } catch (error) {
                console.log(error);
              }
            }}
          >
            {({ values, handleSubmit, setFieldValue, touched, errors }) => (
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Stack spacing={1.5} alignItems="center">
                      <UploadMultiFile
                        showList={listBook}
                        setFieldValue={setFieldValue}
                        files={values.files}
                        error={touched.files && !!errors.files}
                        onUpload={handleSubmit}
                      />
                    </Stack>
                    {touched.files && errors.files && (
                      <FormHelperText error id="standard-weight-helper-text-password-login">
                        {errors.files}
                      </FormHelperText>
                    )}
                  </Grid>
                </Grid>
              </form>
            )}
          </Formik>
        </MainCard>
      </Grid>
    </Grid>
  );
}
