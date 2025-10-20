import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { RoleGuard } from '../../guards/role.guard';

const routes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    canActivate: [RoleGuard],
    data: { roles: ['admin', 'show_room_owner', 'showroomowner', 'show room owner'] }
  },
  // Add more admin routes here as needed
  // { path: 'users', component: AdminUsersComponent, canActivate: [RoleGuard], data: { roles: ['admin', 'show_room_owner'] } },
  // { path: 'settings', component: AdminSettingsComponent, canActivate: [RoleGuard], data: { roles: ['admin', 'show_room_owner'] } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }