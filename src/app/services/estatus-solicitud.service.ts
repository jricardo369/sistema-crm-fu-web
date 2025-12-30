import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../app.config';
import { EstatusSolicitud } from 'src/model/estatus-solicitud';

@Injectable({
    providedIn: 'root'
})
export class EstatusSolicitudService {

    constructor(private http: HttpClient) { }

    obtenerEstatusSolicitudes(): Promise<EstatusSolicitud[]> {
        return new Promise<EstatusSolicitud[]>((resolve, reject) =>
            this.http
                .get(API_URL + "estatus-solicitud", {
                    withCredentials: true,
                    observe: "response",
                    headers: new HttpHeaders()
                        .append("Content-Type", "application/json")
                        .append("Authorization", localStorage.getItem("auth_token")),
                })
                .toPromise()
                .then((response) => {
                    resolve(response.body as EstatusSolicitud[]);
                })
                .catch((reason) => reject(reason))
        );
    }

    obtenerEstatusSolicitudesDeUsuario(idUsuario: number): Promise<EstatusSolicitud[]> {
        return new Promise<EstatusSolicitud[]>((resolve, reject) =>
            this.http
                .get(API_URL + "estatus-solicitud/"+idUsuario, {
                    withCredentials: true,
                    observe: "response",
                    headers: new HttpHeaders()
                        .append("Content-Type", "application/json")
                        .append("Authorization", localStorage.getItem("auth_token")),
                })
                .toPromise()
                .then((response) => {
                    resolve(response.body as EstatusSolicitud[]);
                })
                .catch((reason) => reject(reason))
        );
    }
}
