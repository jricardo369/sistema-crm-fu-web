import { Component, OnInit } from '@angular/core';
import { NAV_MENU_IZQUIERDA_STYLES, NAV_MENU_IZQUIERDA_TEMPLATE, UtilServiceTest } from 'src/app/app-nav-item';
import { PLANIFICACION_ITEMS } from '../planificacion-nav-items'; 
import { UsuariosService } from 'src/app/services/usuarios.service';
import { UtilService } from 'src/app/services/util.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
let ITEMS = PLANIFICACION_ITEMS;

import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
	standalone: true,
	selector: 'app-planificacion-nav',
	template: NAV_MENU_IZQUIERDA_TEMPLATE,
	styles: [NAV_MENU_IZQUIERDA_STYLES],
	imports: [
    CommonModule,
    RouterModule,
	FormsModule,MatIconModule,MatProgressSpinnerModule
  ]
})
export class PlanificacionNavComponent extends UtilServiceTest {
	constructor(router: Router, utilService: UtilService, usuariosService: UsuariosService) {
		super(router, utilService, usuariosService, ITEMS);
	}
}
