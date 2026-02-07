import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { API_URL } from "../app.config";
import { DisponibilidadUsuario } from "src/model/disponibilidad-usuario";
import { UtilService } from 'src/app/services/util.service';
import { lastValueFrom } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DisponibilidadUsuariosService {
  constructor(private http: HttpClient,public utilService: UtilService) {
    
   }

  obtenerDisponibilidadUsuariosPorDia(fecha: string, fechaAnterior: boolean, rol: string, idSolicitud: number, estado: string): Promise<DisponibilidadUsuario[]> {
    return new Promise<DisponibilidadUsuario[]>((resolve, reject) =>
      this.http
        .get(API_URL + "disponibilidad-usuarios/de-dia/" + fecha + "?rol=" + rol + "&fechaAnterior=" + fechaAnterior
          +"&idSolicitud="+idSolicitud+"&estado="+estado, {
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => {
          resolve(response.body as DisponibilidadUsuario[]);
        })
        .catch((reason) => reject(reason))
    );
  }

  obtenerDisponibilidadUsuario(idUsuario: number): Promise<DisponibilidadUsuario[]> {
    return new Promise<DisponibilidadUsuario[]>((resolve, reject) =>
      this.http
        .get(API_URL + "disponibilidad-usuarios/" + idUsuario, {
          withCredentials: true,
          observe: "response",
          headers: new HttpHeaders()
            .append("Content-Type", "application/json")
            .append("Authorization", localStorage.getItem("auth_token")),
        })
        .toPromise()
        .then((response) => {
          resolve(response.body as DisponibilidadUsuario[]);
        })
        .catch((reason) => reject(reason))
    );
  }

  agregarDisponibilidadUsuario(disponibilidadUsuario: DisponibilidadUsuario): Promise<any> {
    return new Promise<any>((resolve, reject) =>
      this.http
        .post(API_URL + "disponibilidad-usuarios", disponibilidadUsuario, {
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

  cargarDisponibilidadMasiva(idUsuario: number, archivo: File): Promise<any> {
    let formData = new FormData();
    formData.append('archivo', archivo);

    return new Promise((resolve, reject) => this.http
      .post(API_URL + 'disponibilidad-usuarios/excel/' + idUsuario, formData,
        {
          withCredentials: true,
          observe: 'response',
          headers: new HttpHeaders().append('Authorization', localStorage.getItem('auth_token'))
        })
      .toPromise()
      .then(response => {
        resolve(response.body);
      })
      .catch(reason => reject(reason))
    );
  }

  eliminarDisponibilidadUsuario(idDisponibilidad: number) {
    return new Promise((resolve, reject) => this.http
      .delete(API_URL + 'disponibilidad-usuarios/' + idDisponibilidad,
        {
          withCredentials: true,
          observe: 'response',
          headers: new HttpHeaders().append('Content-Type', 'application/json').append('Authorization', localStorage.getItem('auth_token'))
        })
      .toPromise()
      .then(response => {
        resolve(response.body);
      })
      .catch(reason => reject(reason))
    );
  }

  async obtenerLayout(): Promise<any> {

    return new Promise<any>((resolve, reject) => {
      this.http
        .get(API_URL + "disponibilidad-usuarios/excel/obtener-layout",
          {
            withCredentials: true,
            observe: 'response',
            responseType: 'arraybuffer',
            headers: new HttpHeaders().append('Content-Type', 'application/octet-stream').append('Authorization', localStorage.getItem('auth_token'))
          })
        .toPromise()
        .then(response => {
          resolve(response.body);
        }).catch(reason => reject(reason));
    });

  }

}
