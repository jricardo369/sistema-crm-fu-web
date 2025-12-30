import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Inject, Component } from "@angular/core";
import { DomSanitizer } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
    standalone: true,imports: [RouterModule,FormsModule],
    selector: 'dialogo-frame',
    templateUrl: 'dialogo-frame.component.html',
    styleUrls: ['./dialogo-frame.component.scss']
})
export class DialogoFrameComponent {

    src = null;
    recuperarPasswordOnly = false;

    constructor(
        private sanitizer: DomSanitizer,
        public dialogRef: MatDialogRef<DialogoFrameComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
        this.src = this.sanitizer.bypassSecurityTrustResourceUrl(data.src);
    }

    cerrar() { this.dialogRef.close(); }

}