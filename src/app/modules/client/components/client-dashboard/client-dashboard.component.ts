import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { User } from '../../../../interfaces';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-client-dashboard',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.scss']
})
export class ClientDashboardComponent implements OnInit {
  currentUser: User | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout(): void {
    this.authService.logout();
  }
}