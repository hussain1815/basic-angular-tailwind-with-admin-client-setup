import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationDialogComponent } from './confirmation-dialog.component';

describe('ConfirmationDialogComponent', () => {
  let component: ConfirmationDialogComponent;
  let fixture: ComponentFixture<ConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmationDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit onConfirm when confirm is called', () => {
    spyOn(component.onConfirm, 'emit');
    component.confirm();
    expect(component.onConfirm.emit).toHaveBeenCalled();
  });

  it('should emit onCancel when cancel is called', () => {
    spyOn(component.onCancel, 'emit');
    component.cancel();
    expect(component.onCancel.emit).toHaveBeenCalled();
  });

  it('should display custom title and message', () => {
    component.title = 'Delete User';
    component.message = 'Are you sure you want to delete this user?';
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Delete User');
    expect(compiled.textContent).toContain('Are you sure you want to delete this user?');
  });
});