// material-ui
import { useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';
import background from 'assets/images/auth/back_auth.jpg';

// ==============================|| AUTH BLUR BACK SVG ||============================== //

const AuthBackground = () => {
  return (
    // <Box sx={{
    //   position: 'absolute', filter: 'blur(5px)', zIndex: -1, bottom: 0,
    //   // width: '100%', height: '100%'
    // }}>
    <>
      <img src={background} alt="Background"
        style={{
          position: 'absolute',
          filter: 'blur(5px)',
          zIndex: -1,
          bottom: 0,
          width: '100%',
          height: '100%'
        }} />
    </>
  );
};

export default AuthBackground;
