import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { API_URL } from '../app.config';
import { Observable } from 'rxjs';
import { Configuracion } from 'src/model/configuracion';

@Injectable({
    providedIn: 'root'
})
    
export class ConfiguracionService {
    constructor(private http: HttpClient) {}

    asignarVariable(configuracion: Configuracion) {
        return this.http.put(API_URL + 'configuraciones', configuracion, {
            withCredentials: true,
            headers: new HttpHeaders().append('Content-Type', 'application/json').append('Authorization', localStorage.getItem('auth_token')),
            observe: 'response'
        }).toPromise();
    }

    envioMensajePrueba() {
        return this.http.get(API_URL + 'util/envio-mensaje-prueba', {
            withCredentials: true,
            headers: new HttpHeaders().append('Content-Type', 'application/json').append('Authorization', localStorage.getItem('auth_token')),
            observe: 'response'
        }).toPromise();
    }

    getConfiguraciones(): Observable<Configuracion[]> {
        return this.http.get<Configuracion[]>(API_URL + 'configuraciones',
            {
                withCredentials: true,
                headers: new HttpHeaders().append('Content-Type', 'application/json').append('Authorization', localStorage.getItem('auth_token'))
            });
    }

}
