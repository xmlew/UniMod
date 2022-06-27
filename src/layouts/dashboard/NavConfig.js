// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: getIcon('eva:home-fill'),
  },
  {
    title: 'courses',
    path: '/dashboard/courses',
    icon: getIcon('eva:layers-fill'),
  },
  {
    title: 'discover',
    path: '/dashboard/discover',
    icon: getIcon('eva:search-fill'),
  },
  {
    title: 'popular modules',
    path: '/dashboard/popularmodules',
    icon: getIcon('eva:file-text-fill'),
  },
  {
    title: 'login',
    path: '/login',
    icon: getIcon('eva:lock-fill'),
  },
  {
    title: 'register',
    path: '/register',
    icon: getIcon('eva:person-add-fill'),
  },
  {
    title: 'Not found',
    path: '/404',
    icon: getIcon('eva:alert-triangle-fill'),
  },
];

export default navConfig;
