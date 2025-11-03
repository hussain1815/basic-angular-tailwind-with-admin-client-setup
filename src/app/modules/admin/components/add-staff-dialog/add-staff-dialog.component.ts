import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AddDoctorService } from '../../../../services/add-doctor.service';

export interface StaffData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  employeeId: string;
  dateOfJoining: string;
  specialization?: string;
  availability?: string;
  consultationFee?: number;
  degree?: string;
}

@Component({
  selector: 'app-add-staff-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-staff-dialog.component.html',
  styleUrls: ['./add-staff-dialog.component.scss']
})
export class AddStaffDialogComponent implements OnChanges {
  @Input() isVisible = false;
  @Input() editMode = false;
  @Input() staffData: any = null;
  @Input() isDoctorManagement = false; // New input to distinguish context
  @Output() onClose = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<any>();

  staffForm: FormGroup;
  
  // NEW: Add these properties to track changes
  originalFormData: any = null;  // Store original data
  hasChanges = false;            // Track if form has changes

  // Password visibility and strength
  showPassword = false;
  showPasswordConfirm = false;
  passwordStrength = {
    minLength: false,
    hasNumber: false,
    hasLowercase: false,
    hasSpecialChar: false
  };
  showPasswordRequirements = false;

  roles = [
    { value: 'doctor', label: 'Doctor' },
    { value: 'receptionist', label: 'Receptionist' },
    { value: 'staff', label: 'Staff' }
  ];

  departments = [
    { value: 'cardiology', label: 'Cardiology' },
    { value: 'emergency', label: 'Emergency' },
    { value: 'surgery', label: 'Surgery' },
    { value: 'pediatrics', label: 'Pediatrics' },
    { value: 'radiology', label: 'Radiology' },
    { value: 'administration', label: 'Administration' }
  ];

  specializations = [
    { value: 'general_medicine', label: 'General Medicine' },
    { value: 'cardiology', label: 'Cardiology' },
    { value: 'neurology', label: 'Neurology' },
    { value: 'orthopedics', label: 'Orthopedics' },
    { value: 'pediatrics', label: 'Pediatrics' },
    { value: 'dermatology', label: 'Dermatology' },
    { value: 'psychiatry', label: 'Psychiatry' },
    { value: 'radiology', label: 'Radiology' },
    { value: 'surgery', label: 'Surgery' },
    { value: 'emergency_medicine', label: 'Emergency Medicine' }
  ];

  availabilityOptions = [
    { value: 'full_time', label: 'Full Time (Mon-Fri)' },
    { value: 'part_time', label: 'Part Time' },
    { value: 'weekdays_only', label: 'Weekdays Only' },
    { value: 'weekends_only', label: 'Weekends Only' },
    { value: 'on_call', label: 'On Call' },
    { value: 'flexible', label: 'Flexible Schedule' }
  ];

