import { AppBarNavItem } from '../app-nav-item';

export const MODULE: AppBarNavItem = {
  module: null,
  title: 'General Administration',
  subtitle: null,
  uri: 'administracion-general',
  svgName: 'administracion',
  isVisibleFor: u => u.rol == "1" || u.rol == "6" || u.rol == "3" || u.rol == "4" || u.rol == "8"
};

export const ADMIN_GENERAL_ITEMS: AppBarNavItem[] = [
  {
    module: MODULE,
    svgName: 'users2',
    title: 'Users',
    subtitle: 'Manage the users and their permissions',
    uri: 'usuarios',
    isVisibleFor: u => u.rol == "1"
  },
  {
    module: MODULE,
    svgName: 'lawyers',
    title: 'Lawyers',
    subtitle: 'Manage the lawyers',
    uri: 'abogados',
    isVisibleFor: u => u.rol == "1" || u.rol == "6" || u.rol == "8" || u.usuario == "ojuarez"
  },
  {
    module: MODULE,
    svgName: 'settings',
    title: 'Settings',
    subtitle: 'Manage the settings',
    uri: 'configuraciones',
    isVisibleFor: u => u.rol == "1"
  },
  {
    module: MODULE,
    svgName: 'messagesD',
    title: 'Message Settings',
    subtitle: 'Manage messages settings',
    uri: 'message-settings',
    isVisibleFor: u => u.rol == "1"
  },
  {
    module: MODULE,
    svgName: 'integrationsD',
    title: 'Integrations config',
    subtitle: 'Integrations config',
    uri: 'config-integrations',
    isVisibleFor: u => u.rol == "1"
  },
  {
    module: MODULE,
    svgName: 'update',
    title: 'Scheduled Tasks',
    subtitle: 'Manage the scheduled tasks',
    uri: 'tareas-programadas',
    isVisibleFor: u => u.rol == "1" 
  }
];