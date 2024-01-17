// assets
import {
  AppstoreAddOutlined,
  AntDesignOutlined,
  BarcodeOutlined,
  BgColorsOutlined,
  FontSizeOutlined,
  LoadingOutlined,
  RobotOutlined,
  BookOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';

import fieldIcon from "assets/images/icons/fieldIcon.png";
import crop_rotation from "assets/images/icons/crop-rotation.png";
// import jobs from "assets/images/icons/jobs.png";

const utilities = {
  id: 'utilities',
  title: '',
  type: 'group',
  children: [
    {
      id: 'util-color',
      title: 'Field',
      type: 'item',
      url: '/Field',
      icon: AppstoreAddOutlined,
    },
    {
      id: 'utils-SOM',
      title: 'Soil Organic Matter',
      type: 'item',
      url: '/SOM',
      icon: AutoStoriesOutlinedIcon
    },
    {
      id: 'util-CropRotation',
      title: 'Crop Rotation',
      type: 'item',
      url: '/CropRotation',
      icon: AntDesignOutlined
    },
    {
      id: 'util-jobs',
      title: 'Jobs',
      type: 'item',
      url: '/Jobs',
      icon: BarcodeOutlined
    },
    {
      id: 'utils-guide',
      title: 'User Guide',
      type: 'item',
      url: '/guide',
      icon: BookOutlined,
      // disabled: true,
      // external: true,
      // target: true
    },
  ]
};

export default utilities;