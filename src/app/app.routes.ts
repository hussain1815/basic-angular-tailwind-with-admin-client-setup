import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { SimpleLoginComponent } from './components/simple-login/simple-login.component';
// import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: SimpleLoginComponent },
  
  { 
    path: 'admin', 
    loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin', 'show_room_owner', 'showroomowner', 'show room owner'] }
  },
  { 
    path: 'client', 
    loadChildren: () => import('./modules/client/client.module').then(m => m.ClientModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['client', 'investor', 'user'] }
  },
  // { path: 'unauthorized', component: UnauthorizedComponent },
  { path: '**', redirectTo: '/login' }
];
