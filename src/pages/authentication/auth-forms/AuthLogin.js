import React, { useCallback, useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
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
import * as Yup from 'yup';
import { Formik } from 'formik';
// import FirebaseSocial from './FirebaseSocial';
import AnimateButton from 'components/@extended/AnimateButton';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { useAuth } from 'context/auth-context/AuthContext';
import LoadingScreen from 'components/LoadingScreen/index';
import axios from '../../../../node_modules/axios/index';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const AuthLogin = () => {
  const navigate = useNavigate();
  const [openLoading, setOpenLoading] = useState(false);

  const [checked, setChecked] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState({ email: false, password: false, submit: false });
  const [errors, setErrors] = useState({ email: '', password: '', submit: '' });

  const [snackbar, setSnackbar] = useState({ open: false, type: "", message: "" });

  const openSnackbar = (type, message) => setSnackbar({ open: true, type, message });
  const closeSnackbar = () => setSnackbar({ open: false, type: "", message: "" });

  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const handleSignIn = useCallback(async () => {
    setOpenLoading(true);
    const body = { email, password };

    if (errors.email || errors.password) {
      openSnackbar("error", "Fill in all the fields!");
      setOpenLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/auth/login/', body);

      if (response.status === 200) {
        // Handle successful authentication
        openSnackbar("success", "Login successful!");
        const data = await response.data;
        const jwtToken = data.jwt;
        console.log(data);

        let expiration = 5;
        if (checked) {
          expiration = 365;
        }
        login(jwtToken, expiration);

        // Redirect to the field page
        navigate('/Field');
      } else {
        // Handle sign-in error
        console.error('Sign-in failed');
        openSnackbar("error", "Sign-in failed!");
      }
    } catch (error) {
      console.error('An error occurred', error);
      if (error.response.data.error) {
        openSnackbar("error", error.response.data.error);
      } else {
        openSnackbar("error", "An error occurred!");
      }
    } finally {
      setOpenLoading(false);
    }
  }, [email, password, checked]);

  const handleEmailChange = useCallback((e) => {
    setEmail(e.target.value);
    if (e.target.value) {
      setTouched({ ...touched, email: false });
      setErrors({ ...errors, email: '' });
    } else {
      setTouched({ ...touched, email: true });
      setErrors({ ...errors, email: 'Email is required' });
    }
  }, [errors, touched]);

  const handlePasswordChange = useCallback((e) => {
    setPassword(e.target.value);
    if (e.target.value) {
      setTouched({ ...touched, password: false });
      setErrors({ ...errors, password: '' });
    } else {
      setTouched({ ...touched, password: true });
      setErrors({ ...errors, password: 'Password is required' });
    }
  }, [errors, touched]);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const formikInitialValues = useMemo(() => ({
    email: '',
    password: '',
    submit: null
  }), []);

  const formikValidationSchema = useMemo(() => Yup.object().shape({
    email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
    password: Yup.string().max(255).required('Password is required')
  }), [])

  return (
    <>
      <Formik
        initialValues={formikInitialValues}
        validationSchema={formikValidationSchema}
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
                onChange={handleEmailChange}
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
                onChange={handlePasswordChange}
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
          {/* <Grid item xs={12}>
            <FirebaseSocial />
          </Grid> */}
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
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={closeSnackbar}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        key={snackbar.type}
      >
        <Alert onClose={closeSnackbar} severity={snackbar.type} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      <LoadingScreen openLoading={openLoading} />
    </>
  );
};

export default React.memo(AuthLogin);