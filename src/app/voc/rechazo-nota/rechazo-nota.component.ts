import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';


import { UtilService } from 'src/app/services/util.service';
import { MotivoCancelService } from 'src/app/services/motivo-cancel.service';
import { Usuario } from 'src/model/usuario';
import { MotivoCancel } from 'src/model/motivo-cancel';
import { NotaCitaService } from 'src/app/services/nota-cita.service';
import { NotaCita } from 'src/model/nota-cita';

@Component({
    standalone: true,
    imports: [RouterModule, FormsModule, MatIconModule, MatProgressSpinnerModule, MatDialogModule],
    selector: 'app-rechazo-nota',
    templateUrl: './rechazo-nota.component.html',
    styleUrls: ['./rechazo-nota.component.css']
})
export class RechazoNotaComponent implements OnInit {

    titulo: string = '';
    subtitulo: string = '';
    textolabel: string = '';
    tipoMotivo: string = 'REJ';

    cargando: boolean = false;
    cancelReason: string = '';
    usuario: Usuario = new Usuario();
    notaCita: NotaCita = new NotaCita();

    filterMotivoCancel: string;
    arrFilterMotivoCancel: MotivoCancel[] = [];

    constructor(
        private motivoCancelService: MotivoCancelService,
        public utilService: UtilService,
        private notaCitaService: NotaCitaService,
        public dialogRef: MatDialogRef<RechazoNotaComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.titulo = data?.titulo || 'Reject note';
        this.subtitulo = data?.subtitulo || 'Select a reason to reject this note';
        this.textolabel = data?.textolabel || 'Reason';
        this.tipoMotivo = data?.tipoMotivo || 'REJ';
        this.notaCita = data?.nota || new NotaCita();

        this.usuario = JSON.parse(localStorage.getItem('objUsuario'));
    }

    ngOnInit(): void {
        this.obtenerMotivosCancel();
    }

    envioRechazoNota(): void {
        if (this.filterMotivoCancel === undefined) {
            this.utilService.mostrarDialogoSimple('Warning', 'Reason for cancellation cannot be empty');
            return;
        }

        let motivoCancelF = '';
        if (this.filterMotivoCancel === 'other') {
            if (this.cancelReason === '' || this.cancelReason == null) {
                this.utilService.mostrarDialogoSimple('Warning', 'Cancellation reason cannot be empty');
                return;
            }
            motivoCancelF = this.cancelReason;
        } else {
            motivoCancelF = this.filterMotivoCancel;
        }

        this.notaCitaService
            .rechazarNota(this.notaCita.idNota, this.usuario.idUsuario, motivoCancelF)
            .then(() => {
                this.cerrar('guardar');
            })
            .catch(reason => this.utilService.manejarError(reason))
            .then(() => this.cargando = false);

        this.dialogRef.close({ motivoCancel: motivoCancelF });
    }

    cerrar(accion: string = ''): void {
        this.dialogRef.close(accion);
    }

    obtenerMotivosCancel(): void {
        this.cargando = true;
        this.motivoCancelService
            .obtenerMotivosCancel(this.tipoMotivo, this.usuario.idUsuario)
            .then(motivos => {
                this.arrFilterMotivoCancel = motivos;
            })
            .catch(reason => this.utilService.manejarError(reason))
            .then(() => this.cargando = false);
    }
}
