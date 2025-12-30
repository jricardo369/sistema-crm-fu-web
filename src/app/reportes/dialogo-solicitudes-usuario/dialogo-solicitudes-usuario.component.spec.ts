import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoSolicitudesUsuarioComponent } from './dialogo-solicitudes-usuario.component';

describe('DialogoSolicitudesUsuarioComponent', () => {
  let component: DialogoSolicitudesUsuarioComponent;
  let fixture: ComponentFixture<DialogoSolicitudesUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogoSolicitudesUsuarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoSolicitudesUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
