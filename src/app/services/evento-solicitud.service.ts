import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EventoSolicitud } from 'src/model/evento-solicitud';
import { API_URL } from '../app.config';
import { CitaActivaSolicitud } from 'src/model/cita-activa-solicitud';

@Injectable({
  providedIn: 'root'
})
export class EventoSolicitudService {

  constructor(private http: HttpClient) { }

  obtenerEventosSolicitud(idSolicitud: number, idUsuario: number): Promise<EventoSolicitud[]> {
    return new Promise<EventoSolicitud[]>((resolve, reject) =>
      this.http
        .get(API_URL + "eventos-solicitud/" + idSolicitud + "?idUsuario=" + idUsuario, {
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

  obtenerCitasActivas(idSolicitud: number,idUsuario: number): Promise<CitaActivaSolicitud[]> {
    return new Promise<CitaActivaSolicitud[]>((resolve, reject) =>
      this.http
        .get(API_URL + "eventos-solicitud/schedules-activas/" + idSolicitud+"?idUsuario="+idUsuario, {
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => {
          resolve(response.body as CitaActivaSolicitud[]);
        })
        .catch((reason) => reject(reason))
    );
  }

  crearEventoSolicitud(eventoSolicitud: EventoSolicitud,idUsuarioSchedule: number): Promise<any> {
    return new Promise<any>((resolve, reject) =>
      this.http
        .post(API_URL + "eventos-solicitud?idUsuarioSchedule="+idUsuarioSchedule, eventoSolicitud, {
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

  

  cancelarCita(idEventoSeleccionado: string, idUsuario: number, motivo: string): Promise<any> {
    return new Promise<any>((resolve, reject) =>
      this.http
        .put(API_URL + "eventos-solicitud/cancelar-schedule/" + idEventoSeleccionado + "?idUsuario=" + idUsuario+ "&motivo=" + motivo, {
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => resolve(response))
        .catch((reason) => reject(reason))
    );
  }
}
