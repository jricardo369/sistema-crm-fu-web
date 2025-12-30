import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [RouterModule,MatIconModule,CommonModule,FormsModule],
  selector: 'app-workspace-nav',
  templateUrl: './workspace-nav.component.html',
  styleUrls: ['./workspace-nav.component.css']
})
export class WorkspaceNavComponent implements OnInit {

  constructor(public utilService: UtilService) { }

  ngOnInit() {
  }

}
