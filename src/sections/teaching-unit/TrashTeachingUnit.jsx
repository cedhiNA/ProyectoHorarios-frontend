import PropTypes from 'prop-types';
// material-ui
import { useTheme } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import { openSnackbar } from '../../api/snackbar';

import { deleteManyUnidadDidacticas } from '../../api/unidadDidactica';

import { Trash } from 'iconsax-react';

export default function TrashTeachingUnit({ data }) {
  const theme = useTheme();

  const deleteHandler = async () => {
    await deleteManyUnidadDidacticas(data).then(() => {
      openSnackbar({
        open: true,
        message: 'Unidad(s) eliminado con éxito',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        variant: 'alert',

        alert: {
          color: 'success'
        }
      });
    });
  };

  return (
    <Tooltip title="Eliminar unidades">
      <Trash onClick={deleteHandler} size={28} variant="Outline" style={{ color: theme.palette.text.secondary }} />
    </Tooltip>
  );
}

TrashTeachingUnit.propTypes = { data: PropTypes.array };
