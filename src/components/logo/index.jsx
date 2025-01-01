import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// material-ui
import ButtonBase from '@mui/material/ButtonBase';

// project-imports
import Logo from './LogoMain';
import LogoIcon from './LogoIcon';
import { APP_DEFAULT_PATH } from '../../config';

// ==============================|| MAIN LOGO ||============================== //

export default function LogoSection({ reverse, isIcon, sx, to }) {
  return (
    <ButtonBase disableRipple component={Link} to={!to ? APP_DEFAULT_PATH : to} sx={sx}>
      {isIcon ? <LogoIcon /> : <Logo reverse={reverse} />}
    </ButtonBase>
  );
}

LogoSection.propTypes = { reverse: PropTypes.bool, sx: PropTypes.object, isIcon: PropTypes.bool, to: PropTypes.string };
