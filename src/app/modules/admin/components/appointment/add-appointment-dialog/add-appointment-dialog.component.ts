import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AddDoctorService } from '../../../../../services/add-doctor.service';

@Component({
  selector: 'app-add-appointment-dialog',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-appointment-dialog.component.html',
  styleUrl: './add-appointment-dialog.component.scss'
})
export class AddAppointmentDialogComponent implements OnInit, OnChanges {
  @Input() isVisible = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<any>();
  @Input() editMode = false;
  @Input() viewMode = false;
  @Input() appointmentData: any = null;

  appointmentForm: FormGroup;

  doctors: any[] = [];
  isBulkMode = false; // Toggle between single and bulk appointment
  isBulkAppointment = false; // Whether the current appointment is part of a bulk series
  originalSessionType = ''; // Store original session type for bulk appointments

  paymentStatuses = [
    { value: 'pending', label: 'Pending' },
    { value: 'paid', label: 'Paid' },
    // { value: 'partial', label: 'Partial' },
    // { value: 'cancelled', label: 'Cancelled' }
  ];

  paymentMethods = [
    { value: 'cash', label: 'Cash' },
    { value: 'card', label: 'Credit/Debit Card' },
    // { value: 'insurance', label: 'Insurance' },
    // { value: 'online', label: 'Online Payment' }
  ];

  appointmentStatuses = [
    { value: 'scheduled', label: 'Scheduled' },
    // { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'no-show', label: 'No Show' }
  ];

  patientTypes = [
    { value: 'new', label: 'New Patient' },
    // { value: 'existing', label: 'Existing Patient' },
    { value: 'follow-up', label: 'Follow-up' }
  ];

