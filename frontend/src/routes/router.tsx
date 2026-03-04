import { Suspense, lazy } from 'react';
import { Outlet, createBrowserRouter, useLocation } from 'react-router';
import type { RouteObject } from 'react-router';
import App from '../App';
import AuthLayout from 'layouts/auth-layout';
import MainLayout from 'layouts/main-layout';
import Page404 from 'pages/errors/Page404';
import PageLoader from 'components/loading/PageLoader';
import paths, { rootPaths } from './paths';
import MapComponent from 'components/Map';

const Analytics = lazy(() => import('pages/dashboard/Analytics'));
const UserList = lazy(() => import('pages/users/UserList'));
const ProjectList = lazy(() => import('pages/projects/ProjectList'));
const CreateProject = lazy(() => import('pages/projects/CreateProject'));
const EditProject = lazy(() => import('pages/projects/EditProject'));
const Starter = lazy(() => import('pages/others/Starter'));

const Login = lazy(() => import('pages/authentication/Login'));
const Signup = lazy(() => import('pages/authentication/Signup'));

export const SuspenseOutlet = () => {
  const location = useLocation();

  return (
    <Suspense key={location.pathname} fallback={<PageLoader />}>
      <Outlet />
    </Suspense>
  );
};

export const routes: RouteObject[] = [
  {
    element: <App />,
    children: [
      {
        path: '/',
        element: (
          <MainLayout>
            <SuspenseOutlet />
          </MainLayout>
        ),
        children: [
          {
            index: true,
            element: <Analytics />,
          },
          {
            path: paths.map,
            element: <MapComponent />,
          },
          {
            path: paths.users,
            element: <UserList />,
          },
          {
            path: paths.projects,
            element: <ProjectList />,
          },
          {
            path: paths.createProject,
            element: <CreateProject />,
          },
          {
            path: '/projects/edit/:id',
            element: <EditProject />,
          },
          {
            path: paths.starter,
            element: <Starter />,
          },
        ],
      },
      {
        path: rootPaths.authRoot,
        element: (
          <AuthLayout>
            <SuspenseOutlet />
          </AuthLayout>
        ),
        children: [
          {
            path: paths.login,
            element: <Login />,
          },
          {
            path: paths.signup,
            element: <Signup />,
          },
        ],
      },

      {
        path: paths['404'],
        element: <Page404 />,
      },
      {
        path: '*',
        element: <Page404 />,
      },
    ],
  },
];

const router = createBrowserRouter(routes, {
  basename: import.meta.env.MODE === 'production' ? import.meta.env.VITE_BASENAME : '/',
});

export default router;
