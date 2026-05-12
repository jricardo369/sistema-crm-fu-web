import { Usuario } from "../model/usuario";
import { Router } from "@angular/router";
import { UtilService } from './services/util.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';

export const NAV_MENU_IZQUIERDA_TEMPLATE =
    `
    <button *ngFor='let workspace of workspaces; let i = index' class='{{i == 0 ? "iigwo home" : (isWorkspaceCurrentPath(workspace) ? "iigwo accent" : "iigwo")}}'
        (click)='navigateToWorkspacePath($event, workspace)'>
        <mat-icon svgIcon="{{workspace.svgName}}"></mat-icon>
        <label>{{workspace.title}}</label>
    </button>

    <button class="iigwo bottom" (click)="utilService.workspaceNavMenuShortened = !utilService.workspaceNavMenuShortened">
        <mat-icon svgIcon="arrow-back" *ngIf="!utilService.workspaceNavMenuShortened"></mat-icon>
        <mat-icon svgIcon="arrow-forward" *ngIf="utilService.workspaceNavMenuShortened"></mat-icon>
        <label *ngIf="!utilService.workspaceNavMenuShortened">Ocultar</label>
        <label *ngIf="utilService.workspaceNavMenuShortened">Mostrar</label>
    </button>

    `;

export const NAV_MENU_IZQUIERDA_STYLES = `

    :host {
        display: flex;
        flex-flow: column;
        height: 100%;
    }

    button.iigwo.bottom {
        margin-top: auto;
        margin-bottom: 8px;
        border-top: 1px rgba(0,0,0,0.1) solid;
    }
`

export class UtilServiceTest {

    workspaces = [];
    ITEMS: AppBarNavItem[];
    manual_name: string;


    constructor(
        private router: Router,
        public utilService: UtilService,
        private usuariosService: UsuariosService, ITEMS: AppBarNavItem[]
    ) {
        this.ITEMS = ITEMS;

        if (usuariosService.usuarioPromise) {
            usuariosService.usuarioPromise
                .then(u => {
                    this.updateItems(u);
                }).catch(e => {
                    this.utilService.manejarError(e);
                })
        }
    }

    updateItems(u: Usuario) {

        this.manual_name = localStorage.getItem('manual_name');

        this.workspaces = [this.ITEMS[0].module];
        this.ITEMS
            .filter(e => e.isVisibleFor(u))
            .forEach(e => this.workspaces.push(e));
    }

    isWorkspaceCurrentPath(workspace: AppBarNavItem) { return window.location.pathname.endsWith(AppBarNavItem.path(workspace)); }

    navigateToWorkspacePath(event, workspace: AppBarNavItem): void {
        this.utilService.workspaceNavMenuOpened = false;
        setTimeout(() => {
            this.router.navigate([AppBarNavItem.path(workspace)]);
        }, 0);
    }
}

@Component({
  selector: 'app-nav-item',
  standalone: true,
  imports: [FormsModule, RouterModule], 
  template: `
    <div></div>
  `,
  styles: [`
    .nav-item {
      /* Tus estilos aquí */
    }
  `]
})
export class AppBarNavItem {
    
   
    module: AppBarNavItem;
    title: string;
    subtitle: string;

    uri: string;
    svgName: string;

    static path(e: AppBarNavItem): string {
        return e.module ? e.module.uri + '/' + e.uri : e.uri;
    }

    isVisibleFor(u: Usuario): boolean { return true; }
}
