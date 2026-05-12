import { Component, OnInit } from '@angular/core';
import { NAV_MENU_IZQUIERDA_STYLES, NAV_MENU_IZQUIERDA_TEMPLATE, UtilServiceTest } from 'src/app/app-nav-item';
import { Router,RouterModule } from '@angular/router';

import { REPORTES_ITEMS } from 'src/app/reportes/reportes-nav-items'; 
import { UsuariosService } from 'src/app/services/usuarios.service';
import { UtilService } from 'src/app/services/util.service';

import { FormsModule } from '@angular/forms';
import { V } from '@angular/cdk/scrolling-module.d-C_w4tIrZ';

import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

let ITEMS = REPORTES_ITEMS;

@Component({
  standalone: true,
  selector: 'app-reportes-nav',
  template: NAV_MENU_IZQUIERDA_TEMPLATE,
  styles: [NAV_MENU_IZQUIERDA_STYLES],
  imports: [
    RouterModule,
    FormsModule,
    MatIconModule,
    MatProgressSpinnerModule
]
})
export class ReportesNavComponent extends UtilServiceTest {
  constructor(router: Router, utilService: UtilService, usuariosService: UsuariosService) {
    super(router, utilService, usuariosService, ITEMS);
  }
}