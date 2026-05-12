import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { NAV_MENU_IZQUIERDA_TEMPLATE, NAV_MENU_IZQUIERDA_STYLES, UtilServiceTest } from 'src/app/app-nav-item';
import { MARKETING_ITEMS } from 'src/app/marketing/marketing-nav-items';
import { UtilService } from 'src/app/services/util.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

let ITEMS = MARKETING_ITEMS;

@Component({
  standalone: true,
  selector: 'app-marketing-nav',
  template: NAV_MENU_IZQUIERDA_TEMPLATE,
  styles: [NAV_MENU_IZQUIERDA_STYLES],
  imports: [
    RouterModule,
    FormsModule,
    MatIconModule,
    MatProgressSpinnerModule
]
})
export class MarketingNavComponent extends UtilServiceTest {
  constructor(router: Router, utilService: UtilService, usuariosService: UsuariosService) {
    super(router, utilService, usuariosService, ITEMS);
  }
}
