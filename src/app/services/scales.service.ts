import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../app.config';
import { Scale } from 'src/model/scale';

@Injectable({
    providedIn: 'root'
})
export class ScalesService {

    constructor(private http: HttpClient) { }

    obtenerScalesSolicitud(idSolicitud: number): Promise<Scale[]> {
        return new Promise<Scale[]>((resolve, reject) => this.http
            .get(API_URL + 'scales/' + idSolicitud,
                {
                    withCredentials: true,
                    observe: 'response',
                    headers: new HttpHeaders().append('Content-Type', 'application/json').append('Authorization', localStorage.getItem('auth_token'))
                })
            .toPromise()
            .then(response => {
                resolve(response.body as Scale[]);
            })
            .catch(reason => reject(reason))
        );
    }

    insertarScale(idSolicitud: number, nuevo: Scale, idUsuario: number) {
        let nuevoScale = {
            scale: nuevo.scale,
            idSolicitud: idSolicitud
        }

		    let params = new HttpParams();
        params = params.set("idUsuario", idUsuario.toString());
        return new Promise((resolve, reject) => this.http
            .post(API_URL + 'scales', nuevoScale,
                {
                    params: params,
                    withCredentials: true,
                    observe: 'response',
                    headers: new HttpHeaders().append('Content-Type', 'application/json').append('Authorization', localStorage.getItem('auth_token'))
                })
            .toPromise()
            .then(response => {
                console.log(response);
                resolve(response.body);
            })
            .catch(reason => reject(reason))
        );
    }

    eliminarScale(idScale: number) {
        return new Promise((resolve, reject) => this.http
            .delete(API_URL + 'scales/' + idScale,
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
}
