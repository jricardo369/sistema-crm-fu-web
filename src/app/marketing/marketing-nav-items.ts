// src/app/marketing/marketing-nav-items.ts
import { AppBarNavItem } from '../app-nav-item';
import { MARKETING,MARKETING_REV,DIG_MAR_MAN } from '../app.config';

export const MARKETING_MODULE: AppBarNavItem = {
  module: null,
  title: 'Marketing',
  subtitle: null,
  uri: 'marketing',
  svgName: 'users-report',
  isVisibleFor: u => [MARKETING, MARKETING_REV,DIG_MAR_MAN].some(rol => rol === u.rol)
};

export const MARKETING_ITEMS: AppBarNavItem[] = [
  {
    module: MARKETING_MODULE,
    svgName: 'users-report',
    title: 'Lawyers Prospects',
    subtitle: 'Manage lawyer prospects',
    uri: 'lawyers-prospects',
    isVisibleFor: u => [MARKETING,MARKETING_REV,DIG_MAR_MAN].some(rol => rol === u.rol)
  }
];
