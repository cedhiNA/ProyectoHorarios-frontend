import PropTypes from 'prop-types';
// material-ui
import { useTheme } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import { openSnackbar } from '../../api/snackbar';

import { deleteManyCursos } from '../../api/cursos';

import { Trash } from 'iconsax-react';

export default function TrashStudyPlan({ data }) {
  const theme = useTheme();

  const deleteHandler = async () => {
    await deleteManyCursos(data).then(() => {
      openSnackbar({
        open: true,
        message: 'Curso(s) eliminado con éxito',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        variant: 'alert',

        alert: {
          color: 'success'
        }
      });
    });
  };

  return (
    <Tooltip title="Eliminar cursos">
      <Trash onClick={deleteHandler} size={28} variant="Outline" style={{ color: theme.palette.text.secondary }} />
    </Tooltip>
  );
}

TrashStudyPlan.propTypes = { data: PropTypes.array };
