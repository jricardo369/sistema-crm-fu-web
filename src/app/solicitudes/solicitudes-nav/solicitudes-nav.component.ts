import { Component } from '@angular/core';
import { NAV_MENU_IZQUIERDA_STYLES, NAV_MENU_IZQUIERDA_TEMPLATE, UtilServiceTest } from 'src/app/app-nav-item';
import { Router,RouterModule } from '@angular/router';

import { SOLICITUDES_ITEMS } from '../solicitudes-nav-items'; 
import { UsuariosService } from 'src/app/services/usuarios.service';
import { UtilService } from 'src/app/services/util.service';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
let ITEMS = SOLICITUDES_ITEMS;


@Component({
  standalone: true,
  selector: 'app-solicitudes-nav',
  template: NAV_MENU_IZQUIERDA_TEMPLATE,
  styles: [NAV_MENU_IZQUIERDA_STYLES],
  imports: [
    RouterModule,
    MatIconModule,
    FormsModule
]
})
export class SolicitudesNavComponent extends UtilServiceTest {
	constructor(router: Router, utilService: UtilService, usuariosService: UsuariosService) {
		super(router, utilService, usuariosService, ITEMS);
	}
}
