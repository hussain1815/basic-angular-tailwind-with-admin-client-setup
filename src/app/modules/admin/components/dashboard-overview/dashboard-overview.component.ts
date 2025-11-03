import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CllinicProfileService } from '../../../../services/cllinic-profile.service';

@Component({
  selector: 'app-dashboard-overview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-overview.component.html',
  styleUrls: ['./dashboard-overview.component.scss']
})
export class DashboardOverviewComponent implements OnInit {
  
  hospitalStats = {
    totalStaff: 0,
    monthlyRevenue: 0,
    monthlyExpenses: 0,
    netProfit: 0
  };

  isLoading = false;
  error: string | null = null;

  constructor(private clinicService: CllinicProfileService) {}

  ngOnInit(): void {
    this.loadClinicStatistics();
  }

  loadClinicStatistics(): void {
    this.isLoading = true;
    this.error = null;
    
    this.clinicService.getClinicStatistics().subscribe({
      next: (response: any) => {
        // console.log('✅ Clinic statistics received:', response);
        
        // Update hospital stats with API data
        this.hospitalStats = {
          totalStaff: response.total_staff || 0,
          monthlyRevenue: this.parseNumericValue(response.total_revenue) || 0,
          monthlyExpenses: this.parseNumericValue(response.total_expenses) || 0,
          netProfit: this.parseNumericValue(response.net_profit) || 0
        };
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error loading clinic statistics:', error);
        this.error = 'Failed to load statistics';
        this.isLoading = false;
        
        // Keep dummy data as fallback
        this.hospitalStats = {
          totalStaff: 0,
          monthlyRevenue: 0,
          monthlyExpenses: 0,
          netProfit: 0
        };
      }
    });
  }

  // Helper method to parse numeric values that might come as strings with 'K' suffix
  parseNumericValue(value: any): number {
    if (typeof value === 'number') {
      return value;
    }
    
    if (typeof value === 'string') {
      // Handle values like "15.02K"
      if (value.includes('K')) {
        const numericPart = parseFloat(value.replace('K', ''));
        return numericPart * 1000;
      }
      
      // Handle regular string numbers
      const parsed = parseFloat(value);
      return isNaN(parsed) ? 0 : parsed;
    }
    
    return 0;
  }

  // Helper method to format currency
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  // Helper method to format large numbers with K/M suffix
  formatLargeNumber(amount: number): string {
    if (amount >= 1000000) {
      return (amount / 1000000).toFixed(1) + 'M';
    } else if (amount >= 1000) {
      return (amount / 1000).toFixed(1) + 'K';
    }
    return amount.toString();
  }
}