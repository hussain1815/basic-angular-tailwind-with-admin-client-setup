import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorReportingComponent } from './doctor-reporting.component';

describe('DoctorReportingComponent', () => {
  let component: DoctorReportingComponent;
  let fixture: ComponentFixture<DoctorReportingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorReportingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DoctorReportingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});