import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoMailsAbogado } from './dialogo-mails-abogado';

describe('DialogoMailsAbogado', () => {
  let component: DialogoMailsAbogado;
  let fixture: ComponentFixture<DialogoMailsAbogado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogoMailsAbogado]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogoMailsAbogado);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
