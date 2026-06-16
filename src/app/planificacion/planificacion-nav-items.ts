// src/app/planificacion/nav-items.ts
import { AppBarNavItem } from '../app-nav-item';
import { INTERVIEWER, INTERVIEWER_SCALES, CLINICIAN, THERAPIST } from '../app.config';

export const PLANIFICACION_MODULE: AppBarNavItem = {
  module: null,
  title: 'Planning',
  subtitle: null,
  uri: 'planificacion',
  svgName: 'planning',
  isVisibleFor: u => [INTERVIEWER, INTERVIEWER_SCALES, CLINICIAN, THERAPIST].some(rol => rol == u.rol)
};

export const PLANIFICACION_ITEMS: AppBarNavItem[] = [
  {
    module: PLANIFICACION_MODULE,
    svgName: 'availability',
    title: 'Availability',
    subtitle: 'Manage availability',
    uri: 'disponibilidad',
    isVisibleFor: u => [INTERVIEWER, INTERVIEWER_SCALES, CLINICIAN, THERAPIST].some(rol => rol == u.rol)
  }
];