import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom";

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Box,
  ButtonBase,
  CardContent,
  ClickAwayListener,
  Grid,
  IconButton,
  Paper,
  Popper,
  Stack,
  Typography,
  Tab,
  Tabs
} from '@mui/material';

// assets

import { UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import MainCard from 'components/MainCard';

// project import
import Transitions from 'components/@extended/Transitions';
import ProfileTab from './ProfileTab';
import SettingTab from './SettingTab';

// assets
// import avatar1 from 'assets/images/users/avatar-3.png';
import { useAuth } from "context/auth-context/AuthContext";
import axios from "axios";
import { drawerWidth } from 'config';
import { Tooltip } from '../../../../../../node_modules/@mui/material/index';

// tab panel wrapper
function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`profile-tabpanel-${index}`} aria-labelledby={`profile-tab-${index}`} {...other}>
      {value === index && children}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `profile-tab-${index}`,
    'aria-controls': `profile-tabpanel-${index}`
  };
}

// ==============================|| HEADER CONTENT - PROFILE ||============================== //

const Profile = () => {
  const theme = useTheme();

  const { logout } = useAuth();
  const navigate = useNavigate();

  const [userData, setUserData] = useState({ username: 'Undefined' });

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8000/auth/logout/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        }
      });

      if (response.ok) {
        logout();
        navigate('/auth/login');
      } else {
        // Handle sign-in error
        console.error("Logout failed");
      }
    } catch (error) {
      alert("Try Again!");
      console.error("An error occurred", error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const response = await axios.get("http://localhost:8000/auth/user/", { withCredentials: true });

      if (response.status === 200) {
        // const data = await response.json();
        console.log(response.data);
        setUserData(response.data);
      } else {
        navigate("/auth/login");
        // Handle sign-in error
        console.error("Login failed", response.data);
      }
    } catch (error) {
      navigate("/auth/login");
      console.error("An error occurred", error);
    }
  };

  // const anchorRef = useRef(null);
  // const [open, setOpen] = useState(false);
  // const handleToggle = () => {
  //   setOpen((prevOpen) => !prevOpen);
  // };

  // const handleClose = (event) => {
  //   if (anchorRef.current && anchorRef.current.contains(event.target)) {
  //     return;
  //   }
  //   setOpen(false);
  // };

  // const [value, setValue] = useState(0);

  // const handleChange = (event, newValue) => {
  //   setValue(newValue);
  // };

  // const iconBackColorOpen = 'grey.300';


  function stringAvatar(name) {
    const nameParts = name.split(' ');
    let initials;

    if (nameParts.length > 1) {
      // If the name contains two words, get the first letter of each word and convert to uppercase
      initials = `${nameParts[0][0].toUpperCase()}${nameParts[1][0].toUpperCase()}`;
    } else {
      // If the name contains one word, get the first letter of the word and convert to uppercase
      initials = `${nameParts[0][0].toUpperCase()}`;
    }

    return {
      sx: {
        bgcolor: '#42b33b',
      },
      children: initials,
    };
  }



  return (
    <Box sx={{ flexShrink: 0, }}>
      <ButtonBase
        sx={{
          // p: 0.25,
          // bgcolor: open ? iconBackColorOpen : 'transparent',
          borderRadius: 1,
          // '&:hover': { bgcolor: 'secondary.lighter' },
          minWidth: drawerWidth,
          cursor: 'auto'
        }}
        // aria-label="open profile"
        // ref={anchorRef}
        // aria-controls={open ? 'profile-grow' : undefined}
        // aria-haspopup="true"
        // onClick={handleToggle}
        disableRipple
      >
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{ p: 0.5 }}
          minWidth='100%'
          justifyContent="space-between"
        >
          {/* <Avatar alt="profile user" sx={{ width: 35, height: 35 }} >
            {userData.username}
          </Avatar> */}
          <Avatar {...stringAvatar(userData.username)} />
          <Stack>
            <Typography variant="subtitle1">
              {userData.username}
            </Typography>
            <Typography variant="body2" color="#585858">
              Farm Owner
            </Typography>
          </Stack>
          <div
            style={{
              marginRight: '10px',
              cursor: 'pointer'
            }}
            onClick={handleLogout}
          >
            <Tooltip title="Logout">
              <LogoutOutlined
                style={{
                  fontSize: '20px',
                  color: '#585858'
                }}
              />
            </Tooltip>
          </div>
        </Stack>
      </ButtonBase>
      {/* <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 9]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions type="fade" in={open} {...TransitionProps}>
            {open && (
              <Paper
                sx={{
                  boxShadow: theme.customShadows.z1,
                  width: 200,
                  minWidth: 200,
                  maxWidth: 200,
                  [theme.breakpoints.down('md')]: {
                    maxWidth: 250
                  }
                }}
              >
                <ClickAwayListener onClickAway={handleClose}>
                  <MainCard elevation={0} border={false} content={false}>
                    <CardContent sx={{ px: 2.5, pt: 3 }}>
                      <Grid container justifyContent="space-between" alignItems="center">
                        <Grid item>
                          <Stack direction="row" spacing={1.25} alignItems="center">
                            <Avatar alt="profile user" src={avatar1} sx={{ width: 32, height: 32 }} />
                            <Stack>
                              <Typography variant="h6">Yalmaz Ali</Typography>
                              <Typography variant="body2" color="textSecondary">
                                Farm Owner
                              </Typography>
                            </Stack>
                          </Stack>
                        </Grid>
                        <Grid item>
                          <IconButton size="large" color="secondary" onClick={handleLogout}>
                            <LogoutOutlined />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </CardContent>
                    {open && (
                      <>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                          <Tabs variant="fullWidth" value={value} onChange={handleChange} aria-label="profile tabs">
                            <Tab
                              sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                textTransform: 'capitalize'
                              }}
                              icon={<UserOutlined style={{ marginBottom: 0, marginRight: '10px' }} />}
                              label="Profile"
                              {...a11yProps(0)}
                            />
                            <Tab
                              sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                textTransform: 'capitalize'
                              }}
                              icon={<SettingOutlined style={{ marginBottom: 0, marginRight: '10px' }} />}
                              label="Setting"
                              {...a11yProps(1)}
                            />
                          </Tabs>
                        </Box>
                        <TabPanel value={value} index={0} dir={theme.direction}>
                          <ProfileTab handleLogout={handleLogout} />
                        </TabPanel>
                        <TabPanel value={value} index={1} dir={theme.direction}>
                          <SettingTab />
                        </TabPanel>
                      </>
                    )}
                  </MainCard>
                </ClickAwayListener>
              </Paper>
            )}
          </Transitions>
        )}
      </Popper> */}
    </Box>
  );
};

export default Profile;
