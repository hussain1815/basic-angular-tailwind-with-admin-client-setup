import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddStaffDialogComponent } from '../add-staff-dialog/add-staff-dialog.component';
import { AddDoctorService } from '../../../../services/add-doctor.service';
import { ExportService } from '../../../../services/export.service';
import { ConfirmationDialogComponent } from '../../../../components/confirmation-dialog/confirmation-dialog.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-staff-management',
  standalone: true,
  imports: [CommonModule, AddStaffDialogComponent, ConfirmationDialogComponent, FormsModule],
  templateUrl: './staff-management.component.html',
  styleUrls: ['./staff-management.component.scss']
})
export class StaffManagementComponent implements OnInit {

  showAddStaffDialog = false;
  isLoadingStaff = false;
  staffList: any[] = [];
  filteredDoctors: any = []
  editMode = false;
  selectedStaff: any = null;
  totaldoc: any;
  // NEW: Add delete confirmation properties
  showDeleteDialog = false;
  staffToDelete: any = null;
  searchTerm: string = '';
  constructor(
    private doctorService: AddDoctorService,
    private exportService: ExportService
  ) { }


  ngOnInit(): void {
    this.getstaff()
  }

  getstaff() {
    this.isLoadingStaff = true;
    this.doctorService.getallDoctors().subscribe({
      next: (resp) => {
        const doctors = resp as any[];
        this.totaldoc = doctors.length;
        // console.log('✅ Staff data received:', this.totaldoc);
        this.staffList = doctors.map(doctor => ({
          id: doctor.id,
          firstName: doctor.first_name,
          lastName: doctor.last_name,
          email: doctor.email,
          role: 'Doctor',
          department: this.capitalizeFirst(doctor.department),
          avatar: doctor.first_name.charAt(0).toUpperCase() + doctor.last_name.charAt(0).toUpperCase(),
          specialization: this.capitalizeFirst(doctor.specialization.replace('_', ' ')),
          availability: this.capitalizeFirst(doctor.availability.replace('_', ' ')),
          consultationFee: parseFloat(doctor.fee),
          degree: doctor.degree,
          mobile: doctor.mobile,
          joiningDate: doctor.joining_date,
          clinicName: doctor.clinic_name,
          monthlySalary: doctor.monthly_salary || 0,
        user_role: doctor.user_role
        }));

        this.filteredDoctors = this.staffList;
        this.isLoadingStaff = false;
        this.getDocLength()
      },
      error: (error) => {
        //consolele.error('❌ Error loading staff:', error);
        this.isLoadingStaff = false;
      }
    });

  }

  getDocLength() {
    let totalStaf=this.filteredDoctors
    let doclength=totalStaf.filter((item:any)=>item.includes('Doctor'))
    // console.log('this is doc length',doclength)

  }

  openAddStaffDialog(): void {
    // Reset to add mode
    this.editMode = false;
    this.selectedStaff = null;
    this.showAddStaffDialog = true;
  }

  editStaff(staff: any): void {
    this.editMode = true;
    this.selectedStaff = staff;
    this.showAddStaffDialog = true;
  }

  onDialogClose(): void {
    this.showAddStaffDialog = false;
    this.editMode = false;
    this.selectedStaff = null;
  }

  onStaffSave(apiPayload: any): void {

    if (this.editMode && apiPayload.id) {

      const { id, ...updatePayload } = apiPayload;

      this.doctorService.updateDoctor(id, updatePayload).subscribe({
        next: (response: any) => {

          this.getstaff();

          this.showAddStaffDialog = false;

        },
        error: (error) => {
          alert('Error updating doctor. Please try again.');
        }
      });
    } else {

      this.doctorService.addDoctor(apiPayload).subscribe({
        next: (response: any) => {
          //consolele.log('✅ Doctor added successfully:', response);

          this.getstaff();

          this.showAddStaffDialog = false;

          //consolele.log('✅ Staff list refreshed after adding new doctor');
        },
        error: (error) => {
          //consolele.error('❌ Error adding doctor:', error);
          alert('Error adding doctor. Please try again.');
        }
      });
    }
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // NEW: Delete functionality methods
  deleteStaff(staff: any): void {
    // console.log('🗑️ Opening delete confirmation for staff:', staff);
    this.staffToDelete = staff;
    this.showDeleteDialog = true;
  }

  onDeleteConfirm(): void {
    if (!this.staffToDelete) return;

    // console.log('🗑️ Deleting staff member with ID:', this.staffToDelete.id);

    this.doctorService.deleteDoctor(this.staffToDelete.id).subscribe({
      next: (response: any) => {
        // console.log('✅ Doctor deleted successfully:', response);

        // Refresh the staff list to remove the deleted item
        this.getstaff();

        // Close the dialog and reset
        this.showDeleteDialog = false;
        this.staffToDelete = null;

        // console.log('✅ Staff list refreshed after deletion');
      },
      error: (error) => {
        console.error('❌ Error deleting doctor:', error);
        alert('Error deleting doctor. Please try again.');

        // Close dialog even on error
        this.showDeleteDialog = false;
        this.staffToDelete = null;
      }
    });
  }

  onDeleteCancel(): void {
    // console.log('❌ Delete cancelled');
    this.showDeleteDialog = false;
    this.staffToDelete = null;
  }

  onSearch() {
    this.applyfilter()
  }

  applyfilter() {
    let filtered = [...this.staffList]
    if (this.searchTerm) {
      let searchLower = this.searchTerm.toLowerCase().trim();
      let newData = filtered.filter(doc => doc.firstName.toLowerCase().includes(searchLower) ||
        doc.lastName.toLowerCase().includes(searchLower) || doc.email.toLowerCase().includes(searchLower)
      )
      this.filteredDoctors = newData;
    }
  }

  // Export functionality
  exportStaff(): void {
    const dataToExport = this.filteredDoctors.length > 0 ? this.filteredDoctors : this.staffList;
    
    if (!dataToExport || dataToExport.length === 0) {
      alert('No staff data available to export');
      return;
    }

    // Generate filename with current date
    const currentDate = new Date().toISOString().split('T')[0];
    const filename = `doctors_report_${currentDate}`;
    
    // Export excluding actions and internal fields
    this.exportService.exportToCSV(dataToExport, filename, ['actions', 'id', 'avatar']);
  }

}