import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoFilesLawyerComponent } from './dialogo-files-lawyer.component';

describe('DialogoFilesLawyerComponent', () => {
  let component: DialogoFilesLawyerComponent;
  let fixture: ComponentFixture<DialogoFilesLawyerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogoFilesLawyerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoFilesLawyerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
