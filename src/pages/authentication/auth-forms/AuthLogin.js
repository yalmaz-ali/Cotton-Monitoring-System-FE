import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import {
  Button,
  Checkbox,
  // Divider,
  FormControlLabel,
  FormHelperText,
  Grid,
  Link,
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

// assets
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { useAuth } from 'context/auth-context/AuthContext';
import LoadingScreen from 'components/LoadingScreen';
import axios from '../../../../node_modules/axios/index';

// ============================|| FIREBASE - LOGIN ||============================ //

const AuthLogin = () => {
  const navigate = useNavigate();
  const [openLoading, setOpenLoading] = useState(false);

  const [checked, setChecked] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState({ email: false, password: false, submit: false });
  const [errors, setErrors] = useState({ email: '', password: '', submit: '' });
  // const [isSubmitting, setIsSubmitting] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const handleSignIn = async () => {
    setOpenLoading(true);
    const body = { email, password };
    try {
      // Perform sign-in logic and retrieve JWT token from server
      const response = await axios.post('http://localhost:8000/auth/login/', body);

      if (response.status === 200) {
        const data = await response.data;
        const jwtToken = data.jwt;
        console.log(data);

        login(jwtToken);

        // Save the JWT token to local storage or a state management solution
        // localStorage.setItem("jwtToken", jwtToken);

        // Redirect to the field page
        navigate('/Field');
      } else {
        // Handle sign-in error
        console.error('Sign-in failed');
      }
    } catch (error) {
      // Alert('Invalid credentials!');
      console.error('An error occurred', error);
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

  return (
    <>
      <Formik
        initialValues={{
          email: '',
          password: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string().max(255).required('Password is required')
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            setStatus({ success: false });
            setSubmitting(false);
          } catch (err) {
            setStatus({ success: false });
            setErrors({ submit: err.message });
            setSubmitting(false);
          }
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Stack spacing={1}>
              <InputLabel htmlFor="email-login">Email Address</InputLabel>
              <OutlinedInput
                id="email-login"
                type="email"
                name="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (e.target.value) {
                    setTouched({ ...touched, email: false });
                    setErrors({ ...errors, email: '' });
                  } else {
                    setTouched({ ...touched, email: true });
                    setErrors({ ...errors, email: 'Email is required' });
                  }
                }
                }
                placeholder="Enter email address"
                fullWidth
                error={Boolean(touched.email && errors.email)}
              />
              {touched.email && errors.email && (
                <FormHelperText error id="standard-weight-helper-text-email-login">
                  {errors.email}
                </FormHelperText>
              )}
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={1}>
              <InputLabel htmlFor="password-login">Password</InputLabel>
              <OutlinedInput
                fullWidth
                error={Boolean(touched.password && errors.password)}
                id="password-login"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
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
                placeholder="Enter password"
              />
              {touched.password && errors.password && (
                <FormHelperText error id="standard-weight-helper-text-password-login">
                  {errors.password}
                </FormHelperText>
              )}
            </Stack>
          </Grid>

          <Grid item xs={12} sx={{ mt: -1 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checked}
                    onChange={(event) => setChecked(event.target.checked)}
                    name="checked"
                    color="primary"
                    size="small"
                  />
                }
                label={<Typography variant="h6">Keep me sign in</Typography>}
              />
              <Link variant="h6" component={RouterLink} to="" color="text.primary">
                Forgot Password?
              </Link>
            </Stack>
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
                onClick={handleSignIn}
                // disabled={isSubmitting}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                color="primary"
              >
                Login
              </Button>
            </AnimateButton>
          </Grid>
        </Grid>
      </Formik>
      <LoadingScreen openLoading={openLoading} />
    </>
  );
};

export default AuthLogin;
