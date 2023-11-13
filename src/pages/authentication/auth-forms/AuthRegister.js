import { useEffect, useState } from 'react';
// import { Link as RouterLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axois from 'axios';
// material-ui
import {
  Box,
  Button,
  // Divider,
  FormControl,
  FormHelperText,
  Grid,
  // Link,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
// import FirebaseSocial from './FirebaseSocial';
import AnimateButton from 'components/@extended/AnimateButton';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// assets
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import LoadingScreen from 'components/LoadingScreen';

// ============================|| FIREBASE - REGISTER ||============================ //

const AuthRegister = () => {
  const [openLoading, setOpenLoading] = useState(false);

  const navigate = useNavigate();
  const [level, setLevel] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [touched, setTouched] = useState({ username: false, email: false, password: false, submit: false });
  const [errors, setErrors] = useState({ username: '', email: '', password: '', submit: '' });
  // const [isSubmitting, setIsSubmitting] = useState(false);


  const handleSignup = async () => {
    setOpenLoading(true);
    const body = { username: name, email, password };
    try {
      const response = await axois.post('http://localhost:8000/auth/register/', { body });

      if (response.status === 200) {
        console.log('User registered successfully!');
        // Redirect to another page or show a success message
        // Alert('You have successfully registered! Please log in.');

        // Redirect to login page
        navigate('/auth/login');
      } else {
        console.error('Registration failed.');
        // Handle registration error
        // Alert('Error! User already exists.');
      }
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      setOpenLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const changePassword = (value) => {
    const temp = strengthIndicator(value);
    setLevel(strengthColor(temp));
  };

  useEffect(() => {
    changePassword('');
  }, []);

  return (
    <>
      <Formik
        initialValues={{
          username: '',
          email: '',
          password: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          username: Yup.string().max(255).required('UserName is required'),
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string().max(255).required('Password is required')
        })}
        onSubmit={async (values, { setErrors, setStatus }) => {
          try {
            setStatus({ success: false });
          } catch (err) {
            console.error(err);
            setStatus({ success: false });
            setErrors({ submit: err.message });
          }
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Stack spacing={1}>
              <InputLabel htmlFor="username-signup">Username*</InputLabel>
              <OutlinedInput
                id="username-signup"
                type="username"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (e.target.value) {
                    setTouched({ ...touched, username: false });
                    setErrors({ ...errors, username: '' });
                  } else {
                    setTouched({ ...touched, username: true });
                    setErrors({ ...errors, username: 'Username is required' });
                  }
                }}
                placeholder="username"
                fullWidth
                error={Boolean(touched.username && errors.username)}
              />
              {touched.username && errors.username && (
                <FormHelperText error id="helper-text-username-signup">
                  {errors.username}
                </FormHelperText>
              )}
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={1}>
              <InputLabel htmlFor="email-signup">Email Address*</InputLabel>
              <OutlinedInput
                fullWidth
                error={Boolean(touched.email && errors.email)}
                id="email-signup"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (e.target.value) {
                    setTouched({ ...touched, email: false });
                    setErrors({ ...errors, email: '' });
                  } else {
                    setTouched({ ...touched, email: true });
                    setErrors({ ...errors, email: 'Email is required' });
                  }
                }}
                placeholder="xyz@gmail.com"
                inputProps={{}}
              />
              {touched.email && errors.email && (
                <FormHelperText error id="helper-text-email-signup">
                  {errors.email}
                </FormHelperText>
              )}
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={1}>
              <InputLabel htmlFor="password-signup">Password</InputLabel>
              <OutlinedInput
                fullWidth
                error={Boolean(touched.password && errors.password)}
                id="password-signup"
                type={showPassword ? 'text' : 'password'}
                value={password}
                name="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                  changePassword(e.target.value);
                  if (e.target.value) {
                    setTouched({ ...touched, password: false });
                    setErrors({ ...errors, password: '' });
                  } else {
                    setTouched({ ...touched, password: true });
                    setErrors({ ...errors, password: 'Password is required' });
                  }
                }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="large"
                    >
                      {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                    </IconButton>
                  </InputAdornment>
                }
                placeholder="******"
                inputProps={{}}
              />
              {touched.password && errors.password && (
                <FormHelperText error id="helper-text-password-signup">
                  {errors.password}
                </FormHelperText>
              )}
            </Stack>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <Box sx={{ bgcolor: level?.color, width: 85, height: 8, borderRadius: '7px' }} />
                </Grid>
                <Grid item>
                  <Typography variant="subtitle1" fontSize="0.75rem">
                    {level?.label}
                  </Typography>
                </Grid>
              </Grid>
            </FormControl>
          </Grid>
          {errors.submit && (
            <Grid item xs={12}>
              <FormHelperText error>{errors.submit}</FormHelperText>
            </Grid>
          )}
          <Grid item xs={12}>
            <AnimateButton>
              <Button
                disableElevation
                onClick={handleSignup}
                // disabled={isSubmitting}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                color="primary"
              >
                Create Account
              </Button>
            </AnimateButton>
          </Grid>
        </Grid>
      </Formik>
      <LoadingScreen openLoading={openLoading} />
    </>
  );
};

export default AuthRegister;
