import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigIntegrationsComponent } from './config-integrations';

describe('ConfigIntegrations', () => {
  let component: ConfigIntegrationsComponent;
  let fixture: ComponentFixture<ConfigIntegrationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigIntegrationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfigIntegrationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
