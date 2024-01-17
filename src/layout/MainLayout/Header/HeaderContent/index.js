// material-ui
import { Box, useMediaQuery, Tooltip } from '@mui/material';
import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
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
  const { fieldId } = useParams();

  const [filling, setFilling] = useState('No Filling');

  const openWarningSB = () => setWarningSB(true);
  const closeWarningSB = () => setWarningSB(false);

  const [warningSB, setWarningSB] = useState(false);


  const matchesXs = useMediaQuery((theme) => theme.breakpoints.down('md'));

  const handleFarmSelected = (farm) => {
    selectedFarm(farm);
    onFarmSelect(farm.id); // Call the callback to update selected farm ID in Dashboard
  };

  const hanldeFillingSelect = (filling, flag) => {
    onFillingSelect(filling, flag);
    setFilling(filling);
  };

  return (
    <>
      {(location.pathname !== '/CropRotation' && !matchesXs) && (
        <Search />
      )}
      {<Box sx={{ width: '100%', ml: 1 }} />}

      <Box marginRight={1} marginLeft={1}>
        <FarmDropdownMenu onFarmSelect={handleFarmSelected} />
      </Box>

      {(location.pathname !== '/CropRotation' && location.pathname !== '/Jobs' && location.pathname !== '/SOM') && (
        <>
          <Box marginRight={1} >
            <FillingDropdownMenu onFillingSelect={hanldeFillingSelect} />
          </Box >
          {!fieldId &&
            <Box marginRight={1} >
              <ValueDropdownMenu onValueSelect={onValueSelect} />
            </Box>
          }
        </>
      )}

      {location.pathname === '/SOM' && (
        <Box marginRight={1} marginLeft={1}>

        </Box>
      )}
      {fieldId &&
        <Calendar />
      }
      {/* {!matchesXs && <Profile />} */}
      {matchesXs && <MobileSection />}
    </>
  );
};

export default HeaderContent;
