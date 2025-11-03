import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenueReportingComponent } from './revenue-reporting.component';

describe('RevenueReportingComponent', () => {
  let component: RevenueReportingComponent;
  let fixture: ComponentFixture<RevenueReportingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RevenueReportingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RevenueReportingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});