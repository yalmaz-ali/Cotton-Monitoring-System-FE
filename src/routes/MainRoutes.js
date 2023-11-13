// import { lazy } from 'react';

// // project import
// import Loadable from 'components/Loadable';
// import MainLayout from 'layout/MainLayout';
// import { Navigate } from 'react-router-dom';

// // render - dashboard
// const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));

// // render - sample page
// const SamplePage = Loadable(lazy(() => import('pages/extra-pages/SamplePage')));

// // render - utilities
// const Job = Loadable(lazy(() => import('pages/components-overview/Jobs')));
// const Fields = Loadable(lazy(() => import('pages/components-overview/Fields')));
// const CropRotation = Loadable(lazy(() => import('pages/components-overview/CropRotation')));
// const AntIcons = Loadable(lazy(() => import('pages/components-overview/AntIcons')));
// //const AuthLogin = Loadable(lazy(() => import('pages/authentication/Login')));
// // ==============================|| MAIN ROUTING ||============================== //

// const MainRoutes = {
//   path: '/',
//   element: <MainLayout />,
//   children: [
//     {
//       path: '/',
//       element: <Navigate to="/field" replace />
//     },
//     {
//       path: 'field',
//       element: <Fields />
//     },
//     {
//       path: 'dashboard',
//       element: <DashboardDefault />
//     },
//     {
//       path: 'sample-page',
//       element: <SamplePage />
//     },
//     {
//       path: 'shadow',
//       element: <CropRotation />
//     },
//     {
//       path: 'typography',
//       element: <Job />
//     },
//     {
//       path: 'icons/ant',
//       element: <AntIcons />
//     }
//   ]
// };

// export default MainRoutes;