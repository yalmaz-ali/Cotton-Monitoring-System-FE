// assets
import {
  AppstoreAddOutlined,
  AntDesignOutlined,
  BarcodeOutlined,
  BgColorsOutlined,
  FontSizeOutlined,
  LoadingOutlined,
  RobotOutlined,
} from '@ant-design/icons';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import fieldIcon from "assets/images/icons/fieldIcon.png";
import crop_rotation from "assets/images/icons/crop-rotation.png";
import jobs from "assets/images/icons/jobs.png";

const utilities = {
  id: 'utilities',
  title: ' ',
  type: 'group',
  children: [

    {
      id: 'util-color',
      title: 'Field',
      type: 'item',
      url: '/field',
      icon: fieldIcon,
    },
    {
      id: 'util-crop-rotation',
      title: 'Crop Rotation',
      type: 'item',
      url: '/crop-rotation',
      icon: crop_rotation
    },
    {
      id: 'util-jobs',
      title: 'Jobs',
      type: 'item',
      url: '/jobs',
      icon: jobs
    },
    {
      id: 'utils-about',
      title: 'About',
      type: 'item',
      url: '/about',
      icon: RobotOutlined,
      disabled: true

    },
    {
      id: 'utils-logout',
      title: 'Logout',
      type: 'item',
      url: '/logout',
      icon: LogoutOutlinedIcon,
      disabled: true

    }
  ]
};

export default utilities;