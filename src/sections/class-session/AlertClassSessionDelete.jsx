import PropTypes from 'prop-types';
// material-ui
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';

// project-imports
import Avatar from '../../components/@extended/Avatar';
import { deleteSesiones } from '../../api/sesiones';
import { PopupTransition } from '../../components/@extended/Transitions';

import { openSnackbar } from '../../api/snackbar';

// assets
import { Trash } from 'iconsax-react';

// ==============================|| CLASS SESSION - DELETE ||============================== //

export default function AlertClassSessionDelete({ id, classSessionId, open, handleClose }) {
  const deletehandler = async () => {
    await deleteSesiones(id).then(() => {
      openSnackbar({
        open: true,
        message: 'Sesión eliminada exitosamente',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        variant: 'alert',
        alert: {
          color: 'success'
        }
      });
      handleClose();
    });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      keepMounted
      TransitionComponent={PopupTransition}
      maxWidth="xs"
      aria-labelledby="column-delete-title"
      aria-describedby="column-delete-description"
    >
      <DialogContent sx={{ mt: 2, my: 1 }}>
        <Stack alignItems="center" spacing={3.5}>
          <Avatar color="error" sx={{ width: 72, height: 72, fontSize: '1.75rem' }}>
            <Trash variant="Bold" />
          </Avatar>
          <Stack spacing={2}>
            <Typography variant="h4" align="center">
              ¿Estás seguro de que deseas eliminar?
            </Typography>
            <Typography align="center">
              Al eliminar la sesión académica
              <Typography variant="subtitle1" component="span">
                {' '}
                &quot;{classSessionId}&quot;{' '}
              </Typography>
              , también se eliminarán todos los datos asignadas a está sesión.
            </Typography>
          </Stack>

          <Stack direction="row" spacing={2} sx={{ width: 1 }}>
            <Button fullWidth onClick={handleClose} color="secondary" variant="outlined">
              Cancelar
            </Button>
            <Button fullWidth color="error" variant="contained" onClick={deletehandler} autoFocus>
              Eliminar
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

AlertClassSessionDelete.propTypes = {
  id: PropTypes.number,
  classSessionId: PropTypes.string,
  open: PropTypes.bool,
  handleClose: PropTypes.func
};
