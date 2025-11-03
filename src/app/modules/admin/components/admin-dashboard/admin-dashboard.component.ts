import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { User } from '../../../../interfaces';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  standalone:true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  currentUser: User | null = null;

  // Hospital stats (mock data for now)
  hospitalStats = {
    totalStaff: 245,
    monthlyRevenue: 125000,
    monthlyExpenses: 89000,
    activeDoctors: 42
  };

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout(): void {
    this.authService.logout();
  }

  // Navigation methods for different features
  navigateToStaffManagement(): void {
    //consolele.log('Navigate to Staff Management');
    // TODO: Implement navigation
  }

  navigateToFinancialAnalytics(): void {
    //consolele.log('Navigate to Financial Analytics');
    // TODO: Implement navigation
  }

  navigateToExpenseTracking(): void {
    //consolele.log('Navigate to Expense Tracking');
    // TODO: Implement navigation
  }

  navigateToRevenueReporting(): void {
    //consolele.log('Navigate to Revenue Reporting');
    // TODO: Implement navigation
  }

  navigateToDoctorReporting(): void {
    //consolele.log('Navigate to Doctor Wise Reporting');
    // TODO: Implement navigation
  }

  navigateToSettings(): void {
    //consolele.log('Navigate to Settings');
    // TODO: Implement navigation
  }
}