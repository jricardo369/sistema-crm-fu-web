import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { API_URL } from "../app.config";
import { TipoPago } from "src/model/tipo-pago";

@Injectable({
	providedIn: "root",
})
export class TiposPagoService {
	constructor(private http: HttpClient) { }

	obtenerTiposPago(): Promise<TipoPago[]> {
		return new Promise<TipoPago[]>((resolve, reject) =>
			this.http
				.get(API_URL + "tipos-pagos", {
					withCredentials: true,
					observe: "response",
					headers: new HttpHeaders()
						.append("Content-Type", "application/json")
						.append("Authorization", localStorage.getItem("auth_token")),
				})
				.toPromise()
				.then((response) => {
					resolve(response.body as TipoPago[]);
				})
				.catch((reason) => reject(reason))
		);
	}

}
