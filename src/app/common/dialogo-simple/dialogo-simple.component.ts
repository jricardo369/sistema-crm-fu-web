import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Inject, Component } from "@angular/core";
import { RouterModule } from '@angular/router';
import { MatDialogModule, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';

@Component({
    standalone: true,imports: [RouterModule,
        MatDialogModule, 
    MatDialogContent, 
    MatDialogActions, 
    MatDialogClose,
    MatButtonModule,FormsModule,CommonModule
    ],
    selector: 'dialogo-simple',
    templateUrl: 'dialogo-simple.component.html',
    styleUrls: ['./dialogo-simple.component.scss']
})
export class DialogoSimpleComponent {

    titulo: string;
    texto: string;
    botones: any[];

    // COMBOBOX
    comboboxLabel: string;
    comboboxItems: any[];
    comboboxDisplayField: string;
    comboboxSublabel: string;
    selectedItem: any;

    // FIELDS
    fields: any[] = null;
    values: any[] = [];

    public textarea: any;

    warning: string = null;

    constructor(
        public dialogRef: MatDialogRef<DialogoSimpleComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {

        this.titulo = data.titulo;
        this.texto = data.texto;
        this.botones = data.botones;
        this.textarea = data.textarea;

        this.comboboxLabel = data.comboboxLabel;
        this.comboboxItems = data.comboboxItems;
        this.comboboxDisplayField = data.comboboxDisplayField;
        this.comboboxSublabel = data.comboboxSublabel;

        this.fields = data.fields;

        this.warning = data.warning;
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onFieldChange(event: Event, field: any) {
        let value: any = (event.srcElement as HTMLInputElement).value;
        if (field.type == "number") value = Number.parseFloat(value);
        field.value = value;
    }
}
