import PropTypes from 'prop-types';
// material-ui
import { useTheme } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import { openSnackbar } from '../../api/snackbar';

import { deleteManyProfesors } from '../../api/profesores';
//import { deleteCursos } from '../../api/cursos';

import { Trash } from 'iconsax-react';

export default function TrashProfessor({ data }) {
  const theme = useTheme();

  const deleteHandler = async () => {
    await deleteManyProfesors(data).then(() => {
      openSnackbar({
        open: true,
        message: 'Docente(s) eliminado con éxito',
        anchorOrigin: { vertical: 'top', horizontal: 'right' },
        variant: 'alert',

        alert: {
          color: 'success'
        }
      });
    });
  };

  return (
    <Tooltip title="Eliminar docentes">
      <Trash onClick={deleteHandler} size={28} variant="Outline" style={{ color: theme.palette.text.secondary }} />
    </Tooltip>
  );
}

TrashProfessor.propTypes = { data: PropTypes.array };
