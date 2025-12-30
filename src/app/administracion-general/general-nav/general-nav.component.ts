import { Component } from '@angular/core';
import { Router,RouterModule } from '@angular/router';
import { NAV_MENU_IZQUIERDA_TEMPLATE, UtilServiceTest, NAV_MENU_IZQUIERDA_STYLES } from '../../app-nav-item';
import { ADMIN_GENERAL_ITEMS } from 'src/app/administracion-general/admin-gen-nav-items';
import { UtilService } from 'src/app/services/util.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { FormsModule } from '@angular/forms';
let ITEMS = ADMIN_GENERAL_ITEMS;
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';


@Component({
    standalone: true,imports: [RouterModule,FormsModule,MatIconModule,MatProgressSpinnerModule,CommonModule],
    selector: 'app-general-nav',
    template: NAV_MENU_IZQUIERDA_TEMPLATE,
    styles: [NAV_MENU_IZQUIERDA_STYLES]
})
export class GeneralNavComponent extends UtilServiceTest {
    constructor(router: Router, utilService: UtilService, usuariosService: UsuariosService) {
        super(router, utilService, usuariosService, ITEMS);
    }
}