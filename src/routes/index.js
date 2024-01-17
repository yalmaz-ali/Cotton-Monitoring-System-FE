import { useRoutes } from 'react-router-dom';
import { lazy, useState } from 'react';

import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';
import { Navigate } from 'react-router-dom';
import MinimalLayout from 'layout/MinimalLayout';

// render - error
import NotFoundPage from 'pages/components-overview/component/NotFoundPage';

// render - login
const AuthLogin = Loadable(lazy(() => import('pages/authentication/Login')));
const AuthRegister = Loadable(lazy(() => import('pages/authentication/Register')));


// render - mainPages
const Jobs = Loadable(lazy(() => import('pages/Jobs/Jobs')));
const Fields = Loadable(lazy(() => import('pages/Fields/Fields')));
const CropRotation = Loadable(lazy(() => import('pages/Crop Rotation/CropRotation')));
const Guide = Loadable(lazy(() => import('pages/Guide/Guide')));
const SOM = Loadable(lazy(() => import('pages/SOM')));


function Routes() {
  const [farm, setFarm] = useState(null);
  const [season, setSeason] = useState(null);
  const [filling, setFilling] = useState(null);
  const [flag, setFlag] = useState(null);
  const [value, setValue] = useState(null);
  const [Som, setSom] = useState(null);

  const handleFilling = (filling, flag) => {
    setFilling(filling);
    setFlag(flag);
  };

  const MainRoutes = {
    path: '/',
    element: <MainLayout
      onFarmSelect={setFarm}
      onSeasonSelect={setSeason}
      onFillingSelect={handleFilling}
      onValueSelect={setValue}
      onChangeSOM={setSom}
    />,
    children: [
      {
        path: '/',
        element: <Navigate to="/Field" replace />
      },
      {
        path: 'Field/:fieldId?/:date?',
        element: <Fields
          farm={farm}
          season={season}
          filling={filling}
          value={value}
          flag={flag}
        />
      },
      {
        path: 'CropRotation',
        element: <CropRotation
          farm={farm}
        />
      },
      {
        path: 'Jobs',
        element: <Jobs
          farm={farm}
          season={season}
        />
      },
      {
        path: 'SOM/:SomFieldId?/:time?',
        element: <SOM
          farm={farm}
          season={season}
          Som={Som}
        />
      }
    ]
  };

  const ErrorRoutes = {
    path: '*',
    element: < NotFoundPage />
  };

  const GuideRoute = {
    path: '/guide',
    element: <Guide />
  };

  const LoginRoutes = {
    path: '/auth',
    element: <MinimalLayout />,
    children: [
      {
        path: 'login',
        element: <AuthLogin />
      },
      {
        path: 'register',
        element: <AuthRegister />
      }
    ]
  };

  return useRoutes([MainRoutes, LoginRoutes, ErrorRoutes, GuideRoute]);
}

export default Routes;