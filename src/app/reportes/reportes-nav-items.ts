// src/app/reportes/reportes-nav-items.ts
import { AppBarNavItem } from '../app-nav-item';
import { BACKOFFICE, GHOSTWRITING, MASTER, VENDOR, VOC } from '../app.config';

export const REPORTES_MODULE: AppBarNavItem = {
  module: null,
  title: 'Reports',
  subtitle: null,
  uri: 'reportes',
  svgName: 'reports',
  isVisibleFor: u => [MASTER, VENDOR, BACKOFFICE, GHOSTWRITING, VOC, VENDOR].some(rol => rol === u.rol)
};

export const REPORTES_ITEMS: AppBarNavItem[] = [
  {
    module: REPORTES_MODULE,
    svgName: 'users-report',
    title: 'Users Files',
    subtitle: 'Reporting of users files',
    uri: 'solicitudes-usuarios',
    isVisibleFor: u => [MASTER, BACKOFFICE].some(rol => rol === u.rol) || u.usuario === 'ojuarez'
  },
  {
    module: REPORTES_MODULE,
    svgName: 'payment',
    title: 'Payments',
    subtitle: 'Payments report',
    uri: 'pagos',
    isVisibleFor: u => [MASTER, VENDOR, BACKOFFICE, GHOSTWRITING].some(rol => rol === u.rol)
  },
  {
    module: REPORTES_MODULE,
    svgName: 'clasesg',
    title: 'Law Firm Files',
    subtitle: 'Report of Law Firm Files',
    uri: 'correos-enviados',
    isVisibleFor: u => [MASTER, BACKOFFICE, VOC,VENDOR].some(rol => rol === u.rol)
  },
  {
    module: REPORTES_MODULE,
    svgName: 'users-report',
    title: 'Law Firms Lawyers',
    subtitle: 'Report of Law Firms Lawyers',
    uri: 'reportes-abogados',
    isVisibleFor: u => [MASTER, BACKOFFICE, VOC, VENDOR].some(rol => rol === u.rol)
  },
  {
    module: REPORTES_MODULE,
    svgName: 'comparison',
    title: 'Comparison by Years',
    subtitle: 'Report of files comparison by years',
    uri: 'comparacion-anios',
    isVisibleFor: u => [MASTER].some(rol => rol === u.rol) || u.usuario === 'edgar' || u.usuario === 'juan' || u.usuario === 'ojuarez'
  }
  ,{
    module: REPORTES_MODULE,
    svgName: 'dashboard',
    title: 'Dashboard',
    subtitle: 'Dashboard',
    uri: 'reporte-dashboard',
    isVisibleFor: u => [MASTER,BACKOFFICE].some(rol => rol === u.rol)  || u.usuario === 'juan' || u.usuario === 'ojuarez'
  }
];