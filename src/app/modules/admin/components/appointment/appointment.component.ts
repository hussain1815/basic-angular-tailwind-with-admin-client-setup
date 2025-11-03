import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentService } from '../../../../services/appointment.service';
import { ExportService } from '../../../../services/export.service';
import { AddAppointmentDialogComponent } from "./add-appointment-dialog/add-appointment-dialog.component";
import { CalendarViewComponent } from './calendar-view/calendar-view.component';
import { ConfirmationDialogComponent } from "../../../../components/confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [CommonModule, FormsModule, AddAppointmentDialogComponent, CalendarViewComponent, ConfirmationDialogComponent],
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss']
})
export class AppointmentComponent implements OnInit {

  // API data
  appointmentStats: any[] = [];
  recentAppointments: any[] = [];
  filteredAppointments: any[] = [];
  statistics: any = null;
  
  // Search functionality
  searchTerm: string = '';
  searchFilters = {
    status: '',
    doctor: '',
    patientType: '',
    dateFrom: '',
    dateTo: ''
  };
  
  // Dialog states
  addappointmentdialog = false;
  isCalendarVisible = false;
  dialogMode: 'add' | 'edit' | 'view' = 'add';
  selectedAppointment: any = null;
  isDeleteConfirmationVisible=false
  appointmentToDelete: any = null;
  constructor(
    private appointmentService: AppointmentService,
    private exportService: ExportService
  ) { }

  ngOnInit(): void {
    // Initialize appointment data
    this.loadAppointmentData();
    this.getAppointmentData()
  }

  loadAppointmentData(): void {
    // Here you can call appointment service to load data
    // console.log('Loading appointment data...',localStorage.getItem('user_role'));
  }

  getUserRole(){
    return localStorage.getItem('user_role');
  }

  getAppointmentData(){
    this.appointmentService.getAppointments().subscribe((resp: any) => {
      // console.log('Appointment API response:', resp);
      
      // Set appointments data
      this.recentAppointments = resp.data || [];
      this.filteredAppointments = [...this.recentAppointments]; // Initialize filtered list
      
      // Set statistics data
      this.statistics = resp.statistics || {};
      
      // Update stats cards with real data
      this.appointmentStats = [
        { 
          label: 'Total Appointments', 
          value: this.statistics.total_appointments || 0, 
          color: 'blue', 
          icon: 'calendar' 
        },
        { 
          label: 'Today\'s Appointments', 
          value: this.statistics.today_total_appointments || 0, 
          color: 'green', 
          icon: 'clock' 
        },
        { 
          label: 'Scheduled', 
          value: this.statistics.total_appointments_scheduled || 0, 
          color: 'yellow', 
          icon: 'hourglass' 
        },
        { 
          label: 'Today Completed', 
          value: this.statistics.today_appointments_completed || 0, 
          color: 'purple', 
          icon: 'check' 
        }
      ];
    });
  }

  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'confirmed': 'bg-green-100 text-green-800',
      'scheduled': 'bg-blue-100 text-blue-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-purple-100 text-purple-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return statusClasses[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  // Action methods
  addAppointment(): void {
    // console.log('Add new appointment');
    this.dialogMode = 'add';
    this.selectedAppointment = null;
    this.addappointmentdialog = true;
  }

  editAppointment(appointment: any): void {
    // console.log('=== EDIT APPOINTMENT CLICKED ===');
    // console.log('Appointment data:', appointment);
    
    this.dialogMode = 'edit';
    this.selectedAppointment = { ...appointment }; // Create a copy to avoid reference issues
    
    // console.log('After setting:');
    // console.log('  - dialogMode:', this.dialogMode);
    // console.log('  - selectedAppointment:', this.selectedAppointment);
    // console.log('  - dialogMode === "edit":', this.dialogMode === 'edit');
    // console.log('  - dialogMode === "view":', this.dialogMode === 'view');
    
    this.addappointmentdialog = true;
    // console.log('  - addappointmentdialog:', this.addappointmentdialog);
    // console.log('=== EDIT APPOINTMENT SETUP COMPLETE ===');
  }

