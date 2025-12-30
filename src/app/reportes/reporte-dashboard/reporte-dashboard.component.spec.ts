import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteDashboardComponent } from './reporte-dashboard.component';

describe('ReporteDashboardComponent', () => {
  let component: ReporteDashboardComponent;
  let fixture: ComponentFixture<ReporteDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
