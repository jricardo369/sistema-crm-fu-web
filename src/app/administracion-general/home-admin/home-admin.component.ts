import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SessionService } from 'src/app/services/session.service'; 

import { BACKOFFICE, MASTER, VOC,INTERVIEWER_SCALES,VENDOR } from '../../app.config';
import { Usuario } from 'src/model/usuario';
import { FormsModule } from '@angular/forms';

import { WorkspaceNavComponent } from 'src/app/common/workspace-nav/workspace-nav.component';
import { ExperimentalMenuComponent } from 'src/app/common/experimental-menu/experimental-menu.component';
import { ReportesNavComponent } from 'src/app/reportes/reportes-nav/reportes-nav.component';

import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  standalone: true,
  selector: 'app-redirect-inicio',
  template: `<p>Redirecting...</p>`,
  imports: [FormsModule, RouterModule, WorkspaceNavComponent, ExperimentalMenuComponent, ReportesNavComponent, MatIconModule, MatProgressSpinnerModule] 
})
export class HomeAdminComponent implements OnInit {

  usuario: any;

  constructor(
    private router: Router, 
    private session: SessionService) { }

  ngOnInit(): void {

    const usuarioData = localStorage.getItem('objUsuario');

    this.usuario = JSON.parse(usuarioData);

    console.log('Usuario en HomeAdminComponent:', this.usuario);
    
    if ([MASTER, BACKOFFICE, VOC,INTERVIEWER_SCALES,VENDOR].some(rol => rol === this.usuario.rol)) {
      this.router.navigate(['/administracion-general/abogados']);
      
    } else {
      this.router.navigate(['/administracion-general/usuarios']);
    }
  }
}