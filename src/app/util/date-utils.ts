/**
 * Utilidades para manejo de fechas
 */

/**
 * Convierte un objeto Date a string en formato YYYY-MM-DD
 * @param fecha - Objeto Date a formatear
 * @returns String en formato YYYY-MM-DD
 */
export function formatearFecha(fecha: Date): string {
  if (!fecha) {
    return '';
  }
  
  const year = fecha.getFullYear();
  const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
  const day = fecha.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Convierte un string en formato YYYY-MM-DD a objeto Date
 * @param fechaString - String en formato YYYY-MM-DD
 * @returns Objeto Date
 */
export function parsearFecha(fechaString: string): Date | null {
  if (!fechaString) {
    return null;
  }
  
  const [year, month, day] = fechaString.split('-').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0);
}

/**
 * Convierte cualquier tipo de fecha (string o Date) a string YYYY-MM-DD
 * @param fecha - Date o string a formatear
 * @returns String en formato YYYY-MM-DD
 */
export function normalizarFecha(fecha: Date | string): string {
  if (!fecha) {
    return '';
  }
  
  if (typeof fecha === 'string') {
    if (fecha.includes('T') || fecha.includes('Z')) {
      // Es ISO string, extraer solo la parte de la fecha
      return fecha.split('T')[0];
    }
    return fecha;
  }
  
  return formatearFecha(fecha);
}

/**
 * Crea una fecha local sin problemas de timezone
 * @param fecha - Date original
 * @returns Date local a mediodía
 */
export function crearFechaLocal(fecha: Date): Date {
  return new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate(), 12, 0, 0);
}

export function convertirAFechaMat(fechaEntrada: string) {

    let fechaCorregida: Date;

    if (typeof fechaEntrada === 'string') {
      // Si es string, parsearlo correctamente
      const fechaString = fechaEntrada as string;
      if (fechaString.includes('T') || fechaString.includes('Z')) {
        // Es ISO string, extraer solo la parte de la fecha
        const soloFecha = fechaString.split('T')[0];
        const [year, month, day] = soloFecha.split('-').map(Number);
        fechaCorregida = new Date(year, month - 1, day, 12, 0, 0);
      } else {
        // Es fecha simple YYYY-MM-DD
        const [year, month, day] = fechaString.split('-').map(Number);
        fechaCorregida = new Date(year, month - 1, day, 12, 0, 0);
      }
    } else {
      // Si ya es objeto Date, convertirlo correctamente
      const fecha = new Date(fechaEntrada as Date);
      fechaCorregida = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate(), 12, 0, 0);
    }

    return fechaCorregida;
  }