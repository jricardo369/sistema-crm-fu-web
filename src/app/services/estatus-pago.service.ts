import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../app.config';
import { EstatusPago } from 'src/model/estatus-pago';

@Injectable({
    providedIn: 'root'
})
export class EstatusPagoService {

    constructor(private http: HttpClient) { }

    obtenerEstatusPagos(): Promise<EstatusPago[]> {
        return new Promise<EstatusPago[]>((resolve, reject) =>
            this.http
                .get(API_URL + "estatus-pago", {
                    withCredentials: true,
                    observe: "response",
                    headers: new HttpHeaders()
                        .append("Content-Type", "application/json")
                        .append("Authorization", localStorage.getItem("auth_token")),
                })
                .toPromise()
                .then((response) => {
                    resolve(response.body as EstatusPago[]);
                })
                .catch((reason) => reject(reason))
        );
    }
}
