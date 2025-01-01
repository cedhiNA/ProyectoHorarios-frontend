import PropTypes from 'prop-types';
// material-ui
import { useTheme } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import { openSnackbar } from '../../api/snackbar';

import { deleteManySesiones } from '../../api/sesiones';

import { Trash } from 'iconsax-react';

export default function TrashClassSession({ data }) {
  const theme = useTheme();

  const deleteHandler = async () => {
    await deleteManySesiones(data).then(() => {
      openSnackbar({
        open: true,
        message: 'Sesión(es) eliminado con éxito',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        variant: 'alert',

        alert: {
          color: 'success'
        }
      });
    });
  };

  return (
    <Tooltip title="Eliminar sesiones">
      <Trash onClick={deleteHandler} size={28} variant="Outline" style={{ color: theme.palette.text.secondary }} />
    </Tooltip>
  );
}

TrashClassSession.propTypes = { data: PropTypes.array };
