import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { UtilService } from 'src/app/services/util.service';
import { Usuario } from 'src/model/usuario';
import { PaginationManager } from 'src/util/pagination';
import { FormsModule } from '@angular/forms';

import { WorkspaceNavComponent } from 'src/app/common/workspace-nav/workspace-nav.component';
import { ExperimentalMenuComponent } from 'src/app/common/experimental-menu/experimental-menu.component';

import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';

import { SolicitudesNavComponent } from 'src/app/solicitudes/solicitudes-nav/solicitudes-nav.component';

import { PhonePipe } from 'src/app/common/pipes/phone-pipe.pipe';

import { THERAPIST, VOC } from 'src/app/app.config';
import { DialogoUsuarioComponent } from 'src/app/administracion-general/dialogo-usuario/dialogo-usuario.component';
import { ReportesService } from 'src/app/services/reportes.service';

@Component({
  standalone: true,
  imports: [RouterModule, FormsModule, SolicitudesNavComponent, WorkspaceNavComponent, ExperimentalMenuComponent, CommonModule, MatIconModule, MatProgressSpinnerModule, MatDialogModule, PhonePipe],
  selector: 'app-psychotherapists',
  templateUrl: './psychotherapists.component.html',
  styleUrls: ['./psychotherapists.component.css']
})
export class PsychotherapistsComponent implements OnInit {

    cargando: boolean = false;
    isVOC: boolean = false;

    psicoterapeutas: Usuario[] = [];
    psicoterapeutasSinFiltrar: Usuario[] = [];
    usuariosTodos: Usuario[] = [];

    searchTerm: string = '';

    arrAnios: number[] = [];
    arrMeses: number[] = [];

    paginacion: PaginationManager = new PaginationManager();

    constructor(
		private router: Router,
		private usuariosService: UsuariosService,
		public utilService: UtilService,
        private dialog: MatDialog,
        private reportesService: ReportesService
    ) {
        const usuario = JSON.parse(localStorage.getItem('objUsuario'));
        this.isVOC = usuario.rol == VOC;

        const anioActual = new Date().getFullYear();
        for (let i = anioActual; i >= 2020; i--) {
            this.arrAnios.push(i);
        }
        for (let i = 1; i <= 12; i++) {
            this.arrMeses.push(i);
        }

        this.refrescar();
	}

    ngOnInit(): void {
    }

    refrescar() {
        this.cargando = true;
        Promise
            .all([
                this.usuariosService.obtenerUsuariosPorRol(parseInt(THERAPIST)),
                this.usuariosService.obtenerUsuarios()
            ])
            .then(([usuarios, usuariosTodos]) => {
                this.usuariosTodos = usuariosTodos;
                this.psicoterapeutasSinFiltrar = usuarios;
                this.psicoterapeutas = this.psicoterapeutasSinFiltrar.slice();
                this.paginacion.setArray(this.psicoterapeutas, 15);
            })
            .catch(reason => this.utilService.manejarError(reason))
            .then(() => this.cargando = false)
    }

    nombreSupervisor(supervisor: string): string {
        if (!supervisor) return '';
        const sup = this.usuariosTodos.find(u => u.idUsuario === parseInt(supervisor));
        return sup ? sup.nombre : supervisor;
    }

    buscarPsicoterapeutas() {
        const term = (this.searchTerm || '').trim().toLowerCase();

        if (!term) {
            this.psicoterapeutas = this.psicoterapeutasSinFiltrar.slice();
            this.paginacion.setArray(this.psicoterapeutas, 15);
            return;
        }

        this.psicoterapeutas = this.psicoterapeutasSinFiltrar.filter(u => {
            const usuario = (u.usuario || '').toLowerCase();
            const nombre = (u.nombre || '').toLowerCase();
            const telefono = (u.telefono != null ? '' + u.telefono : '').toLowerCase();
            return usuario.includes(term) || nombre.includes(term) || telefono.includes(term);
        });

        this.paginacion.setArray(this.psicoterapeutas, 15);
    }

    verUsuario(terapeuta: Usuario) {
        this.dialog.open(DialogoUsuarioComponent, {
            data: {
                idUsuario: terapeuta.idUsuario
            },
            disableClose: true,
        }).afterClosed().toPromise().then(valor => {
            if (valor == 'editando') this.refrescar();
        }).catch(reason => this.utilService.manejarError(reason));
    }

    descargarReporteMensual() {
        let campos = [];
        campos.push({
            label: "Year",
            type: "select",
            value: new Date().getFullYear(),
            options: this.arrAnios.map(a => ({ display: a, value: a }))
        });
        campos.push({
            label: "Month",
            type: "select",
            value: new Date().getMonth() + 1,
            options: this.arrMeses.map(m => ({ display: m, value: m }))
        });

        this.utilService.mostrarDialogoConFormulario(
            "Download monthly report of therapist hours",
            "Select the year and month for the report",
            "Download",
            "Cancel",
            campos
        ).then(valor => {
            if (valor == 'ok') {
                const anio = campos[0].value;
                const mes = campos[1].value;
                this.cargando = true;
                this.reportesService.obtenerHorasMensualVocPdf(anio, mes)
                    .then(response => {
                        this.utilService.saveByteArray("horas-mensual-voc-" + anio + "-" + mes, response, 'pdf');
                    })
                    .catch(reason => this.utilService.manejarError(reason))
                    .finally(() => this.cargando = false);
            }
        }).catch(reason => this.utilService.manejarError(reason));
    }

}
