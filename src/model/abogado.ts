import { EmailAbogado } from "./email-abogado";

export class Abogado {
    idAbogado: number;
    firma: string;
    nombre: string;
    email: string;
    telefono: string;
    sinonimos: string;
    fechaCreacion: string;
    cupon: boolean;
    fechaCupon: string;
    estado: string;
    referencia: string; 
    emailsAbogado: EmailAbogado[] = []; 
}
