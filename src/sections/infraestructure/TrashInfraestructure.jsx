import PropTypes from 'prop-types';
// material-ui
import { useTheme } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import { openSnackbar } from '../../api/snackbar';

import { deleteManyAulas } from '../../api/aula';

import { Trash } from 'iconsax-react';

export default function TrashInfraestructure({ data }) {
  const theme = useTheme();

  const deleteHandler = async () => {
    await deleteManyAulas(data).then(() => {
      openSnackbar({
        open: true,
        message: 'Aula(s) eliminado con éxito',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        variant: 'alert',

        alert: {
          color: 'success'
        }
      });
    });
  };

  return (
    <Tooltip title="Eliminar aulas">
      <Trash onClick={deleteHandler} size={28} variant="Outline" style={{ color: theme.palette.text.secondary }} />
    </Tooltip>
  );
}

TrashInfraestructure.propTypes = { data: PropTypes.array };
