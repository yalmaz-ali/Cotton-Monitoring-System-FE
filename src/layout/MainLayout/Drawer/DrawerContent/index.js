// project import
//import NavCard from './NavCard';
import SeasonDropdownMenu from 'components/SeasonDropdownMenu/index';
import Navigation from './Navigation';
import SimpleBar from 'components/third-party/SimpleBar';
import { Divider } from '../../../../../node_modules/@mui/material/index';

// ==============================|| DRAWER CONTENT ||============================== //

const DrawerContent = ({ onSeasonSelect, selectedFarm }) => (
  <SimpleBar
    sx={{
      '& .simplebar-content': {
        display: 'flex',
        flexDirection: 'column'
      }
    }}
  >
    <Divider style={{ marginBottom: 3 }} />
    <SeasonDropdownMenu onSeasonSelect={onSeasonSelect} selectedFarm={selectedFarm} />
    <Divider style={{ marginTop: 3 }} />
    <Navigation />
    {/* <NavCard /> */}
  </SimpleBar>
);

export default DrawerContent;