  constructor(private fb: FormBuilder) {
    this.staffForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s\-\(\)]+$/)]],
      role: ['', Validators.required],
      department: [''],
      dateOfJoining: ['', Validators.required],
      // Doctor fields
      specialization: [''],
      availability: [''],
      consultationFee: [''],
      degree: [''],
      // Employee fields
      userDetails: [''],
      monthlySalary: [''],
      // Receptionist fields
      password: [''],
      passwordConfirm: ['']
    });
    this.staffForm.get('role')?.valueChanges.subscribe(role => {
      this.updateFieldValidators(role);
    });

    // NEW: Watch for form changes to detect modifications
    this.staffForm.valueChanges.subscribe(() => {
      this.checkForChanges();
    });

    // Watch password changes for strength validation
    this.staffForm.get('password')?.valueChanges.subscribe(password => {
      this.checkPasswordStrength(password || '');
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    // Handle doctor management context
    if (changes['isDoctorManagement'] && this.isDoctorManagement) {
      // Set role to doctor and make it read-only
      this.staffForm.patchValue({ role: 'doctor' });
      this.updateFieldValidators('doctor');
    }
    
    if (changes['staffData'] && this.staffData && this.editMode) {
      //console.log('📝 Edit mode activated, populating form with:', this.staffData);
      this.populateForm();
    }
    
    // Handle when dialog becomes visible
    if (changes['isVisible'] && this.isVisible && !this.editMode) {
      if (this.isDoctorManagement) {
        // For doctor management, always set role to doctor
        this.staffForm.patchValue({ role: 'doctor' });
        this.updateFieldValidators('doctor');
      } else {
        // For employee management, reset role
        this.staffForm.patchValue({ role: '' });
      }
    }
  }
  populateForm(): void {
    if (!this.staffData) return;

    // console.log('📝 Populating form with staff data:', this.staffData);
    // console.log('📝 Available properties:', Object.keys(this.staffData));

    let formData: any = {};

    // Handle the new unified API response structure
    // Extract first name and last name
    let firstName = '';
    let lastName = '';
    
    if (this.staffData.first_name && this.staffData.last_name) {
      firstName = this.staffData.first_name;
      lastName = this.staffData.last_name;
    } else if (this.staffData.full_name) {
      const names = this.staffData.full_name.split(' ');
      firstName = names[0] || '';
      lastName = names.slice(1).join(' ') || '';
    }

    // Determine role based on user_role or type
    let role = 'staff'; // default
    if (this.staffData.user_role) {
      if (this.staffData.user_role.toLowerCase() === 'doctor') {
        role = 'doctor';
      } else if (this.staffData.user_role.toLowerCase() === 'receptionist') {
        role = 'receptionist';
      } else {
        role = 'staff';
      }
    } else if (this.staffData.type === 'doctor') {
      role = 'doctor';
    }

    // Base form data that applies to all roles
    formData = {
      firstName: firstName,
      lastName: lastName,
      email: this.staffData.email || '',
      phone: this.staffData.mobile || '',
      role: role,
      dateOfJoining: this.staffData.joining_date || '',
      monthlySalary: this.staffData.monthly_salary || '',
      password: '',
      passwordConfirm: ''
    };

    // Role-specific fields
    if (role === 'doctor') {
      formData = {
        ...formData,
        department: this.staffData.department || '',
        specialization: this.staffData.specialization || '',
        availability: this.staffData.availability || '',
        consultationFee: this.staffData.fee || 0,
        degree: this.staffData.degree || '',
        userDetails: ''
      };
    } else {
      // Staff or Receptionist
      formData = {
        ...formData,
        department: '',
        specialization: '',
        availability: '',
        consultationFee: '',
        degree: '',
        userDetails: this.staffData.user_details || ''
      };
    }

    // console.log('📝 Form data to populate:', formData);
    this.staffForm.patchValue(formData);
    
    // Store original data for comparison
    this.originalFormData = { ...formData };
    this.hasChanges = false; // Reset changes flag
    
    // console.log('✅ Form populated and original data stored');
  }

  // NEW: Method to check if form has changes
  checkForChanges(): void {
    if (!this.editMode || !this.originalFormData) {
      this.hasChanges = false;
      return;
    }

    const currentFormData = this.staffForm.value;
    
    // Compare each field
    this.hasChanges = Object.keys(this.originalFormData).some(key => {
      const original = this.originalFormData[key];
      const current = currentFormData[key];
      
      // Handle different data types
      if (typeof original === 'number' && typeof current === 'string') {
        return original !== parseFloat(current);
      }
      
      return original !== current;
    });

    //console.log('🔍 Form changes detected:', this.hasChanges);
  }

  // NEW: Method to check if button should be enabled
  isSubmitButtonEnabled(): boolean {
    if (!this.editMode) {
      // Add mode: button enabled if form is valid
      return this.staffForm.valid;
    } else {
      // Edit mode: button enabled if form is valid AND has changes
      return this.staffForm.valid && this.hasChanges;
    }
  }

  updateFieldValidators(role: string): void {
    // Doctor fields
    const departmentControl = this.staffForm.get('department');
    const specializationControl = this.staffForm.get('specialization');
    const availabilityControl = this.staffForm.get('availability');
    const feeControl = this.staffForm.get('consultationFee');
    const degreeControl = this.staffForm.get('degree');
    
    // Employee fields
    const userDetailsControl = this.staffForm.get('userDetails');
    const monthlySalaryControl = this.staffForm.get('monthlySalary');
    
    // Receptionist fields
    const passwordControl = this.staffForm.get('password');
    const passwordConfirmControl = this.staffForm.get('passwordConfirm');

    // Clear all validators first
    [departmentControl, specializationControl, availabilityControl, feeControl, degreeControl, 
     userDetailsControl, monthlySalaryControl, passwordControl, passwordConfirmControl]
      .forEach(control => control?.clearValidators());

    if (role === 'doctor') {
      // Doctor required fields
      departmentControl?.setValidators([Validators.required]);
      specializationControl?.setValidators([Validators.required]);
      availabilityControl?.setValidators([Validators.required]);
      feeControl?.setValidators([Validators.required, Validators.min(1)]);
      degreeControl?.setValidators([Validators.required]);
      monthlySalaryControl?.setValidators([Validators.required, Validators.min(1)]);
      
      // Clear employee/receptionist fields
      userDetailsControl?.setValue('');
      passwordControl?.setValue('');
      passwordConfirmControl?.setValue('');
      
    } else if (role === 'staff') {
      // Staff required fields
      userDetailsControl?.setValidators([Validators.required]);
      monthlySalaryControl?.setValidators([Validators.required, Validators.min(1)]);
      
      // Clear doctor fields
      departmentControl?.setValue('');
      specializationControl?.setValue('');
      availabilityControl?.setValue('');
      feeControl?.setValue('');
      degreeControl?.setValue('');
      passwordControl?.setValue('');
      passwordConfirmControl?.setValue('');
      
    } else if (role === 'receptionist') {
      // Receptionist required fields
      userDetailsControl?.setValidators([Validators.required]);
      monthlySalaryControl?.setValidators([Validators.required, Validators.min(1)]);
      passwordControl?.setValidators([
        Validators.required, 
        Validators.minLength(8),
        this.passwordStrengthValidator.bind(this)
      ]);
      passwordConfirmControl?.setValidators([Validators.required]);
      
      // Clear doctor fields
      departmentControl?.setValue('');
      specializationControl?.setValue('');
      availabilityControl?.setValue('');
      feeControl?.setValue('');
      degreeControl?.setValue('');
    }

    // Update validity for all controls
    [departmentControl, specializationControl, availabilityControl, feeControl, degreeControl, 
     userDetailsControl, monthlySalaryControl, passwordControl, passwordConfirmControl]
      .forEach(control => control?.updateValueAndValidity());
  }

  isDoctor(): boolean {
    return this.staffForm.get('role')?.value === 'doctor';
  }

  isStaff(): boolean {
    return this.staffForm.get('role')?.value === 'staff';
  }

  isReceptionist(): boolean {
    return this.staffForm.get('role')?.value === 'receptionist';
  }

  isRoleReadOnly(): boolean {
    return this.isDoctorManagement;
  }

  // Custom validator for password confirmation
  passwordMatchValidator(): boolean {
    const password = this.staffForm.get('password')?.value;
    const confirmPassword = this.staffForm.get('passwordConfirm')?.value;
    return password === confirmPassword;
  }

  // Toggle password visibility
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  togglePasswordConfirmVisibility(): void {
    this.showPasswordConfirm = !this.showPasswordConfirm;
  }

  // Check password strength
  checkPasswordStrength(password: string): void {
    this.passwordStrength = {
      minLength: password.length >= 8,
      hasNumber: /\d/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };
  }

  // Check if password meets all requirements
  isPasswordStrong(): boolean {
    return Object.values(this.passwordStrength).every(requirement => requirement);
  }

  // Calculate password strength percentage
  getPasswordStrengthPercentage(): number {
    const metRequirements = Object.values(this.passwordStrength).filter(req => req).length;
    return (metRequirements / 4) * 100;
  }

  // Show password requirements when field is focused
  onPasswordFocus(): void {
    this.showPasswordRequirements = true;
  }

  // Hide password requirements when field loses focus (with delay)
  onPasswordBlur(): void {
    setTimeout(() => {
      this.showPasswordRequirements = false;
    }, 200);
  }

  // Custom password strength validator
  passwordStrengthValidator(control: any) {
    const password = control.value;
    if (!password) return null;

    const hasMinLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    const isValid = hasMinLength && hasNumber && hasLowercase && hasSpecialChar;
    
    return isValid ? null : { passwordStrength: true };
  }

  onCancel(): void {
    this.staffForm.reset();
    this.onClose.emit();
  }

  onSubmit(): void {
    // Only proceed if button should be enabled
    if (!this.isSubmitButtonEnabled()) {
      return;
    }

    // Check password requirements for receptionist
    if (this.isReceptionist()) {
      if (!this.passwordMatchValidator()) {
        alert('Passwords do not match!');
        return;
      }
      if (!this.isPasswordStrong()) {
        alert('Password does not meet strength requirements!');
        return;
      }
    }

    if (this.staffForm.valid) {
      const formValue = this.staffForm.value;
      let apiPayload: any = {
        first_name: formValue.firstName,
        last_name: formValue.lastName,
        email: formValue.email
      };

      if (formValue.role === 'doctor') {
        // Doctor payload
        apiPayload = {
          ...apiPayload,
          department: formValue.department,
          specialization: formValue.specialization,
          degree: formValue.degree,
          mobile: formValue.phone,
          fee: formValue.consultationFee,
          availability: formValue.availability,
          monthly_salary: formValue.monthlySalary
        };
      } else if (formValue.role === 'staff') {
        // Staff payload
        apiPayload = {
          ...apiPayload,
          user_role: 'Staff',
          user_details: formValue.userDetails,
          monthly_salary: formValue.monthlySalary,
          mobile: formValue.phone,
          joining_date: formValue.dateOfJoining
        };
      } else if (formValue.role === 'receptionist') {
        // Receptionist payload
        apiPayload = {
          ...apiPayload,
          user_role: 'Receptionist',
          user_details: formValue.userDetails,
          monthly_salary: formValue.monthlySalary,
          mobile: formValue.phone,
          joining_date: formValue.dateOfJoining,
          password: formValue.password,
          password_confirm: formValue.passwordConfirm
        };
      }

      if (this.editMode && this.staffData) {
        apiPayload.id = this.staffData.id;
      }

      // console.log('📤 Sending API payload:', apiPayload);
      this.onSave.emit(apiPayload);

    } else {
      Object.keys(this.staffForm.controls).forEach(key => {
        this.staffForm.get(key)?.markAsTouched();
      });
    }
  }

  getErrorMessage(fieldName: string): string {
    const field = this.staffForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${fieldName} is required`;
    }
    if (field?.hasError('email')) {
      return 'Please enter a valid email';
    }
    if (field?.hasError('minlength')) {
      return `${fieldName} must be at least ${field.errors?.['minlength'].requiredLength} characters`;
    }
    if (field?.hasError('pattern')) {
      return 'Please enter a valid phone number';
    }
    if (field?.hasError('min')) {
      return `${fieldName} must be greater than 0`;
    }
    return '';
  }
}