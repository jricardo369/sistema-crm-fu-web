import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EventoSolicitud } from 'src/model/evento-solicitud';
import { API_URL } from '../app.config';

@Injectable({
    providedIn: 'root'
})
export class EventoSolicitudVocService {

    constructor(private http: HttpClient) { }

    obtenerEventosSolicitud(idSolicitud: number, idUsuario: number): Promise<EventoSolicitud[]> {
        return new Promise<EventoSolicitud[]>((resolve, reject) =>
            this.http
                .get(API_URL + "eventos-solicitud-voc/" + idSolicitud + "?idUsuario=" + idUsuario, {
                    withCredentials: true,
                    observe: "response",
                    headers: new HttpHeaders()
                        .append("Content-Type", "application/json")
                        .append("Authorization", localStorage.getItem("auth_token")),
                })
                .toPromise()
                .then((response) => {
                    resolve(response.body as EventoSolicitud[]);
                })
                .catch((reason) => reject(reason))
        );
    }

    crearEventoSolicitud(eventoSolicitud: EventoSolicitud): Promise<any> {
        return new Promise<any>((resolve, reject) =>
            this.http
                .post(API_URL + "eventos-solicitud-voc", eventoSolicitud, {
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

    actualizarEventoSolicitud(idSolicitud: number, numSesiones: number, motivo: string,idUsuarioEnvio: number,tipo: string): Promise<any> {
    return new Promise<any>((resolve, reject) =>
      this.http
        .put(API_URL + "eventos-solicitud-voc/ajusteSesionesVOC/"+idSolicitud+"?numSesiones="+numSesiones+"&motivo="+motivo+"&idUsuarioEnvio="+idUsuarioEnvio+"&tipo="+tipo, null, {
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

  obtenerHistorialSesionesSolicitud(idSolicitud: number): Promise<EventoSolicitud[]> {
        return new Promise<EventoSolicitud[]>((resolve, reject) =>
            this.http
                .get(API_URL + "eventos-solicitud-voc/obtener-historial-nsesiones/" + idSolicitud, {
                    withCredentials: true,
                    observe: "response",
                    headers: new HttpHeaders()
                        .append("Content-Type", "application/json")
                        .append("Authorization", localStorage.getItem("auth_token")),
                })
                .toPromise()
                .then((response) => {
                    resolve(response.body as EventoSolicitud[]);
                })
                .catch((reason) => reject(reason))
        );
    }

    actualizarTipoEventoSolicitudVoc(idEvento: number, tipoEvento: string): Promise<EventoSolicitud[]> {
        return new Promise<any>((resolve, reject) =>
      this.http
        .put(API_URL + "eventos-solicitud-voc/actualizar-tipo-evento/" + idEvento + "?tipoEvento=" + tipoEvento, null, {
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
