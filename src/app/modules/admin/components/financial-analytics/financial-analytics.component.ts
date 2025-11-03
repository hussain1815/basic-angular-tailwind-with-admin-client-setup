import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-financial-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './financial-analytics.component.html',
  styleUrls: ['./financial-analytics.component.scss']
})
export class FinancialAnalyticsComponent implements OnInit {

  // Mock financial data
  financialData = {
    totalRevenue: 1250000,
    monthlyGrowth: 12.5,
    profitMargin: 28.3,
    operatingCosts: 890000
  };

  monthlyData = [
    { month: 'Jan', revenue: 95000, expenses: 68000 },
    { month: 'Feb', revenue: 102000, expenses: 72000 },
    { month: 'Mar', revenue: 118000, expenses: 78000 },
    { month: 'Apr', revenue: 125000, expenses: 82000 },
    { month: 'May', revenue: 135000, expenses: 89000 },
    { month: 'Jun', revenue: 142000, expenses: 91000 }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}