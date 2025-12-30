import { Notificacion } from 'src/model/notificacion';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../app.config';

@Injectable({
    providedIn: 'root'
})
export class NotificacionesService {

    constructor(private http: HttpClient) { }

    enviarNotificacion(notificacion: Notificacion, archivo: File) {
        let formData = new FormData();
        formData.append('notificacion', JSON.stringify(notificacion));
        if(archivo != null) formData.append('archivo', archivo);
        console.log(formData);
        return new Promise((resolve, reject) => this.http
            .post(API_URL + 'notificaciones', formData,
                {
                    //withCredentials: true,
                    observe: 'response',
                    //headers: new HttpHeaders().append('Authorization', localStorage.getItem('auth_token'))
                    //headers: new HttpHeaders().append('Content-Type', 'multipart/form-data').append('Authorization', localStorage.getItem('auth_token'))
                    //headers: new HttpHeaders().set('Content-Type', 'multipart/form-data').set('Authorization',  localStorage.getItem('auth_token'))
                })
            .toPromise()
            .then(response => {
                console.log(response);
                resolve(response.body);
            })
            .catch(reason => reject(reason))
        );
    }
}
