// material-ui
import { Box, useMediaQuery, Tooltip } from '@mui/material';
import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import Zoom from '@mui/material/Zoom';


// project import
import Search from './Search';
import MobileSection from './MobileSection';
import FarmDropdownMenu from "components/FarmDropdownMenu";
import FillingDropdownMenu from "components/FillingDropdownMenu";
import ValueDropdownMenu from "components/ValueDropdownMenu";
import Calendar from 'components/Calendar/Calendar';
// import MDSnackbar from 'components/MDSnackbar/index';


// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent = ({ onFarmSelect, onFillingSelect, onValueSelect, selectedFarm }) => {
  const location = useLocation();

  const [filling, setFilling] = useState('No Filling');

  const openWarningSB = () => setWarningSB(true);
  const closeWarningSB = () => setWarningSB(false);

  const [warningSB, setWarningSB] = useState(false);


  const matchesXs = useMediaQuery((theme) => theme.breakpoints.down('md'));

  const handleFarmSelected = (farm) => {
    selectedFarm(farm);
    onFarmSelect(farm.id); // Call the callback to update selected farm ID in Dashboard
  };

  const hanldeFillingSelect = (filling) => {
    onFillingSelect(filling);
    setFilling(filling);
  };

  // const renderWarningSB = (
  //   <MDSnackbar
  //     color="warning"
  //     icon="star"
  //     title="Warning"
  //     content="Please Select Farm First"
  //     // dateTime="11 mins ago"
  //     open={warningSB}
  //     onClose={closeWarningSB}
  //     close={closeWarningSB}
  //     bgWhite
  //   />
  // );

  return (
    <>
      {!matchesXs && <Search />}
      {/* <Tooltip
        title="Select Farm"
        placement="top"
        TransitionComponent={Zoom}
      > */}
      <Box marginRight={1} marginLeft={1}>
        <FarmDropdownMenu onFarmSelect={handleFarmSelected} />
        {/* Add Farm Modal */}
      </Box>
      {/* </Tooltip> */}
      {matchesXs && <Box sx={{ width: '100%', ml: 1 }} />}


      {/* {renderWarningSB} */}

      {location.pathname !== '/CropRotation' && (
        <>
          {/* <Tooltip title="Select Filling" placement="bottom" TransitionComponent={Zoom} > */}
          <Box marginRight={1} >
            <FillingDropdownMenu onFillingSelect={hanldeFillingSelect} />
          </Box >
          {/* </Tooltip> */}
          {/* <Tooltip title="Select Value" placement="bottom" TransitionComponent={Zoom}> */}
          <Box marginRight={1} >
            <ValueDropdownMenu onValueSelect={onValueSelect} />
          </Box>
          {/* </Tooltip> */}
        </>
      )}
      {(filling === 'NDVI' || filling === 'Contrasted NDVI') &&
        <Calendar />
      }
      {/* {!matchesXs && <Profile />} */}
      {matchesXs && <MobileSection />}
    </>
  );
};

export default HeaderContent;
