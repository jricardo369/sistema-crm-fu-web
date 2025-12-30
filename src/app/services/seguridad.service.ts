import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_URL } from '../app.config';

@Injectable({
    providedIn: 'root'
})
export class SeguridadService {

    constructor(private http: HttpClient) { }

    cambioPassword(idUsuario: number, cont: string, cont2: string) {
        let cambioPassword = {
            cont: cont,
            cont2: cont2,
            idUsuario: idUsuario
        }

        return this.http.put(API_URL + 'seguridad/cambio-password', cambioPassword, {
            withCredentials: true,
            headers: new HttpHeaders().append('Content-Type', 'application/json').append('Authorization', localStorage.getItem('auth_token')),
            observe: 'response'
        }).toPromise();
    }

    cambioEmail(idUsuario: number, correo: string, correo2: string) {
        let cambioEmail = {
            correo: correo,
            correo2: correo2,
            idUsuario: idUsuario
        }

        return this.http.put(API_URL + 'seguridad/cambio-email', cambioEmail, {
            withCredentials: true,
            headers: new HttpHeaders().append('Content-Type', 'application/json').append('Authorization', localStorage.getItem('auth_token')),
            observe: 'response'
        }).toPromise();
    }

    resetPasswordRequest(correo: string) {
        return this.http.get(API_URL + 'seguridad/reset-password-request/' + correo, {
            withCredentials: true,
            headers: new HttpHeaders().append('Content-Type', 'application/json'),
            observe: 'response'
        }).toPromise();
    }

}
