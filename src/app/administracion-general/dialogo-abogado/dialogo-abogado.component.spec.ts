import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoAbogadoComponent } from './dialogo-abogado.component';

describe('DialogoAbogadoComponent', () => {
  let component: DialogoAbogadoComponent;
  let fixture: ComponentFixture<DialogoAbogadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogoAbogadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoAbogadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
