import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoSolicitudCasenumberComponent } from './dialogo-solicitud-casenumber.component';

describe('DialogoSolicitudCasenumberComponent', () => {
  let component: DialogoSolicitudCasenumberComponent;
  let fixture: ComponentFixture<DialogoSolicitudCasenumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogoSolicitudCasenumberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoSolicitudCasenumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
