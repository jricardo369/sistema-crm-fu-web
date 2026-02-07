import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../app.config';
import { EstadoUsuario } from 'src/model/estado-usuario';

@Injectable({
    providedIn: 'root'
})
export class EstadoUsuarioService {

    constructor(private http: HttpClient) { }

    obtenerEstadosUsuarios(idUsuario: number): Promise<EstadoUsuario[]> {
        return new Promise<EstadoUsuario[]>((resolve, reject) => this.http
            .get(API_URL + 'estado-usuario/' + idUsuario,
                {
                    withCredentials: true,
                    observe: 'response',
                    headers: new HttpHeaders().append('Content-Type', 'application/json').append('Authorization', localStorage.getItem('auth_token'))
                })
            .toPromise()
            .then(response => {
                resolve(response.body as EstadoUsuario[]);
            })
            .catch(reason => reject(reason))
        );
    }

    insertarEstadoUsuario(estado: string, idUsuario: number, idUsuarioEnvio: number,licencia: string): Promise<any> {
        let nuevoObj = {
            estado: estado,
            idUsuario: idUsuario,
            noLicencia: licencia
        }

		    let params = new HttpParams();
        params = params.set("idUsuarioEnvio", idUsuarioEnvio);
        return new Promise((resolve, reject) => this.http
            .post(API_URL + 'estado-usuario', nuevoObj,
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

    eliminarEstadoUSuario(idEstadoUsuario: number) {
        return new Promise((resolve, reject) => this.http
            .delete(API_URL + 'estado-usuario/' + idEstadoUsuario,
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
