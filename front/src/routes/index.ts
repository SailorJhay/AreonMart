import { lazy } from 'react';
import NewToken from '../pages/NewToken';
import EditToken from '../pages/EditTokens';

const SFSManager = lazy(() => import('../pages/SFSManager'));
const Chart = lazy(() => import('../pages/Chart'));
const FormElements = lazy(() => import('../pages/Form/FormElements'));
const FormLayout = lazy(() => import('../pages/Form/FormLayout'));
const Profile = lazy(() => import('../pages/Profile'));
const MarketPlace = lazy(() => import('../pages/MarketPlace'));
const Alerts = lazy(() => import('../pages/UiElements/Alerts'));
const Buttons = lazy(() => import('../pages/UiElements/Buttons'));

const coreRoutes = [
  {
    path: '/editToken',
    title: 'Edit Token',
    component: EditToken,
    reqs: ['factory'],
  },
  {
    path: '/sfs',
    title: 'SFS Manager',
    component: SFSManager,
  },
  {
    path: '/profile',
    title: 'Profile',
    component: Profile,
  },
  {
    path: '/forms/form-elements',
    title: 'Forms Elements',
    component: FormElements,
  },
  {
    path: '/forms/form-layout',
    title: 'Form Layouts',
    component: FormLayout,
  },
  {
    path: '/marketPlace',
    title: 'MarketPlace',
    component: MarketPlace,
  },
  {
    path: '/newToken',
    title: 'New Token',
    component: NewToken,
  },
  {
    path: '/chart',
    title: 'Chart',
    component: Chart,
  },
  {
    path: '/ui/alerts',
    title: 'Alerts',
    component: Alerts,
  },
  {
    path: '/ui/buttons',
    title: 'Buttons',
    component: Buttons,
  },
];

const routes = [...coreRoutes];
export default routes;
