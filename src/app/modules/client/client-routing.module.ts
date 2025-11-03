import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientLayoutComponent } from './components/client-layout/client-layout.component';
import { ClientDashboardComponent } from './components/client-dashboard/client-dashboard.component';
import { RoleGuard } from '../../guards/role.guard';
import { ExpensesComponent } from './components/expenses/expenses.component';

const routes: Routes = [
  {
    path: '',
    component: ClientLayoutComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Receptionist','receptionist','client', 'investor', 'user'] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: ClientDashboardComponent },
      // Add more client routes here as needed
      { path: 'expenses', component: ExpensesComponent },
      // { path: 'book-appointment', component: BookAppointmentComponent },
      // { path: 'medical-records', component: MedicalRecordsComponent },
      // { path: 'prescriptions', component: PrescriptionsComponent },
      // { path: 'billing', component: BillingComponent },
      // { path: 'profile', component: ClientProfileComponent },
      // { path: 'support', component: SupportComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }