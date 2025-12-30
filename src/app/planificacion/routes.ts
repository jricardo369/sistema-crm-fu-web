// src/app/planificacion/routes.ts
import { Routes } from '@angular/router';
import { DisponibilidadComponent } from './disponibilidad/disponibilidad.component';

export const PLANIFICACION_ROUTES: Routes = [
  { 
    path: 'disponibilidad', 
    component: DisponibilidadComponent
  },
  { 
    path: '', 
    pathMatch: 'full', 
    redirectTo: 'disponibilidad' 
  }
];