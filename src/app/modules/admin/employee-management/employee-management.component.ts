import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddStaffDialogComponent } from '../components/add-staff-dialog/add-staff-dialog.component';
import { StaffService } from '../../../services/staff.service';
import { ExportService } from '../../../services/export.service';
import { ConfirmationDialogComponent } from "../../../components/confirmation-dialog/confirmation-dialog.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee-management',
  standalone: true,
  imports: [CommonModule, AddStaffDialogComponent, ConfirmationDialogComponent,FormsModule],
  templateUrl: './employee-management.component.html',
  styleUrl: './employee-management.component.scss'
})
export class EmployeeManagementComponent implements OnInit {

  showAddEmployeeDialog = false;
  isLoadingEmployees = false;
  employeeList: any[] = [];
  filteredEmployees:any=[]
  editMode = false;
  selectedEmployee: any = null;
  searchTerm: string = '';
  totalEmployees: any = 0;
  staffdata:any
  // Delete confirmation properties
  showDeleteDialog = false;
  employeeToDelete: any = null;

  constructor(
    private staffService: StaffService,
    private exportService: ExportService
  ) { }

  ngOnInit(): void {
    this.getEmployees();
  }
  getEmployees() {
    this.isLoadingEmployees = true;
    this.staffService.getStaff().subscribe({
      next: (resp: any) => {
        // console.log('✅ Staff data received:', resp);
        this.staffdata = resp;
        this.filteredEmployees=resp
        this.totalEmployees = resp.length;
        this.isLoadingEmployees = false;
        this.getDoctorLen()
        this.getStaffLen()
        this.getrecieptionistLen()
      },
      error: (error) => {
        // console.error('❌ Error loading staff:', error);
        this.isLoadingEmployees = false;
      }
    });

  }

  getDoctorLen(){
    let staffData=[...this.filteredEmployees]
    let getdoc=staffData.filter(doc=>doc.user_role==='Doctor')
    // console.log('this is doc length',getdoc.length)
    return getdoc?.length||0
  }
  getStaffLen(){
    let staffData=[...this.filteredEmployees]
    let getStaff=staffData.filter(staf=>staf.user_role==='Staff')
    // console.log('this is doc length',getStaff.length)
    return getStaff?.length||0
  }
  getrecieptionistLen(){
    let staffData=[...this.filteredEmployees]
    let getReciption=staffData.filter(reciep=>reciep.user_role==='Receptionist')
    // console.log('this is doc length',getReciption.length)
    return getReciption?.length||0
  }


  openAddEmployeeDialog(): void {
    this.editMode = false;
    this.selectedEmployee = null;
    this.showAddEmployeeDialog = true;
  }

  editEmployee(employee: any): void {
    // console.log('Editing employee:', employee);
    this.editMode = true;
    this.selectedEmployee = employee;
    this.showAddEmployeeDialog = true;
  }

  onDialogClose(): void {
    this.showAddEmployeeDialog = false;
    this.editMode = false;
    this.selectedEmployee = null;
  }

  onEmployeeSave(apiPayload: any): void {
    // console.log('📤 Employee API payload received:', apiPayload);
    
    if (this.editMode && apiPayload.id) {
      // Update existing employee
      this.staffService.updateStaff(apiPayload.id, apiPayload).subscribe({
        next: (resp) => {
          // console.log('✅ Employee updated successfully:', resp);
          this.getEmployees(); // Refresh the list
          this.showAddEmployeeDialog = false;
        },
        error: (error) => {
          // console.error('❌ Error updating employee:', error);
        }
      });
    } else {
      // Add new employee
      this.staffService.postStaff(apiPayload).subscribe({
        next: (resp) => {
          // console.log('✅ Employee added successfully:', resp);
          this.getEmployees(); // Refresh the list
          this.showAddEmployeeDialog = false;
        },
        error: (error) => {
          // console.error('❌ Error adding employee:', error);
        }
      });
    }
  }

  deleteEmployee(employee: any): void {
    this.employeeToDelete = employee;
    this.showDeleteDialog = true;
  }

  onDeleteConfirm(): void {
    if (!this.employeeToDelete) return;

    this.staffService.deleteStaff(this.employeeToDelete.id).subscribe({
      next: (resp) => {
        // console.log('✅ Employee deleted successfully:', resp);
        this.getEmployees(); // Refresh the list
        this.showDeleteDialog = false;
        this.employeeToDelete = null;
      },
      error: (error) => {
        // console.error('❌ Error deleting employee:', error);
        this.showDeleteDialog = false;
        this.employeeToDelete = null;
      }
    });
  }

  onDeleteCancel(): void {
    this.showDeleteDialog = false;
    this.employeeToDelete = null;
  }

  getAvatar(staff: any): string {
    if (staff.first_name && staff.last_name) {
      return staff.first_name.charAt(0).toUpperCase() + staff.last_name.charAt(0).toUpperCase();
    } else if (staff.full_name) {
      const names = staff.full_name.split(' ');
      return names.length > 1 
        ? names[0].charAt(0).toUpperCase() + names[names.length - 1].charAt(0).toUpperCase()
        : names[0].charAt(0).toUpperCase() + names[0].charAt(1)?.toUpperCase() || '';
    }
    return 'ST';
  }

  getDisplayName(staff: any): string {
    if (staff.first_name && staff.last_name) {
      return `${staff.first_name} ${staff.last_name}`;
    } else if (staff.full_name) {
      return staff.full_name;
    }
    return 'Unknown Staff';
  }


  onSearch(){
   this.applyfilter() 
  }

  applyfilter(){
    let filtered=[...this.staffdata]

    if(this.searchTerm){
      const searchLower = this.searchTerm.toLowerCase().trim();
      let newdata=filtered.filter(user=>`${user.first_name} ${user.last_name}`.toLowerCase().includes(searchLower)||
      user.email.toLowerCase().includes(searchLower)||user.user_role.toLowerCase().includes(searchLower)||user.user_details.toLowerCase().includes(searchLower)
    )
      this.filteredEmployees=newdata
    }
  }

  // Export functionality
  exportEmployees(): void {
    const dataToExport = this.filteredEmployees.length > 0 ? this.filteredEmployees : this.staffdata;
    
    if (!dataToExport || dataToExport.length === 0) {
      alert('No employee data available to export');
      return;
    }

    // Generate filename with current date
    const currentDate = new Date().toISOString().split('T')[0];
    const filename = `employees_report_${currentDate}`;
    
    // Export excluding actions and internal fields
    this.exportService.exportToCSV(dataToExport, filename, ['actions', 'id', 'profile_photo']);
  }
}
