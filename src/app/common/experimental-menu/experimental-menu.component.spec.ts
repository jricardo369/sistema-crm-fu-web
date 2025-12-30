import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperimentalMenuComponent } from './experimental-menu.component';

describe('ExperimentalMenuComponent', () => {
  let component: ExperimentalMenuComponent;
  let fixture: ComponentFixture<ExperimentalMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExperimentalMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperimentalMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
