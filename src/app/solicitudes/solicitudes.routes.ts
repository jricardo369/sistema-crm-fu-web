// src/app/solicitudes/solicitudes.routes.ts
import { Routes } from '@angular/router';
import { SolicitudesComponent } from './solicitudes/solicitudes.component';
import { SolicitudComponent } from './solicitud/solicitud.component';
import { EnvioCorreosAbogadosComponent } from './envio-correos-abogados/envio-correos-abogados.component';
import { SolicitudesVocComponent } from './solicitudes-voc/solicitudes-voc.component';
import { SolicitudVocComponent } from './solicitud-voc/solicitud-voc.component';
import { HomeComponent } from './home/home.component';
import { CitasComponent } from './citas/citas.component';
import { CargosVocComponent } from './cargos-voc/cargos-voc.component';
import { CalendarComponent } from './calendar/calendar.component';

 const SOLICITUDES_ROUTES: Routes = [
  { 
    path: 'solicitudes-voc', 
    component: SolicitudesVocComponent 
  },
  { 
    path: 'solicitudes-voc/:id', 
    component: SolicitudVocComponent 
  },
  { 
    path: 'solicitudes-voc/nueva-solicitud', 
    component: SolicitudVocComponent 
  },
  { 
    path: 'solicitudes', 
    component: SolicitudesComponent 
  },
  { 
    path: 'solicitudes/:id', 
    component: SolicitudComponent 
  },
  { 
    path: 'solicitudes/nueva-solicitud', 
    component: SolicitudComponent 
  },
  { 
    path: 'envio-correos-abogados', 
    component: EnvioCorreosAbogadosComponent 
  },
  { 
    path: 'citas', 
    component: CitasComponent 
  },
  { 
    path: 'calendar', 
    component: CalendarComponent 
  },
  { 
    path: 'cargos-voc', 
    component: CargosVocComponent 
  },
  { 
    path: 'home', 
    component: HomeComponent 
  },
  { 
    path: '', 
    pathMatch: 'full', 
    redirectTo: 'home' 
  }
];

// Exporta como función de fábrica
export function getSolicitudesRoutes() {
  return SOLICITUDES_ROUTES;
}

export { SOLICITUDES_ROUTES };