import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleLoginComponent } from './simple-login.component';

describe('SimpleLoginComponent', () => {
  let component: SimpleLoginComponent;
  let fixture: ComponentFixture<SimpleLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimpleLoginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimpleLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
