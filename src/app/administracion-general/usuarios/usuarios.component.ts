import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router,RouterModule } from '@angular/router';
import { DialogoSimpleComponent } from 'src/app/common/dialogo-simple/dialogo-simple.component';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { Filter, UtilService } from 'src/app/services/util.service';
import { Usuario } from 'src/model/usuario';
import { PaginationManager } from 'src/util/pagination';
import { DialogoUsuarioComponent } from './../dialogo-usuario/dialogo-usuario.component';
import { FormsModule } from '@angular/forms';

import { WorkspaceNavComponent } from 'src/app/common/workspace-nav/workspace-nav.component';
import { ExperimentalMenuComponent } from 'src/app/common/experimental-menu/experimental-menu.component';

import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { GeneralNavComponent } from 'src/app/administracion-general/general-nav/general-nav.component';

import { PhonePipe } from 'src/app/common/pipes/phone-pipe.pipe';

@Component({
  standalone: true,
  imports: [RouterModule,FormsModule,GeneralNavComponent,WorkspaceNavComponent,ExperimentalMenuComponent,CommonModule,MatIconModule,MatProgressSpinnerModule,PhonePipe],
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

    cargando: boolean = false;

    mostrandoResultadosFiltrados = false;
    filters: Filter[] = [];
    usuarios: Usuario[] = [];
    usuariosSinFiltrar: Usuario[] = [];
    seleccion: number[] = [];

    paginacion: PaginationManager = new PaginationManager();

    constructor(
		private router: Router,
		private usuariosService: UsuariosService,
		public utilService: UtilService,
        private dialog: MatDialog
    ) {
        let user = JSON.parse(localStorage.getItem('objUsuario'));
		this.refrescar();
	}

    ngOnInit(): void {
    }

    refrescar() {
        this.cargando = true;
        this.usuariosService
            .obtenerUsuarios()
            .then(usuarios => {
                this.usuariosSinFiltrar = usuarios;
                this.usuarios = this.usuariosSinFiltrar.filter(e => true);
                this.paginacion.setArray(this.usuarios,15);
            })
            .catch(reason => this.utilService.manejarError(reason))
            .then(() => this.cargando = false)
    }

	estanTodosSeleccionados() {
        return this.seleccion.length == this.usuarios.length;
    }

    checkAll(event: Event, id: string) {
        if (this.estanTodosSeleccionados()) this.seleccion = [];
        else {
            this.seleccion = [];
            this.usuarios.forEach(u => this.seleccion.push(u.idUsuario));
        }
    }

    estaSeleccionado(id: number) {
        return this.seleccion.find(e => e == id) != null;
    }

    check(event: Event, id: number) {
        if ((event.srcElement as HTMLInputElement).checked) {
            //add
            if (!this.estaSeleccionado(id)) this.seleccion.push(id);
        } else {
            //remove
            if (this.estaSeleccionado(id)) this.seleccion.splice(this.seleccion.indexOf(id), 1);
        }
    }

    agregarFiltro() {
        this.filters.push(new Filter());
    }

    eliminarFiltro(f: Filter) {
        let start = this.filters.indexOf(f);
        let deleteCount = 1;
        this.filters.splice(start, deleteCount);
        if (this.filters.length == 0)
            this.aplicarFiltros();
    }

    limpiarFiltros() {
        this.filters = [];
        this.aplicarFiltros();
    }

    aplicarFiltros() {
        let filtered = [];
        u: for (let i = 0; i < this.usuariosSinFiltrar.length; i++) {
            let r = this.usuariosSinFiltrar[i];
            for (let j = 0; j < this.filters.length; j++) {
                let f = this.filters[j];

                let v = null;

                switch (f.campo) {
                    case 'usuario': v = r.usuario; break;
                    case 'nombre': v = r.nombre; break;
                    case 'direccion': v = r.direccion; break;
                    case 'telefono': v = r.telefono; break;
                    case 'tipo': v = r.rol; break;
                }

                switch (f.operador) {
                    case "!=": if (!(v != f.valor)) continue u; break;
                    case "==": if (!(v == f.valor)) continue u; break;
                    case ">=": if (!(v >= f.valor)) continue u; break;
                    case "<=": if (!(v <= f.valor)) continue u; break;
                    case ">": if (!(v > f.valor)) continue u; break;
                    case "<": if (!(v < f.valor)) continue u; break;
                    case "startsWith": if (!(('' + v).toLowerCase().startsWith(('' + f.valor).toLowerCase()))) continue u; break;
                    case "endsWith": if (!(('' + v).toLowerCase().endsWith(('' + f.valor).toLowerCase()))) continue u; break;
                    case "includes": if (!(('' + v).toLowerCase().includes(('' + f.valor).toLowerCase()))) continue u; break;
                }

            }
            filtered.push(r);
        };
        this.usuarios = filtered;
        this.usuarios.sort((a, b) => b.idUsuario - a.idUsuario);
        this.paginacion.setArray(this.usuarios,15);
    }

    eliminar() {
        this.dialog.open(DialogoSimpleComponent, {
            data: {
                titulo: this.seleccion.length > 1 ? 'Delete ' + this.seleccion.length + ' users' : "Delete user",
                texto: this.seleccion.length > 1 ? 'Do you really want to delete these ' + this.seleccion.length + ' users? Requests related to them will be deleted.' : 'Do you really want to delete the user? Requests related to him will be deleted.',
                botones: [
                    { texto: 'Cancel', color: '', valor: '' },
                    { texto: this.seleccion.length > 1 ? 'Delete users' : 'Delete user', color: 'primary', valor: 'eliminar' },
                ]
            },
            disableClose: true,
        }).afterClosed().toPromise().then(valor => {
            if (valor == 'eliminar') {
                this.cargando = true;
                let promises = [];
                this.seleccion.forEach(id => promises.push(this.usuariosService.eliminarUsuario(id)));
                Promise
                    .all(promises)
                    .then(results => {
                        this.cargando = false;
                        let failed = [];
                        results.forEach(r => { if (r.success == false) failed.push(r) });
                        if (failed.length > 0) {
                            this.dialog.open(DialogoSimpleComponent, {
                                data: {
                                    titulo: 'User(s) not deleted',
                                    texto: failed.length == 1 ? 'The user could not be deleted by mass deletion, delete him/her from his/her individual screen.' :
                                        failed.length + ' users could not be deleted by mass deletion, delete them individually.',
                                    botones: [{ texto: 'Ok', color: 'accent' },]
                                },
                                disableClose: true,
                            });
                        }
                        this.refrescar();
                    }).catch(e => {
                        //window.alert("ALGO NO SALIO BIEN");
                        this.utilService.manejarError(e);
                        this.cargando = false;
                    });
            }
        }).catch(reason => this.utilService.manejarError(reason));
    }

    crearUsuario() {
		this.dialog.open(DialogoUsuarioComponent, {
            data: {},
            disableClose: true,
        }).afterClosed().toPromise().then(valor => {
            if (valor == 'creado') this.refrescar();
        }).catch(reason => this.utilService.manejarError(reason));
	}

	editarUsuario(idUsuario: number) {
		this.dialog.open(DialogoUsuarioComponent, {
            data: {
				idUsuario: idUsuario
			},
            disableClose: true,
        }).afterClosed().toPromise().then(valor => {
            if (valor == 'editando') this.refrescar();
        }).catch(reason => this.utilService.manejarError(reason));
	}

}
