import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceNavComponent } from './workspace-nav.component';

describe('WorkspaceNavComponent', () => {
  let component: WorkspaceNavComponent;
  let fixture: ComponentFixture<WorkspaceNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkspaceNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkspaceNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
