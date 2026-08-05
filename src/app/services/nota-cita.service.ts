import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EventoSolicitud } from 'src/model/evento-solicitud';
import { API_URL } from '../app.config';
import { CitaSolicitud } from 'src/model/cita-solicitud';
import { NotaCita } from 'src/model/nota-cita';

@Injectable({
  providedIn: 'root'
})
export class NotaCitaService {

  constructor(private http: HttpClient) { }

  obtenerNotasCita(idCita: number): Promise<NotaCita[]> {
    return new Promise<NotaCita[]>((resolve, reject) =>
      this.http
        .get(API_URL + "notas-citas/" + idCita, {
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => {
          resolve(response.body as NotaCita[]);
        })
        .catch((reason) => reject(reason))
    );
  }

  obtenerNotasCitasRangoFechas(fechaInicio: string, fechaFin: string): Promise<NotaCita[]> {
    return new Promise<NotaCita[]>((resolve, reject) =>
      this.http
        .get(API_URL + "notas-citas/rango-fechas?fechai=" + fechaInicio + "&fechaf=" + fechaFin, {
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => {
          resolve(response.body as NotaCita[]);
        })
        .catch((reason) => reject(reason))
    );
  }

  eliminarNotasCita(idNota: number,idUsuario: number): Promise<NotaCita[]> {
    return new Promise<NotaCita[]>((resolve, reject) =>
      this.http
        .delete(API_URL + "notas-citas/" + idNota+"?idUsuario="+idUsuario, {
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => {
          resolve(response.body as NotaCita[]);
        })
        .catch((reason) => reject(reason))
    );
  }

  firmarNota(idNota: number,idUsuario: number,idSolicitud: number,tipo: string): Promise<NotaCita[]> {
    return new Promise<any>((resolve, reject) =>
      this.http
        .put(API_URL + "notas-citas/firmar/"+ idNota+"?idUsuario="+idUsuario+"&idSolicitud="+idSolicitud+"&tipo="+tipo,  {
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => {
          resolve(response);
        })
        .catch((reason) => reject(reason))
    );
  }

  rechazarNota(idNota: number,idUsuario: number,motivo: string): Promise<NotaCita[]> {
    return new Promise<any>((resolve, reject) =>
      this.http
        .put(API_URL + "notas-citas/rechazar/"+ idNota+"?idUsuario="+idUsuario+"&motivo="+motivo,  {
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => {
          resolve(response);
        })
        .catch((reason) => reject(reason))
    );
  }

  guardarNota(nota: NotaCita): Promise<any> {
    let c = {
      "idCita": nota.idCita,
      "descripcion": nota.descripcion,
      "fechaCreacion": nota.fechaCreacion,
      "hora": nota.hora,
      "tipo": nota.tipo,
      "referencia": nota.referencia,
      "tiempoSesion": nota.tiempoSesion,
      "enfoquePrincipal": nota.enfoquePrincipal,
      "locacionVerificada": nota.locacionVerificada,
      "sintomaComportamiento1": nota.sintomaComportamiento1,
      "rating1": nota.rating1,
      "sintomaComportamiento2": nota.sintomaComportamiento2,
      "rating2": nota.rating2,
      "sintomaComportamiento3": nota.sintomaComportamiento3,
      "rating3": nota.rating3,
      "tipoContenidoSesion": nota.tipoContenidoSesion,
      "comentarios": nota.comentarios,
      "respuestaDeIntervencion": nota.respuestaDeIntervencion,
      "resumenEvaluacion": nota.resumenEvaluacion,
      "planFuturo": nota.planFuturo,
      "siHiAsignado": nota.siHiAsignado
    };
    console.log(c)
    return new Promise<any>((resolve, reject) =>
      this.http
        .post(API_URL + "notas-citas", c, {
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
