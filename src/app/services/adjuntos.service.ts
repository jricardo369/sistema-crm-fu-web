import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Adjunto } from 'src/model/adjunto';
import { API_URL } from '../app.config';

@Injectable({
    providedIn: 'root'
})
export class AdjuntosService {

    constructor(private http: HttpClient) { }

    obtenerAdjuntosSolicitud(idSolicitud: number): Promise<Adjunto[]> {
        return new Promise<Adjunto[]>((resolve, reject) => this.http
            .get(API_URL + 'adjuntos/' + idSolicitud,
                {
                    withCredentials: true,
                    observe: 'response',
                    headers: new HttpHeaders().append('Content-Type', 'application/json').append('Authorization', localStorage.getItem('auth_token'))
                })
            .toPromise()
            .then(response => {
                resolve(response.body as Adjunto[]);
            })
            .catch(reason => reject(reason))
        );
    }

    insertarAdjunto(idSolicitud: number, archivo: File, idUsuario: number) {
        let formData = new FormData();
        formData.append('archivo', archivo);

        let params = new HttpParams();
        params = params.set("idUsuario", idUsuario.toString());

        return new Promise((resolve, reject) => this.http
            .post(API_URL + 'adjuntos/' + idSolicitud + '/adjunto', formData,
                {
                    params: params,
                    withCredentials: true,
                    observe: 'response',
                    headers: new HttpHeaders().append('Authorization', localStorage.getItem('auth_token'))
                })
            .toPromise()
            .then(response => {
                console.log(response);
                resolve(response.body);
            })
            .catch(reason => reject(reason))
        );
    }

    eliminarAdjunto(idImagen: number, idUsuario: number) {
        let params = new HttpParams();
        params = params.set("idUsuario", idUsuario.toString());

        return new Promise((resolve, reject) => this.http
            .delete(API_URL + 'adjuntos/' + idImagen,
                {
                    params: params,
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
}
