import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import axios from "axios";

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Toolbar, useMediaQuery } from '@mui/material';

// project import
import MainDrawer from './Drawer';

import Header from './Header';

// types
import { openDrawer } from 'store/reducers/menu';
import { useAuth } from './../../context/auth-context/AuthContext';

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = ({
  onFarmSelect,
  onSeasonSelect,
  onFillingSelect,
  onValueSelect
}) => {
  const { authenticated, logout } = useAuth();
  const theme = useTheme();
  const matchDownLG = useMediaQuery(theme.breakpoints.down('lg'));
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { drawerOpen } = useSelector((state) => state.menu);
  const [selectedFarm, setSelectedFarm] = useState(null);

  const handleSelectedFarm = (farm) => {
    setSelectedFarm(farm);
  };

  // drawer toggler
  const [open, setOpen] = useState(drawerOpen);
  const handleDrawerToggle = () => {
    setOpen(!open);
    dispatch(openDrawer({ drawerOpen: !open }));
  };

  // set media wise responsive drawer
  useEffect(() => {
    setOpen(!matchDownLG);
    dispatch(openDrawer({ drawerOpen: !matchDownLG }));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchDownLG]);

  useEffect(() => {
    if (open !== drawerOpen) setOpen(drawerOpen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawerOpen]);


  useEffect(() => {
    const jwtToken = Cookies.get('jwt');
    if (!jwtToken) {
      console.log("no jwt token");
      logout();
      navigate('/auth/login');
      return;
    }
    getUser();
  }, [authenticated, navigate]);

  const getUser = async () => {
    try {
      const response = await axios.get('http://localhost:8000/auth/user/', {
        withCredentials: true,
      });
      const user = response.data;
      if (user) {
        console.log("user", user);
      } else {
        logout();
        navigate('/auth/login');
      }
    } catch (error) {
      logout();
      navigate('/auth/login');
    }
  };

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <Header open={open} handleDrawerToggle={handleDrawerToggle} onFarmSelect={onFarmSelect} onFillingSelect={onFillingSelect} onValueSelect={onValueSelect} selectedFarm={handleSelectedFarm} />
      <MainDrawer open={open} handleDrawerToggle={handleDrawerToggle} onSeasonSelect={onSeasonSelect} selectedFarm={selectedFarm} />
      <Box
        component="main"
        sx={{
          width: '100%',
          flexGrow: 1,
        }}>
        <Toolbar />

        {/* <Breadcrumbs navigation={menuItems} title /> */}
        <Outlet />
      </Box>
    </Box>
  );

};

export default MainLayout;
