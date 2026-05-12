import { Component,Input, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UtilService } from 'src/app/services/util.service';

import { WorkspaceNavComponent } from 'src/app/common/workspace-nav/workspace-nav.component';
import { MarketingNavComponent } from 'src/app/marketing/marketing-nav/marketing-nav.component';
import { ExperimentalMenuComponent } from 'src/app/common/experimental-menu/experimental-menu.component';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { PaginationManager } from 'src/util/pagination';
import { MatDialog } from '@angular/material/dialog';

import { EventosSolicitudComponent } from 'src/app/solicitudes/eventos-solicitud/eventos-solicitud.component';
import { NotaProspectoAbogado } from 'src/model/nota-prospecto-abogado';
import { ProspectoAbogadoNoteService } from 'src/app/services/prospecto-abogado-note.service';
import { Usuario } from 'src/model/usuario';
import { DialogoProspectoAbogadoComponent } from '../dialogo-prospecto-abogado/dialogo-prospecto-abogado.component';
import { DateMMDDYYYYPipe } from 'src/app/common/pipes/date-pipe.pipe';

import { DIG_MAR_MAN } from 'src/app/app.config';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    WorkspaceNavComponent,
    MarketingNavComponent,
    ExperimentalMenuComponent,
    MatIconModule,
    MatProgressSpinnerModule,
    EventosSolicitudComponent,
    DateMMDDYYYYPipe
  ],
  selector: 'app-lawyers-notes',
  templateUrl: './lawyers-notes.component.html',
  styleUrls: ['./lawyers-notes.component.css']
})
export class LawyersNotesComponent {

    @Input() idProspectoAbogado: number;
    @Input() idEstatusProspecto: number;

    mostrarComponente: boolean = true;
    arrProspectoAbogadoNotes: NotaProspectoAbogado[] = [];
    paginacion: PaginationManager = new PaginationManager();

    cargando: boolean = false;
    usuario: Usuario = new Usuario();
    isDigitalMarketingManager: boolean = false;

    constructor(
        private prospectoAbogadoNoteService: ProspectoAbogadoNoteService,
        private utilService: UtilService,
        private dialog: MatDialog) {
        this.mostrarComponente = true;
        this.usuario = JSON.parse(localStorage.getItem("objUsuario"));
        console.log('idProspectoAbogado:', this.idProspectoAbogado);
        this.isDigitalMarketingManager = this.usuario.rol == DIG_MAR_MAN ? true : false;
    }

    ngOnChanges(changes: SimpleChanges): void {
    if (changes['idProspectoAbogado'] && this.idProspectoAbogado) {
      console.log('idProspectoAbogado:', this.idProspectoAbogado);
      this.refresh();
    }

    if (changes['idEstatusProspectoAbogado']) {
    console.log('cambio estatus:', this.idEstatusProspecto);
  }
  }

    ngOnInit(): void {
        this.mostrarComponente = true;
    }


    refresh() {
        this.cargando = true;
       
        this.prospectoAbogadoNoteService.obtenerProspectoAbogadoNotasPorId(this.idProspectoAbogado).subscribe({
            next: (prospectosAbogado) => {
                this.arrProspectoAbogadoNotes = prospectosAbogado;
                this.paginacion.setArray(this.arrProspectoAbogadoNotes, 10);
                this.cargando = false;
            },
            error: (reason) => {
                this.utilService.manejarError(reason);
                this.cargando = false;
            }
        });
    }

    crearProspectoAbogadoNote() {
        this.dialog.open(DialogoProspectoAbogadoComponent, {
            data: {
                idProspectoAbogado: this.idProspectoAbogado
            },
            disableClose: true,
        }).afterClosed().toPromise().then(valor => {
            if (valor == 'creado') this.refresh();
        }).catch(reason => this.utilService.manejarError(reason));
    }

}