  sessionTypes = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' }
  ];

  constructor(
    private fb: FormBuilder, 
    private doctorService: AddDoctorService,
    private cdr: ChangeDetectorRef
  ) {
    this.appointmentForm = this.fb.group({
      doctor: ['', Validators.required],
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s\-\(\)]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      date: ['', Validators.required],
      time: ['', Validators.required],
      fee: ['', [Validators.required, Validators.min(0), Validators.pattern(/^[0-9]+$/)]],
      payment_status: ['', Validators.required],
      payment_method: ['', Validators.required],
      appointment_status: ['scheduled', Validators.required], // Default to 'scheduled' for new appointments
      patient_type: ['', Validators.required],
      notes: [''],
      // Bulk appointment fields
      session_count: [''],
      session_type: ['']
    });
  }

  onCancel(): void {
    this.resetForm();
    this.onClose.emit();
  }

  resetForm(): void {
    // Reset form but preserve default values
    this.appointmentForm.reset({
      doctor: '',
      first_name: '',
      last_name: '',
      phone: '',
      email: '',
      date: '',
      time: '',
      fee: '',
      payment_status: '',
      payment_method: '',
      appointment_status: 'scheduled', // Keep default value
      patient_type: '',
      notes: '',
      session_count: '',
      session_type: ''
    });
    
    this.appointmentForm.enable();
    this.isBulkMode = false;
    this.isBulkAppointment = false;
    this.originalSessionType = '';
  }

  ngOnInit(): void {
    this.getDoctorsList();
    // console.log('AddAppointmentDialog initialized');
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log('=== NG ON CHANGES TRIGGERED ===');
    // console.log('Changes:', changes);
    // console.log('Current state:');
    // console.log('  - isVisible:', this.isVisible);
    // console.log('  - editMode:', this.editMode);
    // console.log('  - viewMode:', this.viewMode);
    // console.log('  - appointmentData:', this.appointmentData);
    
    // Check all possible triggers
    const isVisibleChanged = changes['isVisible'];
    const appointmentDataChanged = changes['appointmentData'];
    const editModeChanged = changes['editMode'];
    const viewModeChanged = changes['viewMode'];
    
    // console.log('Change flags:');
    // console.log('  - isVisibleChanged:', !!isVisibleChanged);
    // console.log('  - appointmentDataChanged:', !!appointmentDataChanged);
    // console.log('  - editModeChanged:', !!editModeChanged);
    // console.log('  - viewModeChanged:', !!viewModeChanged);
    
    // Handle when dialog becomes visible
    if (isVisibleChanged && this.isVisible) {
      if (this.appointmentData && (this.editMode || this.viewMode)) {
        // Edit or view mode - populate form with existing data
        this.appointmentForm.enable();
        setTimeout(() => {
          this.populateForm();
          setTimeout(() => {
            this.handleFormState();
          }, 50);
        }, 150);
      } else {
        // Add mode - ensure form is enabled and has default values
        this.appointmentForm.enable();
        this.isBulkMode = false;
        this.isBulkAppointment = false;
        this.originalSessionType = '';
        
        // Only reset if form has been used before (has values other than defaults)
        const currentStatus = this.appointmentForm.get('appointment_status')?.value;
        if (currentStatus && currentStatus !== 'scheduled') {
          this.resetForm();
        }
      }
    }
    
    // Handle when appointment data changes
    if (appointmentDataChanged && this.appointmentData && this.isVisible) {
      // console.log('>>> Appointment data changed while dialog is visible');
      this.appointmentForm.enable();
      
      setTimeout(() => {
        // console.log('>>> Executing appointment data change population');
        this.populateForm();
        setTimeout(() => {
          this.handleFormState();
        }, 50);
      }, 150);
    }
    
    // Handle mode changes
    if ((editModeChanged || viewModeChanged) && this.isVisible) {
      // console.log('>>> Mode changed while dialog is visible');
      this.appointmentForm.enable();
      
      setTimeout(() => {
        if (this.appointmentData) {
          // console.log('>>> Executing mode change population');
          this.populateForm();
        }
        setTimeout(() => {
          this.handleFormState();
        }, 50);
      }, 150);
    }
    
    // console.log('=== NG ON CHANGES COMPLETED ===');
  }

  handleFormState(): void {
    if (this.viewMode) {
      // console.log('Disabling form for view mode');
      this.appointmentForm.disable();
    } else {
      // console.log('Enabling form for edit/add mode');
      this.appointmentForm.enable();
    }
    
    // Debug form state
    // console.log('Form enabled status:', this.appointmentForm.enabled);
    // console.log('Form disabled status:', this.appointmentForm.disabled);
    // console.log('Current form values:', this.appointmentForm.value);
    
    // Force another change detection
    this.cdr.detectChanges();
  }

  populateForm(): void {
    if (!this.appointmentData) {
      return;
    }

    // Check if this is a bulk appointment
    this.isBulkAppointment = this.appointmentData.appointment_type === 'multiple';
    
    // If editing a bulk appointment, set bulk mode and store original session type
    if (this.editMode && this.isBulkAppointment) {
      this.isBulkMode = true; // Default to bulk mode for bulk appointments
      this.originalSessionType = this.appointmentData.session_type;
      
      // Set validators for bulk fields in edit mode (they'll be cleared if user toggles to single)
      this.appointmentForm.get('session_type')?.setValidators([Validators.required]);
      this.appointmentForm.get('session_type')?.updateValueAndValidity();
    }
    
    // Ensure form is enabled before setting values
    this.appointmentForm.enable();
    
    // Set each control individually to ensure proper binding
    try {
      this.appointmentForm.get('doctor')?.setValue(this.appointmentData.doctor);
      this.appointmentForm.get('first_name')?.setValue(this.appointmentData.first_name);
      this.appointmentForm.get('last_name')?.setValue(this.appointmentData.last_name);
      this.appointmentForm.get('phone')?.setValue(this.appointmentData.phone);
      this.appointmentForm.get('email')?.setValue(this.appointmentData.email);
      this.appointmentForm.get('date')?.setValue(this.appointmentData.date);
      this.appointmentForm.get('time')?.setValue(this.appointmentData.time);
      this.appointmentForm.get('fee')?.setValue(this.appointmentData.fee);
      this.appointmentForm.get('payment_status')?.setValue(this.appointmentData.payment_status);
      this.appointmentForm.get('payment_method')?.setValue(this.appointmentData.payment_method);
      this.appointmentForm.get('appointment_status')?.setValue(this.appointmentData.appointment_status);
      this.appointmentForm.get('patient_type')?.setValue(this.appointmentData.patient_type);
      this.appointmentForm.get('notes')?.setValue(this.appointmentData.notes || '');
      
      // Set bulk fields if it's a bulk appointment
      if (this.isBulkAppointment) {
        this.appointmentForm.get('session_type')?.setValue(this.appointmentData.session_type);
        // For session count, we don't have this info from single appointment, so leave empty
        this.appointmentForm.get('session_count')?.setValue('');
      }
      
      // Mark form as touched to ensure validation states are updated
      this.appointmentForm.markAllAsTouched();
      
      // Force change detection to update the UI
      this.cdr.detectChanges();
      
    } catch (error) {
      console.error('Error setting form values:', error);
    }
  }

  getDoctorsList(): void {
    this.doctorService.getallDoctors().subscribe((resp: any) => {
      // console.log('Doctors list:', resp);
      // Transform the API response to match dropdown format
      this.doctors = resp.map((doctor: any) => ({
        id: doctor.id,
        name: `${doctor.first_name} ${doctor.last_name} - ${doctor.specialization}`,
        fullData: doctor
      }));
    });
  }


  onSubmit(): void {
    if (this.viewMode) {
      this.onCancel();
      return;
    }

    if (this.appointmentForm.valid) {
      const payload = this.appointmentForm.value;
      
      // Add ID and section_id for edit mode
      if (this.editMode && this.appointmentData) {
        payload.id = this.appointmentData.id;
        if (this.appointmentData.section_id) {
          payload.section_id = this.appointmentData.section_id;
        }
      }

      // Ensure notes is empty string instead of null
      if (!payload.notes || payload.notes === null) {
        payload.notes = '';
      }

      // Clean up payload based on mode
      if (!this.isBulkMode) {
        // Remove bulk fields for single appointments
        delete payload.session_count;
        delete payload.session_type;
      } else {
        // For bulk appointments in add mode, ensure session fields are present
        if (!this.editMode) {
          if (!payload.session_count || !payload.session_type) {
            this.markBulkFieldsAsTouched();
            return;
          }
        } else {
          // For bulk appointments in edit mode, session_type is required but session_count is not
          if (!payload.session_type) {
            this.appointmentForm.get('session_type')?.markAsTouched();
            return;
          }
          // Remove session_count for edit mode as it's not needed
          delete payload.session_count;
        }
      }
      
      // Determine if this is a bulk operation
      const isBulkOperation = this.editMode ? this.isBulkMode : this.isBulkMode;
      
      this.onSave.emit({ 
        ...payload, 
        isBulk: isBulkOperation,
        updateAll: this.editMode && this.isBulkMode // Flag for bulk edit
      });
      
      this.resetForm();
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.appointmentForm.controls).forEach(key => {
        this.appointmentForm.get(key)?.markAsTouched();
      });
    }
  }

  markBulkFieldsAsTouched(): void {
    this.appointmentForm.get('session_count')?.markAsTouched();
    this.appointmentForm.get('session_type')?.markAsTouched();
  }

  toggleBulkMode(): void {
    this.isBulkMode = !this.isBulkMode;
    
    if (this.isBulkMode) {
      // Add validators for bulk fields (only session_count for add mode)
      if (!this.editMode) {
        this.appointmentForm.get('session_count')?.setValidators([Validators.required, Validators.min(1), Validators.max(50)]);
      }
      this.appointmentForm.get('session_type')?.setValidators([Validators.required]);
      
      // If editing a bulk appointment, restore the original session type
      if (this.editMode && this.isBulkAppointment && this.originalSessionType) {
        this.appointmentForm.get('session_type')?.setValue(this.originalSessionType);
      }
    } else {
      // Remove validators for bulk fields
      this.appointmentForm.get('session_count')?.clearValidators();
      this.appointmentForm.get('session_type')?.clearValidators();
      this.appointmentForm.get('session_count')?.setValue('');
      this.appointmentForm.get('session_type')?.setValue('');
    }
    
    this.appointmentForm.get('session_count')?.updateValueAndValidity();
    this.appointmentForm.get('session_type')?.updateValueAndValidity();
  }

  canToggleBulkMode(): boolean {
    // Allow toggling in add mode and edit mode for bulk appointments
    if (this.viewMode) return false;
    if (this.editMode) return this.isBulkAppointment; // Only allow toggle for bulk appointments in edit mode
    return true; // Allow toggle in add mode
  }

  getDialogTitle(): string {
    if (this.viewMode) {
      return this.isBulkAppointment ? 'View Bulk Appointment Details' : 'View Appointment Details';
    }
    if (this.editMode) {
      if (this.isBulkAppointment) {
        return this.isBulkMode ? 'Edit All Appointments in Series' : 'Edit Single Appointment';
      }
      return 'Edit Appointment';
    }
    return this.isBulkMode ? 'Add Bulk Appointments' : 'Add New Appointment';
  }

  getSubmitButtonText(): string {
    if (this.viewMode) return 'Close';
    if (this.editMode) {
      if (this.isBulkAppointment) {
        return this.isBulkMode ? 'Update All Appointments' : 'Update This Appointment';
      }
      return 'Update Appointment';
    }
    return this.isBulkMode ? 'Schedule Bulk Appointments' : 'Schedule Appointment';
  }

  onFeeInput(event: any): void {
    const input = event.target;
    let value = input.value;
    
    if (value.includes('.')) {
      value = value.split('.')[0];
      input.value = value;
      this.appointmentForm.get('fee')?.setValue(value ? parseInt(value) : '');
    }
    
    // Ensure only positive integers
    if (value && parseInt(value) < 0) {
      input.value = '';
      this.appointmentForm.get('fee')?.setValue('');
    }
  }

  getErrorMessage(fieldName: string): string {
    const field = this.appointmentForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${fieldName.replace('_', ' ')} is required`;
    }
    if (field?.hasError('email')) {
      return 'Please enter a valid email';
    }
    if (field?.hasError('minlength')) {
      return `${fieldName.replace('_', ' ')} must be at least ${field.errors?.['minlength'].requiredLength} characters`;
    }
    if (field?.hasError('pattern')) {
      if (fieldName === 'fee') {
        return 'Fee must be a whole number (no decimals)';
      }
      return 'Please enter a valid phone number';
    }
    if (field?.hasError('min')) {
      if (fieldName === 'session_count') {
        return 'Session count must be at least 1';
      }
      return 'Fee must be greater than or equal to 0';
    }
    if (field?.hasError('max')) {
      return 'Session count cannot exceed 50';
    }
    return '';
  }
}
