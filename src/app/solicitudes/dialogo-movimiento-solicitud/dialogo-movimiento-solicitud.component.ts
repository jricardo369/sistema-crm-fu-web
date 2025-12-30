import { Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MovimientoSolicitudService } from 'src/app/services/movimiento-solicitud.service';
import { TiposPagoService } from 'src/app/services/tipos-pago.service';
import { UtilService } from 'src/app/services/util.service';
import { MovimientoSolicitud } from 'src/model/movimiento-solicitud';
import { TipoPago } from 'src/model/tipo-pago';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
	standalone: true, imports: [RouterModule, FormsModule, CommonModule, MatIconModule, MatProgressSpinnerModule, MatDialogModule],
	selector: 'app-dialogo-movimiento-solicitud',
	templateUrl: './dialogo-movimiento-solicitud.component.html',
	styleUrls: ['./dialogo-movimiento-solicitud.component.css']
})
export class DialogoMovimientoSolicitudComponent implements OnInit {

	
	cargando: boolean = false;
	public movimientoSolicitud: MovimientoSolicitud = new MovimientoSolicitud;
	arrTipoPago: TipoPago[] = [];

	private idUsuario: number = null;

	constructor(
		private movimientoSolicitudService: MovimientoSolicitudService,
		private tiposPagoService: TiposPagoService,
		public utilService: UtilService,
		private dialog: MatDialog,
		public dialogRef: MatDialogRef<DialogoMovimientoSolicitudComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any) {
		this.movimientoSolicitud.idSolicitud = data.idSolicitud;
		this.movimientoSolicitud.tipoMovimiento = "Payment";
		this.idUsuario = data.idUsuario;
		this.obtenerTiposPago();
	}

	ngOnInit(): void {
	}

	obtenerTiposPago() {
		this.cargando = true;
		this.tiposPagoService
			.obtenerTiposPago()
			.then((tiposPago) => {
				this.arrTipoPago = tiposPago;
			})
			.catch((reason) => this.utilService.manejarError(reason))
			.then(() => (this.cargando = false));
	}

	typeSelected() { }

	crear() {

		 console.log("creando");
		this.movimientoSolicitud.fecha = Date.now().toString();
		this.cargando = true;
		this.movimientoSolicitudService
			.crearMovimientoSolicitud(this.movimientoSolicitud, this.idUsuario)
			.then(() => {
				this.cerrar('creado');
			})
			.catch(reason => this.utilService.manejarError(reason))
			.then(() => this.cargando = false);

	}

	cerrar(accion: string = "") { this.dialogRef.close(accion); }
}
