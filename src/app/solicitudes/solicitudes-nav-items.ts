// src/app/solicitudes/solicitudes-nav-items.ts
import { AppBarNavItem } from '../app-nav-item';
import { BACKOFFICE, GHOSTWRITING, INTERVIEWER, INTERVIEWER_SCALES, MASTER, TEMPLATE_CREATOR, THERAPIST, VENDOR, VOC, CLINICIAN } from '../app.config';

export const SOLICITUDES_MODULE: AppBarNavItem = {
  module: null,
  title: 'Files',
  subtitle: null,
  uri: 'solicitudes',
  svgName: 'assignment',
  isVisibleFor: u => [MASTER, VENDOR, BACKOFFICE, INTERVIEWER, VOC, TEMPLATE_CREATOR, 
                      INTERVIEWER_SCALES, GHOSTWRITING, THERAPIST, CLINICIAN]
                      .some(rol => rol === u.rol)
};

export const SOLICITUDES_ITEMS: AppBarNavItem[] = [
  {
    module: SOLICITUDES_MODULE,
    svgName: 'assignment-ind',
    title: 'Files',
    subtitle: 'Manage Files',
    uri: 'solicitudes',
    isVisibleFor: u => [MASTER, VENDOR, BACKOFFICE, INTERVIEWER, TEMPLATE_CREATOR, 
                       INTERVIEWER_SCALES, GHOSTWRITING, CLINICIAN]
                       .some(rol => rol === u.rol)
  },
  {
    module: SOLICITUDES_MODULE,
    svgName: 'assignment-ind',
    title: 'Files VOC',
    subtitle: 'Manage Files VOC',
    uri: 'solicitudes-voc',
    isVisibleFor: u => [VOC, THERAPIST].some(rol => rol === u.rol)
  },
  {
    module: SOLICITUDES_MODULE,
    svgName: 'calendarMenuD',
    title: 'Schedules',
    subtitle: 'See scheduled appointments',
    uri: 'citas',
    isVisibleFor: u => [MASTER, VENDOR, BACKOFFICE, INTERVIEWER, 
                       INTERVIEWER_SCALES, THERAPIST, CLINICIAN]
                       .some(rol => rol === u.rol)
  },
  {
    module: SOLICITUDES_MODULE,
    svgName: 'pay-per-click-payment',
    title: 'VOC Charges',
    subtitle: 'Charges from Files VOC',
    uri: 'cargos-voc',
    isVisibleFor: u => [VOC].some(rol => rol === u.rol)
  }
];