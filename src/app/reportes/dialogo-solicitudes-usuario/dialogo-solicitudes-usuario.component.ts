import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ReportesService } from './../../services/reportes.service';
import { UtilService } from 'src/app/services/util.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { SolicitudNumeroCaso } from 'src/model/solicitud-numerocaso';
import { PaginationManager } from 'src/util/pagination';
import { ReporteSolicitudesUsuario } from 'src/model/reporte-solicitudes-usuario';
import { Usuario } from '../../../model/usuario';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';

import { DateMMDDYYYYPipe } from 'src/app/common/pipes/date-pipe.pipe';
import { DatePipe } from '@angular/common';

@Component({
  standalone: true,
  imports: [RouterModule,FormsModule,CommonModule,MatIconModule,MatProgressSpinnerModule,MatDialogModule,DatePipe,DateMMDDYYYYPipe],
  selector: 'app-dialogo-solicitudes-usuario',
  templateUrl: './dialogo-solicitudes-usuario.component.html',
  styleUrls: ['./dialogo-solicitudes-usuario.component.css'],
  providers:[
    DatePipe
  ]
})
export class DialogoSolicitudesUsuarioComponent implements OnInit {

  cargando: boolean = false;
  usuario: Usuario = new Usuario();
  size: number;

      idUsuario: number;
      fechaI: string;
      fechaF: string;
      arrReporteSolicitudesUsuario: ReporteSolicitudesUsuario[] = [];
      paginacion: PaginationManager = new PaginationManager();
    
      constructor(private reportesService: ReportesService,
        public utilService: UtilService,
        public usuariosService: UsuariosService,
        private dialog: MatDialog,
        public dialogRef: MatDialogRef<DialogoSolicitudesUsuarioComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
          this.idUsuario = data.idUsuario;
          this.fechaI = data.fechaI;
          this.fechaF = data.fechaF;
          this.paginacion.size = 5;
    
          this.obtenerSolicitudesDeNumeroCasos();
        }
    
      ngOnInit(): void {
        this.usuariosService
      .obtenerUsuarioPorId(this.idUsuario).then(u => {
        this.usuario = u;
      }).catch(r => this.utilService.manejarError(r));
      
      }
    
      obtenerSolicitudesDeNumeroCasos() {
        this.cargando = true;
        this.reportesService.obtenerUsersRequestsObj(this.fechaI, this.fechaF,this.idUsuario)
          .then((solicitudesUsuario) => {
            this.arrReporteSolicitudesUsuario = solicitudesUsuario;
            this.size = this.arrReporteSolicitudesUsuario.length;
            if(!(this.arrReporteSolicitudesUsuario.length > 0)) {
              
              this.cerrar("vacio");
            }
            this.paginacion.setArray(this.arrReporteSolicitudesUsuario,10);
          })
          .catch((reason) => this.utilService.manejarError(reason))
          .then(() => (this.cargando = false));
      }
    
      cerrar(accion: string = "") { this.dialogRef.close(accion); }

}