  deleteAppointment(appointment: any): void {
    // console.log('Delete appointment:', appointment);
    this.appointmentToDelete = appointment;
    this.isDeleteConfirmationVisible = true;
  }

  viewAppointmentDetails(appointment: any): void {
    // console.log('=== VIEW APPOINTMENT CLICKED ===');
    // console.log('Appointment data:', appointment);
    
    this.dialogMode = 'view';
    this.selectedAppointment = { ...appointment }; // Create a copy to avoid reference issues
    
    // console.log('After setting:');
    // console.log('  - dialogMode:', this.dialogMode);
    // console.log('  - selectedAppointment:', this.selectedAppointment);
    // console.log('  - dialogMode === "edit":', this.dialogMode === 'edit');
    // console.log('  - dialogMode === "view":', this.dialogMode === 'view');
    
    this.addappointmentdialog = true;
    // console.log('  - addappointmentdialog:', this.addappointmentdialog);
    // console.log('=== VIEW APPOINTMENT SETUP COMPLETE ===');
  }

  oncloseAppointmentDialog(): void {
    // console.log('Closing appointment dialog');
    this.addappointmentdialog = false;
    this.dialogMode = 'add';
    this.selectedAppointment = null;
  }

  onSaveAppointmentDialog(data: any): void {
    // console.log('Dialog data received:', data);
    
    if (this.dialogMode === 'add') {
      if (data.isBulk) {
        // Handle bulk appointment creation
        // console.log('Creating bulk appointments:', data);
        this.appointmentService.addbulkappointments(data).subscribe({
          next: (resp) => {
            // console.log('Bulk appointments created response:', resp);
            this.getAppointmentData();
          },
          error: (error) => {
            console.error('Error creating bulk appointments:', error);
            // You can add user-friendly error handling here
          }
        });
      } else {
        // Handle single appointment creation
        // console.log('Adding single appointment:', data);
        this.appointmentService.addAppointment(data).subscribe({
          next: (resp) => {
            // console.log('Appointment added response:', resp);
            this.getAppointmentData();
          },
          error: (error) => {
            // console.error('Error creating appointment:', error);
            // You can add user-friendly error handling here
          }
        });
      }
    } else if (this.dialogMode === 'edit') {
      // Handle both single and bulk edit
      const updateAll = data.updateAll || false;
      // console.log('Updating appointment:', data, 'updateAll:', updateAll);
      
      this.appointmentService.editAppointment(data.id, data, updateAll).subscribe({
        next: (resp) => {
          // console.log('Appointment updated response:', resp);
          this.getAppointmentData();
        },
        error: (error) => {
          console.error('Error updating appointment:', error);
          // You can add user-friendly error handling here
        }
      });
    }
    
    this.addappointmentdialog = false;
    this.dialogMode = 'add';
    this.selectedAppointment = null;
  }

  // Calendar functionality
  viewCalendar(): void {
    this.isCalendarVisible = true;
  }

  onCloseCalendar(): void {
    this.isCalendarVisible = false;
  }

  onDateSelect(date: Date): void {
    // console.log('Selected date:', date);
    // You can add functionality here to filter appointments by selected date
    // or navigate to a specific date view
    const selectedDateString = date.toISOString().split('T')[0];
    const appointmentsForDate = this.recentAppointments.filter(
      appointment => appointment.date === selectedDateString
    );
    // console.log('Appointments for selected date:', appointmentsForDate);
  }

