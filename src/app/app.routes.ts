// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './common/login/login.component';
import { InicioComponent } from './common/inicio/inicio.component';
import { TusCredencialesComponent } from './common/tus-credenciales/tus-credenciales.component';

export const routes: Routes = [
  // CORE
  { 
    path: 'ingresar', 
    component: LoginComponent 
  },
  { 
    path: 'inicio', 
    component: InicioComponent 
  },
  { 
    path: 'credenciales', 
    component: TusCredencialesComponent 
  },
  { 
    path: '', 
    redirectTo: 'inicio', 
    pathMatch: 'full' 
  },

  // Carga perezosa con import() dinámico
  {
    path: 'administracion-general',
    loadChildren: () => import('src/app/administracion-general/routes')
      .then(m => m.ADMINISTRACION_GENERAL_ROUTES)
  },
  {
    path: 'planificacion',
    loadChildren: () => import('src/app/planificacion/routes')
      .then(m => m.PLANIFICACION_ROUTES)
  },
  {
    path: 'reportes',
    loadChildren: () => import('src/app/reportes/reportes.routes')
      .then(m => m.REPORTES_ROUTES)
  },
  {
    path: 'marketing',
    loadChildren: () => import('src/app/marketing/marketing.routes')
      .then(m => m.MARKETING_ROUTES)
  },
  {
    path: 'solicitudes',
    loadChildren: () => import('src/app/solicitudes/solicitudes.routes')
      .then(m => m.getSolicitudesRoutes())
  }
  
  
];