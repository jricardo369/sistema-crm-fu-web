import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WorkspaceNavComponent } from 'src/app/common/workspace-nav/workspace-nav.component';
import { SolicitudesNavComponent } from 'src/app/solicitudes/solicitudes-nav/solicitudes-nav.component';
import { ExperimentalMenuComponent } from 'src/app/common/experimental-menu/experimental-menu.component';
import { CitaSolicitud } from 'src/model/cita-solicitud';

@Component({
  standalone: true,
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  imports: [
    RouterModule,
    CommonModule,
    WorkspaceNavComponent,
    SolicitudesNavComponent,
    ExperimentalMenuComponent,
  ]
})
export class CalendarComponent {
  @Input() citas: CitaSolicitud[] = [];

  readonly diasSemana = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  readonly horas = this.generarHoras();

  private generarHoras(): string[] {
    const horas = [];
    for (let i = 7; i <= 22; i++) {
      const hora12 = i === 0 ? 12 : i > 12 ? i - 12 : i;
      const periodo = i < 12 ? 'AM' : 'PM';
      horas.push(`${hora12}:00 ${periodo}`);
    }
    return horas;
  }

  obtenerCitasPorDiaYHora(dia: number, hora: string): CitaSolicitud[] {
    return this.citas.filter(cita => {
      // Parsear la fecha de la cita como YYYY-MM-DD y crear Date local
      const [year, month, day] = cita.fecha.split('-').map(Number);
      const citaFecha = new Date(year, month - 1, day); // month-1 porque los meses son 0-11
      
      // Obtener la fecha para este día de la semana
      const fechaDia = this.obtenerFechaPorDiaDate(dia);
      
      // Comparar si es el mismo día (ignorando hora)
      const mismoDia = 
        fechaDia.getFullYear() === citaFecha.getFullYear() &&
        fechaDia.getMonth() === citaFecha.getMonth() &&
        fechaDia.getDate() === citaFecha.getDate();
      
      // Formatear la hora de la cita al formato de 12 horas para comparar
      const horaCitaFormateada = this.formatearHora12(cita.hora, cita.tipo);
      
      return mismoDia && horaCitaFormateada === hora;
    });
  }

  private formatearHora12(hora: string, tipo: string): string {
    const [horas, minutos] = hora.split(':').map(Number);
    const hora12 = horas === 0 ? 12 : horas > 12 ? horas - 12 : horas;
    return `${hora12}:${minutos.toString().padStart(2, '0')} ${tipo}`;
  }

  private convertirHoraFormato24(hora: string, tipo: string): string {
    const [horas, minutos] = hora.split(':').map(Number);
    let horas24 = horas;
    
    if (tipo === 'PM' && horas !== 12) {
      horas24 = horas + 12;
    } else if (tipo === 'AM' && horas === 12) {
      horas24 = 0;
    }
    
    return `${horas24.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
  }

  obtenerEstatusClass(cita: CitaSolicitud): string {
    if (cita.noShow) {
      return 'estatus-noshow';
    }
    if (cita.pagado) {
      return 'estatus-pagado';
    }
    if (cita.dosCitas) {
      return 'estatus-doscitas';
    }
    return 'estatus-default';
  }

  procesarColor(colorHex: string | null, cita: CitaSolicitud): string {
    // Si no hay color, usar un color por defecto
    if (!colorHex) {
      return 'rgba(100, 100, 100, 0.15)'; // Gris claro por defecto
    }
    
    // Convertir hex a RGB
    const hex = colorHex.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Aplicar 15% de opacidad
    return `rgba(${r}, ${g}, ${b}, 0.15)`;
  }

  obtenerFechaPorDiaDate(diaIndex: number): Date {
    const hoy = new Date();
    const diaActual = hoy.getDay();
    const lunes = new Date(hoy);
    
    const diasLunes = diaActual === 0 ? 6 : diaActual - 1;
    lunes.setDate(hoy.getDate() - diasLunes);
    
    const fechaDia = new Date(lunes);
    fechaDia.setDate(lunes.getDate() + diaIndex);
    
    return fechaDia;
  }

  obtenerFechaPorDia(diaIndex: number): string {
    const fechaDia = this.obtenerFechaPorDiaDate(diaIndex);
    
    const mes = (fechaDia.getMonth() + 1).toString().padStart(2, '0');
    const dia = fechaDia.getDate().toString().padStart(2, '0');
    const año = fechaDia.getFullYear();
    
    return `${mes}/${dia}/${año}`;
  }
}