   onDeleteConfirm(): void {
    if(this.appointmentToDelete){
      // console.log('Deleting appointment:', this.appointmentToDelete);
      this.appointmentService.deleteAppointment(this.appointmentToDelete.id).subscribe({
        next: (resp) => {
          // console.log('Appointment deleted response:', resp);
          this.getAppointmentData();
        },
        error: (error) => {
          // console.error('Error deleting appointment:', error);
        }
      });
    }
    this.isDeleteConfirmationVisible = false;
    this.appointmentToDelete = null;
   }

   onDeleteCancel(){
    this.isDeleteConfirmationVisible = false;
    this.appointmentToDelete = null;
   }

   // Search functionality
   onSearch(): void {
     this.applyFilters();
   }

   onFilterChange(): void {
     this.applyFilters();
   }

   applyFilters(): void {
    // console.log('this is recent appointments',this.recentAppointments);
     let filtered = [...this.recentAppointments];
    //  console.log('this is ..................',...this.recentAppointments);
    //  console.log('this is ... filetered',filtered);

     // Apply text search
     if (this.searchTerm.trim()) {
       const searchLower = this.searchTerm.toLowerCase().trim();
       filtered = filtered.filter(appointment => 
         `${appointment.first_name} ${appointment.last_name}`.toLowerCase().includes(searchLower) ||
         appointment.doctor_name.toLowerCase().includes(searchLower) ||
         appointment.phone.toLowerCase().includes(searchLower) ||
         appointment.email.toLowerCase().includes(searchLower) ||
         appointment.appointment_status.toLowerCase().includes(searchLower) ||
         appointment.patient_type.toLowerCase().includes(searchLower)
       );
     }

     // Apply status filter
     if (this.searchFilters.status) {
       filtered = filtered.filter(appointment => 
         appointment.appointment_status === this.searchFilters.status
       );
     }

     // Apply doctor filter
     if (this.searchFilters.doctor) {
       filtered = filtered.filter(appointment => 
         appointment.doctor_name.toLowerCase().includes(this.searchFilters.doctor.toLowerCase())
       );
     }

     // Apply patient type filter
     if (this.searchFilters.patientType) {
       filtered = filtered.filter(appointment => 
         appointment.patient_type === this.searchFilters.patientType
       );
     }

     // Apply date range filter
     if (this.searchFilters.dateFrom) {
       filtered = filtered.filter(appointment => 
         new Date(appointment.date) >= new Date(this.searchFilters.dateFrom)
       );
     }

     if (this.searchFilters.dateTo) {
       filtered = filtered.filter(appointment => 
         new Date(appointment.date) <= new Date(this.searchFilters.dateTo)
       );
     }

     this.filteredAppointments = filtered;
   }

   clearSearch(): void {
     this.searchTerm = '';
     this.searchFilters = {
       status: '',
       doctor: '',
       patientType: '',
       dateFrom: '',
       dateTo: ''
     };
     this.filteredAppointments = [...this.recentAppointments];
   }

   getUniqueStatuses(): string[] {
     const statuses = [...new Set(this.recentAppointments.map(app => app.appointment_status))];
     return statuses.filter(status => status); // Remove empty values
   }

   getUniqueDoctors(): string[] {
     const doctors = [...new Set(this.recentAppointments.map(app => app.doctor_name))];
     return doctors.filter(doctor => doctor); // Remove empty values
   }

   getUniquePatientTypes(): string[] {
     const types = [...new Set(this.recentAppointments.map(app => app.patient_type))];
     return types.filter(type => type); // Remove empty values
   }

   // Export functionality
   exportAppointments(): void {
     const dataToExport = this.filteredAppointments.length > 0 ? this.filteredAppointments : this.recentAppointments;
     
     if (!dataToExport || dataToExport.length === 0) {
       alert('No appointment data available to export');
       return;
     }

     // Generate filename with current date
     const currentDate = new Date().toISOString().split('T')[0];
     const filename = `appointments_report_${currentDate}`;
     
     // Export excluding actions and internal fields
     this.exportService.exportToCSV(dataToExport, filename, ['actions', 'id']);
   }
}