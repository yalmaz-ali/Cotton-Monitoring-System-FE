import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
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
import { strengthColor, strengthIndicator } from 'utils/password-strength';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import LoadingScreen from 'components/LoadingScreen';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const AuthRegister = () => {
  const navigate = useNavigate();

  const [openLoading, setOpenLoading] = useState(false);

  const [level, setLevel] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [touched, setTouched] = useState({ username: false, email: false, password: false, submit: false });
  const [errors, setErrors] = useState({ username: '', email: '', password: '', submit: '' });

  const [snackbar, setSnackbar] = useState({ open: false, type: "", message: "" });

  const openSnackbar = (type, message) => setSnackbar({ open: true, type, message });
  const closeSnackbar = () => setSnackbar({ open: false, type: "", message: "" });

  const handleSignup = useCallback(async () => {
    setOpenLoading(true);

    if (errors.username || errors.email || errors.password) {
      openSnackbar("warning", "Please fill all the fields!");
      setOpenLoading(false);
      return;
    }

    if (errors.email) {
      openSnackbar("warning", "Please enter a valid email!");
      setOpenLoading(false);
      return;
    }

    const data = {
      username: name,
      email: email,
      password: password,
    };

    console.log("data", data);
    try {
      const response = await axios.post('http://localhost:8000/auth/register/', data);

      if (response.status === 200) {
        console.log('User registered successfully!');
        openSnackbar("success", "User registered successfully!");
        navigate('/auth/login');
      } else {
        console.log('Error! User already exists.');
        openSnackbar("error", "Error! User already exists.");
      }
    } catch (error) {
      console.log("error", error);
      if (error.response.data.email) {
        openSnackbar("error", error.response.data.email[0]);
      } else if (error.response.data.username) {
        openSnackbar("error", error.response.data.username[0]);
      } else {
        openSnackbar("error", "Error! Something went wrong.");
      }
    } finally {
      setOpenLoading(false);
    }
  }, [name, email, password]);

  const handleClickShowPassword = useCallback(() => {
    setShowPassword(!showPassword);
  }, [showPassword]);

  const handleMouseDownPassword = useCallback((event) => {
    event.preventDefault();
  }, []);

  const changePassword = useCallback((value) => {
    const temp = strengthIndicator(value);
    setLevel(strengthColor(temp));
  }, []);

  useEffect(() => {
    changePassword('');
  }, [changePassword]);

  const validationSchema = useMemo(() => Yup.object().shape({
    username: Yup.string().max(255).required('UserName is required'),
    email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
    password: Yup.string().max(255).required('Password is required')
  }), []);

  return (
    <>
      <Formik
        initialValues={{
          username: '',
          email: '',
          password: '',
          submit: null
        }}
        validationSchema={validationSchema}
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
              <InputLabel htmlFor="username-signup">Username</InputLabel>
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
              <InputLabel htmlFor="email-signup">Email Address</InputLabel>
              <OutlinedInput
                fullWidth
                error={Boolean(touched.email && errors.email)}
                id="email-signup"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  if (e.target.value && emailRegex.test(e.target.value)) {
                    setTouched({ ...touched, email: false });
                    setErrors({ ...errors, email: '' });
                  } else {
                    setTouched({ ...touched, email: true });
                    setErrors({ ...errors, email: 'Invalid email address' });
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
            {password && (
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
            )}
          </Grid>
          {errors.submit && (
            <Grid item xs={12}>
              <FormHelperText error>{errors.submit}</FormHelperText>
            </Grid>
          )}
          {/* <Grid item xs={12}>
            <FirebaseSocial />
          </Grid> */}
          <Grid item xs={12}>
            <AnimateButton>
              <Button
                disableElevation
                onClick={handleSignup}
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

export default React.memo(AuthRegister);
