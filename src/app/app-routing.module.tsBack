import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { LoginComponent } from './common/login/login.component';
import { InicioComponent } from './common/inicio/inicio.component';
import { TusCredencialesComponent } from './common/tus-credenciales/tus-credenciales.component';


const routes: Routes = [

    // CORE
    { path: 'ingresar', component: LoginComponent, },
    { path: 'inicio', component: InicioComponent, },
    { path: 'credenciales', component: TusCredencialesComponent, },
    { path: '', redirectTo: 'inicio', pathMatch: 'full' },

    { // ADMINISTRADOR (GENERAL)
        path: 'administracion-general',
        loadChildren: () => import('./administracion-general/administracion-general.module').then(m => m.AdministracionGeneralModule)
    },
    { // SOLICITUDES
        path: 'solicitudes',
        loadChildren: () => import('./solicitudes/solicitudes.module').then(m => m.SolicitudesModule)
    },
    { // PLANIFICACION
        path: 'planificacion',
        loadChildren: () => import('./planificacion/planificacion.module').then(m => m.PlanificacionModule)
    },
    { // REPORTES
        path: 'reportes',
        loadChildren: () => import('./reportes/reportes.module').then(m => m.ReportesModule)
    },

];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        // preloadingStrategy: PreloadAllModules
    })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
