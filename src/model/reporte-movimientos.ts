import { ReporteAdeudosUsuario } from "./reporte-adeudos-usuario";
import { ReporteMovimientosUsuario } from "./reporte-movimientos-usuario"

export class ReporteMovimientos {
  cargos: number;
  abonos: number;
  balance: number;
  movimientos: ReporteMovimientosUsuario[];
  adeudos: ReporteAdeudosUsuario[];
}
