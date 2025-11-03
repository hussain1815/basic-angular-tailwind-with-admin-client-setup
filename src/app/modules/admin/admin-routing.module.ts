import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './components/admin-layout/admin-layout.component';
import { DashboardOverviewComponent } from './components/dashboard-overview/dashboard-overview.component';
import { StaffManagementComponent } from './components/staff-management/staff-management.component';
import { FinancialAnalyticsComponent } from './components/financial-analytics/financial-analytics.component';
import { ExpenseTrackingComponent } from './components/expense-tracking/expense-tracking.component';
import { RevenueReportingComponent } from './components/revenue-reporting/revenue-reporting.component';
import { DoctorReportingComponent } from './components/doctor-reporting/doctor-reporting.component';
import { AdminSettingsComponent } from './components/admin-settings/admin-settings.component';
import { AppointmentComponent } from './components/appointment/appointment.component';
import { RoleGuard } from '../../guards/role.guard';
import { EmployeeManagementComponent } from './employee-management/employee-management.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Clinic Owner','admin', 'show_room_owner', 'showroomowner', 'show room owner'] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardOverviewComponent },
      { path: 'staff-management', component: StaffManagementComponent },
      { path: 'employee-management', component: EmployeeManagementComponent },
      { path: 'appointment', component: AppointmentComponent },
      { path: 'financial-analytics', component: FinancialAnalyticsComponent },
      { path: 'expense-tracking', component: ExpenseTrackingComponent },
      { path: 'revenue-reporting', component: RevenueReportingComponent },
      { path: 'doctor-reporting', component: DoctorReportingComponent },
      { path: 'settings', component: AdminSettingsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }