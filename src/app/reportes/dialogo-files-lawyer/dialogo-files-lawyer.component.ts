import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ReportesService } from './../../services/reportes.service';
import { UtilService } from 'src/app/services/util.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { SolicitudNumeroCaso } from 'src/model/solicitud-numerocaso';
import { PaginationManager } from 'src/util/pagination';
import { ReporteFilesFirma } from 'src/model/reporte-files-firma';
import { Usuario } from '../../../model/usuario';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  standalone: true,imports: [RouterModule,FormsModule,CommonModule,MatIconModule,MatProgressSpinnerModule,MatDialogModule],
  selector: 'app-dialogo-files-lawyer',
  templateUrl: './dialogo-files-lawyer.component.html',
  styleUrls: ['./dialogo-files-lawyer.component.css']
})
export class DialogoFilesLawyerComponent implements OnInit {

  cargando: boolean = false;
    usuario: Usuario = new Usuario();
    size: number;
  
        nombre: string;
        firma: string;
        idAbogado: number;
        fechaI: string;
        fechaF: string;
        arrReporteFilesFirma: ReporteFilesFirma[] = [];
        paginacion: PaginationManager = new PaginationManager();
      
        constructor(private reportesService: ReportesService,
          public utilService: UtilService,
          public usuariosService: UsuariosService,
          private dialog: MatDialog,
          public dialogRef: MatDialogRef<DialogoFilesLawyerComponent>,
          @Inject(MAT_DIALOG_DATA) public data: any) {
            this.nombre = data.nombre;
            this.fechaI = data.fechaI;
            this.fechaF = data.fechaF;
            this.idAbogado = data.idAbogado;
            this.firma = data.firma;
            this.paginacion.size = 5;
      
            this.obtenerSolicitudesFirma();
          }
      
        ngOnInit(): void {
          
        
        }
      
        obtenerSolicitudesFirma() {
          this.cargando = true;
          this.reportesService.obtenerFilesFirmaAbogado(this.fechaI, this.fechaF,this.firma,this.idAbogado)
            .then((solicitudesUsuario) => {
              this.arrReporteFilesFirma = solicitudesUsuario;
              this.size = this.arrReporteFilesFirma.length;
              if(!(this.arrReporteFilesFirma.length > 0)) {
                
                this.cerrar("vacio");
              }
              this.paginacion.setArray(this.arrReporteFilesFirma,10);
            })
            .catch((reason) => this.utilService.manejarError(reason))
            .then(() => (this.cargando = false));
        }
      
        cerrar(accion: string = "") { this.dialogRef.close(accion); }

        descargarExcel(){
          this.cargando = true;
          this.reportesService.obtenerFilesFirmaAbogadoExcel(this.fechaI, this.fechaF,this.nombre)
            .subscribe(
              data =>{
                const file = new Blob([data], {type: 'application/vnd.ms-excel'});
                var fileUrl = URL.createObjectURL(file);
                let link: any = window.document.createElement('a');
                link.href = fileUrl;
                let aux = fileUrl.split('/');
                link.download = aux[aux.length -1]+".xlsx";
                link.click();
                this.cargando = false;
              }
            )
        }

}
