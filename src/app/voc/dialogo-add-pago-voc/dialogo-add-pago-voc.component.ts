import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UtilService } from 'src/app/services/util.service';
import { PagosVocService } from 'src/app/services/pagos-voc.service';

import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';

import { CargoVoc } from 'src/model/cargo-voc';
import { PagoVoc } from 'src/model/pago-voc';
import { Usuario } from 'src/model/usuario';

@Component({
  standalone: true,
  imports: [
    FormsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    CurrencyPipe
  ],
  selector: 'app-dialogo-add-pago-voc',
  templateUrl: './dialogo-add-pago-voc.component.html',
  styleUrls: ['./dialogo-add-pago-voc.component.css']
})
export class DialogoAddPagoVocComponent implements OnInit {

  cargoVoc: CargoVoc;
  usuario: Usuario = new Usuario();
  monto: number = 0;
  descripcion: string = '';
  arrPagos: PagoVoc[] = [];
  cargando: boolean = false;

  get totalPagado(): number {
    return this.arrPagos.reduce((sum, p) => sum + p.monto, 0);
  }

  get montoRestante(): number {
    return this.cargoVoc.amount - this.totalPagado;
  }

  get citaPagada(): boolean {
    return this.arrPagos.length > 0 && this.totalPagado >= this.cargoVoc.amount;
  }

  constructor(
    public dialogRef: MatDialogRef<DialogoAddPagoVocComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private utilService: UtilService,
    private pagosVocService: PagosVocService
  ) {
    this.cargoVoc = data.cargoVoc;
    const usuarioStorage = localStorage.getItem('objUsuario');
    if (usuarioStorage) {
      this.usuario = JSON.parse(usuarioStorage);
    }
  }

  ngOnInit(): void {
    this.cargando = true;
    this.pagosVocService.obtenerPagosSolicitud(this.cargoVoc.idCita)
      .then(pagos => {
        this.arrPagos = pagos;
        this.monto = this.montoRestante;
      })
      .catch(reason => this.utilService.manejarError(reason))
      .then(() => this.cargando = false);
  }

  cerrar(): void {
    this.dialogRef.close();
  }

  guardar(): void {
    if (!this.monto || this.monto <= 0) {
      this.utilService.mostrarDialogoSimple('Error', 'The amount is required');
      return;
    }

    if (this.monto > this.montoRestante) {
      this.utilService.mostrarDialogoSimple('Error', 'The amount exceeds the remaining balance of ' + this.montoRestante.toFixed(2));
      return;
    }

    const nuevoPago: PagoVoc = {
      monto: this.monto,
      descripcion: this.descripcion,
      tipoPago: 0,
      idCita: this.cargoVoc.idCita,
      idUsuario: this.usuario.idUsuario
    };

    this.cargando = true;
    this.pagosVocService.crearPago(nuevoPago)
      .then(() => {
        return this.pagosVocService.obtenerPagosSolicitud(this.cargoVoc.idCita);
      })
      .then(pagos => {
        this.arrPagos = pagos;
        this.monto = this.montoRestante;
        this.descripcion = '';
      })
      .catch(reason => this.utilService.manejarError(reason))
      .then(() => this.cargando = false);
  }

  eliminarPago(pago: PagoVoc): void {
    if (!pago.idPago) return;
    this.utilService.mostrarDialogoSimple(
      'Delete Payment',
      'Are you sure you want to delete this payment?',
      'Yes', 'No')
      .then(valor => {
        if (valor == 'ok') {
          this.cargando = true;
          this.pagosVocService.eliminarPago(pago.idPago)
            .then(() => {
              return this.pagosVocService.obtenerPagosSolicitud(this.cargoVoc.idCita);
            })
            .then(pagos => {
              this.arrPagos = pagos;
            })
            .catch(reason => this.utilService.manejarError(reason))
            .then(() => this.cargando = false);
        }
      });
  }
}
