import { Pipe,PipeTransform,inject } from "@angular/core";
import { DatePipe } from '@angular/common';

@Pipe({
  standalone: true,
	name: "phone",
})
export class PhonePipe {
	transform(value: string): string {
    return value ? value.replace(/(\d{0,3})(\d{0,3})(\d{0,4})/, '($1) $2-$3') : "";
  }
}
