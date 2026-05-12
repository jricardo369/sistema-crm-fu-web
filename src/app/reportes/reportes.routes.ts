// src/app/reportes/reportes.routes.ts
import { Routes } from '@angular/router';
import { ReporteSolicitudesUsuariosComponent } from 'src/app/reportes/reporte-solicitudes-usuarios/reporte-solicitudes-usuarios.component';
import { ReporteCorreosEnviadosComponent } from 'src/app/reportes/reporte-correos-enviados/reporte-correos-enviados.component';
import { ReporteMovimientosUsuarioComponent } from 'src/app/reportes/reporte-movimientos-usuario/reporte-movimientos-usuario.component';
import { HomeComponent } from 'src/app/reportes/home/home.component';
import { ReporteComparacionAniosComponent } from 'src/app/reportes/reporte-comparacion-anios/reporte-comparacion-anios.component';
import { ReporteDashboardComponent } from 'src/app/reportes/reporte-dashboard/reporte-dashboard.component';
import { ReportesAbogadosComponent } from 'src/app/reportes/reportes-abogados/reportes-abogados.component';

export const REPORTES_ROUTES: Routes = [
  { 
    path: 'solicitudes-usuarios', 
    component: ReporteSolicitudesUsuariosComponent 
  },
  { 
    path: 'pagos', 
    component: ReporteMovimientosUsuarioComponent 
  },
  { 
    path: 'correos-enviados', 
    component: ReporteCorreosEnviadosComponent 
  },
  { 
    path: 'comparacion-anios', 
    component: ReporteComparacionAniosComponent 
  },
  { 
    path: 'reporte-dashboard', 
    component: ReporteDashboardComponent 
  },
  { 
    path: 'home', 
    component: HomeComponent 
  },
  { 
    path: '', 
    pathMatch: 'full', 
    redirectTo: '/reportes/home' 
  },
  { 
    path: 'reportes-abogados', 
    component: ReportesAbogadosComponent 
  },
  { 
    path: 'reportes-abogados/:id', 
    component: ReportesAbogadosComponent 
  }
];