import { Component, EventEmitter, Input, Output } from '@angular/core';

function startOfWeek(date: Date, weekStartsOn: 1 | 0 = 1): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = d.getDay(); // 0=Sun .. 6=Sat
  const diff = weekStartsOn === 1
    ? (day === 0 ? -6 : 1 - day)
    : -day; // if weekStartsOn=0 => Sunday
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfWeek(date: Date, weekStartsOn: 1 | 0 = 1): Date {
  const start = startOfWeek(date, weekStartsOn);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
}

@Component({
  selector: 'app-week-navigator',
  standalone: true,
  templateUrl: './week-navigator.component.html',
  styleUrls: ['./week-navigator.component.css']
})
export class WeekNavigatorComponent {
  /** Base date inside the shown week */
  @Input() referenceDate: Date = new Date();
  /** 1 for Monday, 0 for Sunday */
  @Input() weekStartsOn: 1 | 0 = 1;
  /** Optional: locale for formatting, defaults to en-US */
  @Input() locale = 'en-US';

  /** Emits the new reference date when user navigates */
  @Output() referenceDateChange = new EventEmitter<Date>();
  /** Emits the whole week range on navigation */
  @Output() weekRangeChange = new EventEmitter<{ start: Date; end: Date }>();

  get start(): Date { return startOfWeek(this.referenceDate, this.weekStartsOn); }
  get end(): Date { return endOfWeek(this.referenceDate, this.weekStartsOn); }

  formatDate(d: Date): string {
    // Use Intl.DateTimeFormat for consistent MM/DD/YYYY with en-US
    const fmt = new Intl.DateTimeFormat(this.locale, { month: 'short', day: 'numeric', year: 'numeric' });
    return fmt.format(d);
  }

  prevWeek(): void {
    const newRef = new Date(this.referenceDate);
    newRef.setDate(newRef.getDate() - 7);
    this.referenceDate = newRef;
    this.emitChange();
  }

  nextWeek(): void {
    
    const newRef = new Date(this.referenceDate);
    newRef.setDate(newRef.getDate() + 7);
    console.log('nextWeek called:'+newRef);
    this.referenceDate = newRef;
    this.emitChange();
  }

  private emitChange(): void {
    this.referenceDateChange.emit(this.referenceDate);
    this.weekRangeChange.emit({ start: this.start, end: this.end });
  }
}
