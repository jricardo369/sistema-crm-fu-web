import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_URL } from '../app.config';
import { PagoVoc } from 'src/model/pago-voc';

@Injectable({
  providedIn: 'root'
})
export class PagosVocService {

  constructor(private http: HttpClient) { }

  obtenerPagosSolicitud(idCita: number): Promise<PagoVoc[]> {
    return new Promise<PagoVoc[]>((resolve, reject) =>
      this.http
        .get(API_URL + "pagos-voc/cita/" + idCita, {
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => {
          console.log('Pagos response:', response.body);
          resolve((response.body || []) as PagoVoc[]);
        })
        .catch((reason) => reject(reason))
    );
  }

  crearPago(pago: PagoVoc): Promise<any> {
    return new Promise<any>((resolve, reject) =>
      this.http
        .post(API_URL + "pagos-voc", pago, {
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => {
          resolve(response.body);
        })
        .catch((reason) => reject(reason))
    );
  }

  eliminarPago(idPago: number): Promise<any> {
    return new Promise<any>((resolve, reject) =>
      this.http
        .delete(API_URL + "pagos-voc/" + idPago, {
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => {
          resolve(response.body);
        })
        .catch((reason) => reject(reason))
    );
  }
}
