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

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = ({
  onFarmSelect,
  onSeasonSelect,
  onFillingSelect,
  onValueSelect,
  // handleCoordinatesChange,
  // setIsDialogOpen,
  // handleMapLoad
}) => {
  const theme = useTheme();
  const matchDownLG = useMediaQuery(theme.breakpoints.down('lg'));
  const dispatch = useDispatch();

  // const apiKey = process.env.REACT_APP_GOOGLE_KEY;
  // const navigate = useNavigate();
  // const jwtToken = Cookies.get("jwt");

  const { drawerOpen } = useSelector((state) => state.menu);
  const [selectedFarm, setSelectedFarm] = useState(null);

  const handleSelectedFarm = (farm) => {
    setSelectedFarm(farm);
  };

  // let [mainMap, setMainMap] = useState(null);
  // const [coordinates, setCoordinates] = useState(null);

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

  const jwtToken = Cookies.get("jwt");
  const navigate = useNavigate();
  const apiKey = process.env.REACT_APP_GOOGLE_KEY;

  useEffect(() => {
    getUser();
  }, [apiKey, jwtToken]);

  // useEffect(() => {
  //   const script = document.createElement('script');
  //   script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=drawing,geometry,places`;
  //   script.async = true;
  //   script.defer = true;
  //   document.body.appendChild(script);

  //   return () => {
  //     document.body.removeChild(script);
  //   }
  // }, []);

  const getUser = async () => {
    try {
      const response = await axios("http://localhost:8000/auth/user/", { withCredentials: true });

      if (response.status !== 200) {
        navigate("/auth/login");
      } else {
        console.log(response.data);
      }
    } catch (error) {
      console.error("An error occurred", error);
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
