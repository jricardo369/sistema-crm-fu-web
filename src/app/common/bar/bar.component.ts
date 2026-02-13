import { Component, OnInit, ViewChildren, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { Router,RouterModule } from '@angular/router';
import { Usuario } from '../../../model/usuario';
import { AppBarNavItem } from '../../app-nav-item';
import { SessionService } from '../../services/session.service';
import { ADMIN_GENERAL_ITEMS } from 'src/app/administracion-general/admin-gen-nav-items';

import { CustomI18nService } from 'src/app/custom-i18n.service';
import { UtilService } from 'src/app/services/util.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

import { DomSanitizer } from '@angular/platform-browser';
import { SOLICITUDES_ITEMS } from 'src/app/solicitudes/solicitudes-nav-items';
import { REPORTES_ITEMS } from 'src/app/reportes/reportes-nav-items';
import { PLANIFICACION_ITEMS } from 'src/app/planificacion/planificacion-nav-items';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { VERSION_WEB } from 'src/app/app.config';

@Component({
    standalone: true,imports: [RouterModule,CommonModule,MatIconModule,FormsModule],
    
    selector: 'app-bar',
    templateUrl: './bar.component.html',
    styleUrls: ['./bar.component.scss']
})
export class BarComponent {
    appNavMenuHidden = true;

    @ViewChildren('userDiv') userDiv;
    @ViewChild('appNavMenuFilterInput', { static: true }) appNavMenuFilterInput;

    // appNavMenuClass: string = 'app-nav-menu hidden';
    appNavMenuFilter: string = '';

    searchBarPlaceholder: string = "";
    searchBarClass: string = "appNavSearchBar blured";
    searchBarQuery: string = '';

    // WORKAROUND :( PARA EL AOT-COMPILATION
    baseHref = document.baseURI;
    versionWeb = VERSION_WEB;

    /**
     * ARREGLO EN QUE SE GUARDAN LAS PANTALLAS FILTRADAS CON LA BARRA DE BUSQUEDA
     */
    searchScreens = [];

    /**
     * ARREGLO EN QUE SE GUARDAN LOS MODULOS FILTRADOS CON LA BARRA DE BUSQUEDA
     */
    searchSections = [];

    /**
     * MODULOS FILTRADOS PARA QUE SE MUESTREN EN EL MENU DE MODULOS
     */
    filteredModuloItems: AppBarNavItem[] = [];

    /**
     * ARREGLO DE MODULOS PARA BUSQUEDAS (FUENTE PARA LAS BUSQUEDAS)
     */
    moduloItems: AppBarNavItem[] = [];

    /**
     * ARREGLO DE PANTALLAS PARA BUSQUEDAS (FUENTE PARA LAS BUSQUEDAS)
     */
    pantallaItems: AppBarNavItem[] = [];

    usuario: Usuario = new Usuario();

    imageUsuario: string = '';
    tieneImagen: boolean = false;
    color: string = '';
    iniciales: string = '';


    foto: any;

    constructor(
        public utilService: UtilService,
        private sessionService: SessionService,
        private usuariosService: UsuariosService,
        private i18n: CustomI18nService,
        private router: Router,
        private domSanitizer: DomSanitizer
    ) {
        this.filteredModuloItems = [];

        this.usuariosService
            .obtenerUsuarioPorUsuario(localStorage.getItem('usuario'))
            .then(u => {
                this.usuariosService
                    .obtenerUsuarioPorIdObj(u.idUsuario)
                    .then(u => {
                        this.usuario = u;
                        /*this.usuario.rol.forEach(rol => {
                            rol.descripcion = rol.descripcion.toUpperCase();
                        });*/

                        if(this.usuario.image != null){
                            this.imageUsuario = this.usuario.image;
                            //this.imageUsuario = 'http://ec2-54-215-12-132.us-west-1.compute.amazonaws.com:8080/fileSystem/2025/3628/0833baa3-8f9a-4898-9d25-154d939eb69a.png';
                            this.tieneImagen = true;
                        }else{
                            this.tieneImagen = false;
                            this.iniciales = this.usuario.iniciales;
                            this.color = this.usuario.color;
                            this.imageUsuario = this.baseHref+'assets/img/portrait-demo.png';
                            
                        }


                        let items = [
                            ADMIN_GENERAL_ITEMS,
                            SOLICITUDES_ITEMS,
                            PLANIFICACION_ITEMS,
                            REPORTES_ITEMS
                        ];

                        // this.getImagen(this.usuario.foto);

                        this.pantallaItems = items.reduce((a, b) => a.concat(b), []);
                        this.moduloItems = this.pantallaItems
                            .map(e => e.module)
                            .reduce((a, e) => a.includes(e) ? a : a.concat([e]), [] as AppBarNavItem[])
                            .filter(e => e.isVisibleFor(this.usuario));

                        /*
                        this.pantallaItems
                            .map(e => e.module)
                            .filter(e => e && e.isVisibleFor(this.usuario))
                            .forEach(e => {
                                if (this.moduloItems.includes(e)) return;
                                this.moduloItems.push(e);
                            })
                            */

                        // i18n.translate(null, this.moduloItems);
                        // i18n.translate(null, this.pantallaItems);

                        this.filteredModuloItems = this.moduloItems.filter(e => true);
                    })
                    .catch(reason => {
                        this.utilService.manejarError(reason);
                        this.logout()
                    });
            })
            .catch(reason => {
                this.utilService.manejarError(reason);
                this.logout()
            });
    }

    private searchScore(sentence: string): number {
        let score = 0;
        let words = sentence.split(' ');
        for (let i = 0; i < words.length; i++)
            if (words[i].toLowerCase().startsWith(this.searchBarQuery.toLowerCase()))
                score += 10;
        return score;
    }

    onSearchBarChange() {
        if (this.searchBarQuery.length == 0) {
            this.searchSections = [];
            this.searchScreens = [];
            return;
        }

        this.searchSections = this.moduloItems
            .filter(e => e.isVisibleFor(this.usuario))
            .filter(e => e.title.toLowerCase().includes(this.searchBarQuery.toLowerCase()));

        this.searchScreens = this.pantallaItems
            .filter(e => e.isVisibleFor(this.usuario))
            .filter(e => e.title.toLowerCase().includes(this.searchBarQuery.toLowerCase()))
            .sort((a, b) =>
                this.searchScore(b.title) * (b.subtitle == '' ? 0.5 : 1) -
                this.searchScore(a.title) * (a.subtitle == '' ? 0.5 : 1)
            );
    }

    onSearchSectionClick(e: AppBarNavItem) {
        this.router.navigate([e.uri]);
    }

    onSearchScreenClick(e) {
        let uri = e.uri;
        if (e.module != null) {
            uri = e.module.uri + '/' + uri;
        }
        this.router.navigate([uri]);
    }

    onSearchBarFocus() {
        this.searchBarClass = 'appNavSearchBar';
        this.searchBarPlaceholder = this.i18n.get('Encuentra pantallas u operaciones');
    }

    onSearchBarBlur() {
        this.searchBarClass = 'appNavSearchBar blured';
        this.searchBarPlaceholder = '';
        this.searchBarQuery = '';
        this.searchSections = [];
        this.searchScreens = [];
    }

    focusUserDiv() {
        this.userDiv.first.nativeElement.focus();
    }

    logout() {
        this.utilService.limpiarContadorDeSesion();
        this.sessionService.cerrarSesion();
        this.router.navigate(['/ingresar']);
    }

    openNavMenu() {
        if (
            window.matchMedia('(max-width:480px)').matches && // es mobile
            document.querySelectorAll('app-workspace-nav').length && // app-workspace-nav existe
            !this.utilService.workspaceNavMenuOpened // no está abierto ya
        ) {
            this.utilService.workspaceNavMenuOpened = true;
            return;
        }

        // this.appNavMenuClass = 'app-nav-menu';
        this.utilService.appNavMenuHidden = false;
        this.appNavMenuFilterInput.nativeElement.focus();
    }

    closeAppNavMenu() {
        // this.appNavMenuClass = 'app-nav-menu hidden';
        this.utilService.appNavMenuHidden = true;
        this.appNavMenuFilterInput.nativeElement.blur();
    }

    onNavItemClick(e: AppBarNavItem) {
        this.router.navigate([e.uri]);
        this.closeAppNavMenu();
    }

    onNavHomeItemClick() {
        this.router.navigate(['']);
        this.closeAppNavMenu();
    }

    filterChange() {
        let ee = this.moduloItems;
        let ff = this.appNavMenuFilter;
        if (this.appNavMenuFilter == '') {
            this.filteredModuloItems = this.moduloItems;
        } else {
            this.filteredModuloItems = [];
            this.filteredModuloItems = this.moduloItems.filter(e => e.title.toLowerCase().indexOf(this.appNavMenuFilter.toLowerCase()) > -1);
        }
    }

    getImagen(hexString: string) {
        if (hexString !== null) {
            var Buffer = require('buffer').Buffer;
            var base64String = Buffer.from(hexString, 'hex').toString('base64');
            this.foto = this.domSanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,' + base64String);
        }
        else {
            this.foto = this.baseHref + "assets/img/portrait-demo.png";
        }
    }
}
