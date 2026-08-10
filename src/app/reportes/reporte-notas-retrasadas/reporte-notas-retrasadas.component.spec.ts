import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteNotasRetrasadasComponent } from './reporte-notas-retrasadas.component';

describe('ReporteNotasRetrasadasComponent', () => {
  let component: ReporteNotasRetrasadasComponent;
  let fixture: ComponentFixture<ReporteNotasRetrasadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteNotasRetrasadasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteNotasRetrasadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
