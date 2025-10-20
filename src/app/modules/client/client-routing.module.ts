import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientDashboardComponent } from './components/client-dashboard/client-dashboard.component';
import { RoleGuard } from '../../guards/role.guard';

const routes: Routes = [
  {
    path: '',
    component: ClientDashboardComponent,
    canActivate: [RoleGuard],
    data: { roles: ['client', 'investor', 'user'] }
  },
  // Add more client routes here as needed
  // { path: 'profile', component: ClientProfileComponent, canActivate: [RoleGuard], data: { roles: ['client', 'investor', 'user'] } },
  // { path: 'orders', component: ClientOrdersComponent, canActivate: [RoleGuard], data: { roles: ['client', 'investor', 'user'] } },
  // { path: 'settings', component: ClientSettingsComponent, canActivate: [RoleGuard], data: { roles: ['client', 'investor', 'user'] } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }