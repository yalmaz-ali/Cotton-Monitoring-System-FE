import { useRoutes } from 'react-router-dom';
import { lazy, useState } from 'react';

import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';
import { Navigate } from 'react-router-dom';
import MinimalLayout from 'layout/MinimalLayout';

// render - login
const AuthLogin = Loadable(lazy(() => import('pages/authentication/Login')));
const AuthRegister = Loadable(lazy(() => import('pages/authentication/Register')));


// render - mainPages
const Jobs = Loadable(lazy(() => import('pages/components-overview/Jobs')));
const Fields = Loadable(lazy(() => import('pages/components-overview/Fields')));
const CropRotation = Loadable(lazy(() => import('pages/components-overview/CropRotation')));


function ThemeRoutes() {
  const [farm, setFarm] = useState(null);
  const [season, setSeason] = useState(null);
  const [filling, setFilling] = useState(null);
  const [value, setValue] = useState(null);

  const MainRoutes = {
    path: '/',
    element: <MainLayout
      onFarmSelect={setFarm}
      onSeasonSelect={setSeason}
      onFillingSelect={setFilling}
      onValueSelect={setValue}
    />,
    children: [
      {
        path: '/',
        element: <Navigate to="/field" replace />
      },
      {
        path: 'field',
        element: <Fields
          farm={farm}
          season={season}
          filling={filling}
          value={value}
        />
      },
      {
        path: 'crop-rotation',
        element: <CropRotation
          farm={farm}
        />
      },
      {
        path: 'jobs',
        element: <Jobs
          farm={farm}
          season={season}
        />
      },
      {
        path: 'about',
        element: <div>About</div>
      },
      {
        path: 'logout',
        element: <div>Logout</div>
      }
    ]
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

  return useRoutes([MainRoutes, LoginRoutes]);
}

export default ThemeRoutes;