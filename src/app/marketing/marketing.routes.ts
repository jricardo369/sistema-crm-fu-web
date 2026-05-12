// src/app/marketing/marketing.routes.ts
import { Routes } from '@angular/router';
import { LawyersProspectsComponent } from 'src/app/marketing/lawyers-prospects/lawyers-prospects.component';
import { LawyerProspectComponent } from 'src/app/marketing/lawyer-prospect/lawyer-prospect.component';
import { LawyersNotesComponent } from 'src/app/marketing/lawyers-notes/lawyers-notes.component';

export const MARKETING_ROUTES: Routes = [
  {
    path: 'lawyers-prospects',
    component: LawyersProspectsComponent
  },
  {
    path: 'lawyer-prospect/:id',
    component: LawyerProspectComponent
  },
  {
    path: 'lawyers-notes/:id',
    component: LawyersNotesComponent
  },
  { 
      path: 'lawyers-prospects/nueva-solicitud', 
      component: LawyerProspectComponent 
    },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'lawyers-prospects'
  }
];
