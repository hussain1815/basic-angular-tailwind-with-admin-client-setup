import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CllinicProfileService } from '../../../../services/cllinic-profile.service';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-settings.component.html',
  styleUrls: ['./admin-settings.component.scss']
})
export class AdminSettingsComponent implements OnInit {

  selectedFile: File | null = null;
  uploadError: string = '';
  imagePreview: string | null = null;
  readonly MAX_FILE_SIZE = 5 * 1024 * 1024;
  
  // Track form changes
  hasFormChanges: boolean = false;
  originalFormValue: any = null; 

  systemSettings = {
    maintenanceMode: false,
    autoBackup: true,
    emailNotifications: true,
    smsAlerts: false,
    dataRetention: 365
  };
  hospitalForm: FormGroup
  userPermissions = [
    { role: 'Admin', users: 3, permissions: ['Full Access'] },
    { role: 'Doctor', users: 42, permissions: ['Patient Records', 'Prescriptions', 'Reports'] },
    { role: 'Nurse', users: 128, permissions: ['Patient Records', 'Basic Reports'] },
    { role: 'Receptionist', users: 15, permissions: ['Appointments', 'Basic Info'] }
  ];

  constructor(private clicnicService: CllinicProfileService, private fb: FormBuilder) {
    this.hospitalForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9\-\+\s\(\)]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      description: [''],
      logo: [""]
    });
  }

  ngOnInit(): void {
    // Small delay to ensure everything is properly initialized
    setTimeout(() => {
      this.getClinic();
    }, 100);
    
    // Subscribe to form changes to track modifications
    this.hospitalForm.valueChanges.subscribe(() => {
      this.checkForChanges();
    });
  }

  getClinic(): void {
    this.clicnicService.getclinicprofile().subscribe({
      next: (resp: any) => {
        // console.log('✅ API Response:', resp);
        // console.log('Response type:', typeof resp);
        // console.log('Is array:', Array.isArray(resp));
        
        // Since the API returns an array, get the first clinic
        if (resp && resp.length > 0) {
          const clinic = resp[0];
          // console.log('📋 Clinic data:', clinic);
          
          // Populate the form with existing data
          const formData = {
            name: clinic.name || '',
            address: clinic.address || '',
            phone: clinic.phone || '',
            email: clinic.email || '',
            description: clinic.description || ''
          };
          
          // console.log('📝 Form data to patch:', formData);
          this.hospitalForm.patchValue(formData);
          
          // Store original form value for comparison
          this.originalFormValue = { ...formData };
          this.hasFormChanges = false;
          
          // Set existing logo as preview if available
          if (clinic.logo) {
            this.imagePreview = clinic.logo;
          }
        } else {
          // console.warn('⚠️ No clinic data found in response');
        }
      },
      error: (error) => {
        // console.error('❌ Error fetching clinic data:', error);
      }
    });
  }

  toggleSetting(setting: string): void {
    switch (setting) {
      case 'maintenanceMode':
        this.systemSettings.maintenanceMode = !this.systemSettings.maintenanceMode;
        break;
      case 'autoBackup':
        this.systemSettings.autoBackup = !this.systemSettings.autoBackup;
        break;
      case 'emailNotifications':
        this.systemSettings.emailNotifications = !this.systemSettings.emailNotifications;
        break;
      case 'smsAlerts':
        this.systemSettings.smsAlerts = !this.systemSettings.smsAlerts;
        break;
    }
  }

  // Check if form has changes compared to original values
  checkForChanges(): void {
    if (!this.originalFormValue) return;
    
    const currentValue = this.hospitalForm.value;
    this.hasFormChanges = JSON.stringify(currentValue) !== JSON.stringify(this.originalFormValue) || this.selectedFile !== null;
  }

  // Simple file upload
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    this.uploadError = '';
    this.imagePreview = null;

    if (!file) return;

    // Check file size (5MB limit)
    if (file.size > this.MAX_FILE_SIZE) {
      this.uploadError = 'File too large. Max 5MB allowed.';
      return;
    }

    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      this.uploadError = 'Please select an image file.';
      return;
    }

    this.selectedFile = file;

    // Create image preview and store in hospitalInfo
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePreview = e.target.result;
      this.hospitalForm.patchValue({ logo: e.target.result }); // Store the base64 image in the FormGroup
      this.checkForChanges(); // Check for changes when file is selected
    };
    reader.readAsDataURL(file);

    // Immediately check for changes when file is selected
    this.checkForChanges();
  }

  // Save all hospital information including logo
  saveHospitalInfo(): void {
    if (this.hospitalForm.invalid) {
      this.hospitalForm.markAllAsTouched();
      return;
    }

    const formValue = this.hospitalForm.value;
    const formData = new FormData();

    formData.append('name', formValue.name);
    formData.append('address', formValue.address);
    formData.append('phone', formValue.phone);
    formData.append('email', formValue.email);
    formData.append('description', formValue.description);

    // Append file if selected, otherwise skip
    if (this.selectedFile) {
      formData.append('logo', this.selectedFile, this.selectedFile.name);
    }

    // console.log('Submitting FormData:', formData);

    this.clicnicService.postClinicProfile(formData).subscribe({
      next: (resp) => {
        // console.log('✅ Hospital info saved successfully.', resp);
        
        // Reset change tracking after successful save
        this.originalFormValue = { ...this.hospitalForm.value };
        this.selectedFile = null;
        this.hasFormChanges = false;
        
        // Refresh the data to get updated info
        this.getClinic();
      },
      error: (err) => {
        // console.error('❌ Error saving hospital info:', err);
      }
    });
  }

  // Reset form to original values
  resetForm(): void {
    if (this.originalFormValue) {
      this.hospitalForm.patchValue(this.originalFormValue);
      this.selectedFile = null;
      this.hasFormChanges = false;
      
      // Reset image preview to original
      this.getClinic();
    }
  }

  // Helper method to format file size
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

}