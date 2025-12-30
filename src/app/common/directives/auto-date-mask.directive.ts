import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[autoDateMask]',
  standalone: true
})
export class AutoDateMaskDirective {
  @Input('autoDateMask') format: 'MM/DD/YYYY' | 'DD/MM/YYYY' = 'MM/DD/YYYY';

  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('input')
  onInput() {
    const input = this.el.nativeElement;
    let v = input.value.replace(/\D/g, '').slice(0, 8);

    // Inserta slashes automáticamente (misma lógica para ambos formatos)
    if (v.length >= 5) input.value = `${v.slice(0,2)}/${v.slice(2,4)}/${v.slice(4)}`;
    else if (v.length >= 3) input.value = `${v.slice(0,2)}/${v.slice(2)}`;
    else input.value = v;
  }

  @HostListener('blur')
  onBlur() {
    const input = this.el.nativeElement;
    const val = input.value.trim();
    if (!val) return;

    const reMMDD = /^(?:[1-9]|0[1-9]|1[0-2])\/(?:[1-9]|0[1-9]|[12]\d|3[01])\/\d{4}$/;
    const reDDMM = /^(?:[1-9]|0[1-9]|[12]\d|3[01])\/(?:[1-9]|0[1-9]|1[0-2])\/\d{4}$/;
    const re = this.format === 'MM/DD/YYYY' ? reMMDD : reDDMM;

    if (!re.test(val)) return;

    const [a, b, yStr] = val.split('/');
    const yyyy = +yStr;
    const dd = this.format === 'DD/MM/YYYY' ? +a : +b;
    const mm = this.format === 'DD/MM/YYYY' ? +b : +a;

    const dt = new Date(yyyy, mm - 1, dd);
    const ok = dt.getFullYear() === yyyy && dt.getMonth() === mm - 1 && dt.getDate() === dd;
    if (!ok) return;

    // Normaliza 0-leading
    const mmPad = String(mm).padStart(2, '0');
    const ddPad = String(dd).padStart(2, '0');
    input.value = this.format === 'MM/DD/YYYY' ? `${mmPad}/${ddPad}/${yyyy}` : `${ddPad}/${mmPad}/${yyyy}`;
  }
}