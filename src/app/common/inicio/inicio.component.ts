import { Component, OnInit } from '@angular/core';
import { Router,RouterModule } from '@angular/router';
import { Usuario } from '../../../model/usuario';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SessionService } from 'src/app/services/session.service';
import { UtilService } from 'src/app/services/util.service';
import { BACKOFFICE, INTERVIEWER, INTERVIEWER_SCALES, THERAPIST, VENDOR,VOC,TEMPLATE_CREATOR,CLINICIAN,ADMINISTRATOR,MARKETING, MARKETING_REV,DIG_MAR_MAN } from 'src/app/app.config';
import { MASTER } from '../../app.config';
import { WorkspaceNavComponent } from 'src/app/common/workspace-nav/workspace-nav.component';
import { ExperimentalMenuComponent } from 'src/app/common/experimental-menu/experimental-menu.component';
import { NgClass, AsyncPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

interface CustomSearchItem {
    title: string,
    subtitle: string,
    component: any,
    uri: string,
    isVisibleFor(u: Usuario): boolean
};

@Component({
    standalone: true,imports: [FormsModule, RouterModule, WorkspaceNavComponent, ExperimentalMenuComponent, NgClass, AsyncPipe, MatIconModule, MatDialogModule],
    selector: 'app-inicio',
    templateUrl: './inicio.component.html',
    styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {


    grupos: string[] = [];
    pantallas: any = {};

    // WORKAROUND :( PARA EL AOT-COMPILATION
    baseHref = document.baseURI;

    loading = false;
    sInterval: any;
    constructor(private usuarios: UsuariosService,
        private utilService: UtilService,
        public router: Router,
        private domSanitizer: DomSanitizer,
        private sessionService: SessionService,) {
        //this.utilService.deshabilitaRetroceso();

        this.sInterval = setInterval(() => {
            if (localStorage.getItem('auth_token') == null) {
                this.utilService.limpiarContadorDeSesion();
                this.sessionService.cerrarSesion();
                this.router.navigate(['/ingresar']);
                clearInterval(this.sInterval);
            }
        }, 1000);

        let appSearch: CustomSearchItem[] = [];
        if (localStorage.getItem('auth_token') !== null) {
            this.obtenerUsuario(usuarios, appSearch);
        }
    }

    obtenerUsuario(usuarios: UsuariosService, appSearch: CustomSearchItem[]) {
        this.loading = true;
        usuarios.obtenerUsuarioPorUsuario(localStorage.getItem('usuario')).then(usuario => {

            /*usuario.rol.forEach(rol => {
                rol.descripcion = rol.descripcion.toUpperCase();
            });

            usuario.organizaciones.forEach(o => {
                o.id = o.id.replace(/\s+/g, '');
            });*/

            localStorage.setItem('objUsuario', JSON.stringify(usuario));

            let groups = {};
            appSearch.filter(e => e.isVisibleFor(usuario)).forEach(e => {
                let group: any[] = groups[e.subtitle];
                if (!group) {
                    group = [];
                    groups[e.subtitle] = group;
                }
                group.push(e);
            });
            this.pantallas = groups;

            this.grupos.length = 0;
            for (let key in groups) {
                if (key == 'Inicio') continue;
                this.grupos.push(key);
            }

            console.log('entro a inicio y vera a donde inicia');
            if ([MASTER, VENDOR, BACKOFFICE, INTERVIEWER, INTERVIEWER_SCALES, THERAPIST, CLINICIAN].some(rol => rol == usuario.rol)) {
              this.router.navigateByUrl('/solicitudes/citas');
            }
            if ([VOC,TEMPLATE_CREATOR].some(rol => rol == usuario.rol)) {
                this.router.navigateByUrl('/solicitudes');
              }
             if ([ADMINISTRATOR].some(rol => rol == usuario.rol)) {
                this.router.navigateByUrl('/administracion-general/usuarios');
              }
              if ([MARKETING].some(rol => rol == usuario.rol)) {
                this.router.navigateByUrl('/marketing/lawyers-prospects');
              }
              if ([MARKETING_REV].some(rol => rol == usuario.rol)) {
                this.router.navigateByUrl('/marketing/lawyers-prospects');
              }
              if ([DIG_MAR_MAN].some(rol => rol == usuario.rol)) {
                this.router.navigateByUrl('/marketing/lawyers-prospects');
              }
              
        }).then(() => this.loading = false);
    }

    ngOnInit(): void {

    }
}
