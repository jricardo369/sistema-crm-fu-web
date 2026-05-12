export class Solicitud {

  idSolicitud: number;
  fechaInicio: Date;
  fechaNacimiento: Date | string;
  adicional: string;
  cliente: string;
  telefono: string;
  email: string;
  docusign: string;
  amount: number;
  abogado: string;
  email_abogado: string;
  numeroDeCaso: string;
  idTipoSolicitud: number;
  idEstatusSolicitud: number;
  idEstatusPago: number;
  firmaAbogados: string;
  tipoSolicitud: string;
  estatusSolicitud: string;
  estatusPago: string;
  age: number;
  fecha_schedule: Date;
  idUsuarioRevisor: number;
  importante: string;
  usuarioRevisor: string;
  usuarioRevisando: string;
  idUsuarioRevisando: number;

  idioma: string;
  tipoEntrevista: string;
  direccion: string;
  estado: string;
  referencia: string;

  apellidos: string;

  usuarioRevisandoNombre: string;
  asignacionTemplate: boolean;

  waiver: boolean;
  paralegalName: string;
  paralegalEmails: string;
  paralegalTelefonos: string;

  asignacionIntSc: boolean;
  usuarioIntScNombre: string;

  fecha_schedule_scales: Date;

  external: boolean;
  usuarioExternal: number;

  dueDate: String;
  finIntIni: boolean;
  finIntSc: boolean;

  assignedClinician: number;
  usuarioInterview: number;

  idAbogado: number;
  emailAboSel: string;
  lostFile: boolean;

  conCupon: boolean;
  fechaCupon: string;
  sexo: string;
  idRolUsInt: number;
  fechaClinicianAppo: string;

  importantNotes: string;
  caseNumber: string;
  signedClnc: boolean;
  fechaDeCrimen: string;

}
