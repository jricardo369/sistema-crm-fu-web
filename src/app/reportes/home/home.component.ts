import { Component } from '@angular/core';
import { Router,RouterModule } from '@angular/router';
import { BACKOFFICE, GHOSTWRITING, MASTER, VENDOR, VOC} from 'src/app/app.config';
import { FormsModule } from '@angular/forms';

import { WorkspaceNavComponent } from 'src/app/common/workspace-nav/workspace-nav.component';
import { ExperimentalMenuComponent } from 'src/app/common/experimental-menu/experimental-menu.component';
import { ReportesNavComponent } from 'src/app/reportes/reportes-nav/reportes-nav.component';


import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

const ROLES = {
  MASTER: 'master',
  VENDOR: 'vendor',
  BACKOFFICE: 'backoffice',
  GHOSTWRITING: 'ghostwriting',
  VOC: 'voc'
};

@Component({
  standalone: true,
  imports: [RouterModule, FormsModule, WorkspaceNavComponent, ExperimentalMenuComponent, ReportesNavComponent, MatIconModule, MatProgressSpinnerModule],
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  usuario: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.redirectBasedOnRole();
  }

  private redirectBasedOnRole(): void {
  try {
    const usuarioData = localStorage.getItem('objUsuario');
    
    if (!usuarioData) {
      this.router.navigate(['/login']);
      return;
    }

    this.usuario = JSON.parse(usuarioData);

    if (this.usuario.rol == MASTER) {
      this.router.navigate(['/reportes/solicitudes-usuarios']);
    }
    else if (this.usuario.rol == VENDOR || this.usuario.rol == BACKOFFICE || this.usuario.rol == GHOSTWRITING) {
      this.router.navigate(['/reportes/pagos']);
    }
    else if (this.usuario.rol == VOC) {
      this.router.navigate(['/reportes/correos-enviados']);
    }
  } catch (error) {
    console.error('Error en redirección por rol:', error);
    this.router.navigate(['/error']);
  }
}

  /*
  usuario: Usuario = new Usuario;

  constructor(private router: Router) {
    this.usuario = JSON.parse(localStorage.getItem('objUsuario'));
    if (this.usuario.rol == MASTER) {
      this.router.navigate(['/reportes/solicitudes-usuarios']);
    }
    else if (this.usuario.rol == VENDOR || this.usuario.rol == BACKOFFICE || this.usuario.rol == GHOSTWRITING) {
      this.router.navigate(['/reportes/pagos']);
    }
    else if (this.usuario.rol == VOC) {
      this.router.navigate(['/reportes/correos-enviados']);
    }
  }*/

}
