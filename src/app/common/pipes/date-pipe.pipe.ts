import { Pipe,PipeTransform,inject } from "@angular/core";
import { DatePipe } from '@angular/common';

@Pipe({
	name: "dateMMDDYYYY",
  standalone: true,
})
export class DateMMDDYYYYPipe implements PipeTransform {
  private datePipe = inject(DatePipe);
  
  transform(
    value: string | Date | number | null | undefined, 
    caseType: 'date' | 'datetime' = 'date'
  ): string | null {
    if (!value) return null;
    
    try {
      // Convertir a formato ISO si es Date o number
      let dateString: string;
      
      if (value instanceof Date) {
        dateString = value.toISOString();
      } else if (typeof value === 'number') {
        dateString = new Date(value).toISOString();
      } else {
        dateString = value;
      }
      
      // Formatear la fecha
      const dateParts = dateString.split(/[\sT]/);
      const dateOnly = dateParts[0].split("-");
      
      if (dateOnly.length !== 3) {
        // Fallback a DatePipe para formatos no reconocidos
        return this.formatWithDatePipe(value, caseType);
      }
      
      const formattedDate = `${dateOnly[1]}/${dateOnly[2]}/${dateOnly[0]}`;
      
      // Agregar tiempo si es necesario
      if (caseType === 'datetime' && dateParts.length > 1) {
        const timePart = dateParts[1].split(".")[0]; // Remover milisegundos
        return `${formattedDate} ${timePart}`;
      }
      
      return formattedDate;
    } catch (error) {
      console.error('Error formateando fecha:', error);
      return this.formatWithDatePipe(value, caseType);
    }
  }
  
  private formatWithDatePipe(
    value: string | Date | number | null | undefined, 
    caseType: 'date' | 'datetime'
  ): string | null {
    const format = caseType === 'datetime' ? 'MM/dd/yyyy HH:mm:ss' : 'MM/dd/yyyy';
    return this.datePipe.transform(value, format);
  }
}