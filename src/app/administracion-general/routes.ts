// src/app/administracion-general/routes.ts
import { Routes } from '@angular/router';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { ConfiguracionesComponent } from './configuraciones/configuraciones.component';
import { ConfigIntegrationsComponent } from './config-integrations/config-integrations';
import { TareasProgramadasComponent } from './tareas-programadas/tareas-programadas.component';
import { AbogadosComponent } from './abogados/abogados.component';
import { HomeAdminComponent } from './home-admin/home-admin.component';

export const ADMINISTRACION_GENERAL_ROUTES: Routes = [
  { path: 'usuarios', component: UsuariosComponent },
  { path: 'configuraciones', component: ConfiguracionesComponent },
  { path: 'config-integrations', component: ConfigIntegrationsComponent },
  { path: 'tareas-programadas', component: TareasProgramadasComponent },
  { path: 'abogados', component: AbogadosComponent },
  { path: 'home-admin', component: HomeAdminComponent },
  { 
    path: '', 
    pathMatch: 'full', 
    redirectTo: '/administracion-general/home-admin' 
  }
];
