import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExportService } from '../../../../services/export.service';

@Component({
  selector: 'app-revenue-reporting',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './revenue-reporting.component.html',
  styleUrls: ['./revenue-reporting.component.scss']
})
export class RevenueReportingComponent implements OnInit {

  // Mock revenue data
  totalRevenue = 1250000;
  quarterlyGrowth = 15.2;
  
  revenueStreams = [
    { name: 'Patient Services', amount: 750000, percentage: 60, growth: 12.5 },
    { name: 'Insurance Claims', amount: 300000, percentage: 24, growth: 18.3 },
    { name: 'Emergency Services', amount: 125000, percentage: 10, growth: 8.7 },
    { name: 'Consultations', amount: 75000, percentage: 6, growth: 22.1 }
  ];

  monthlyRevenue = [
    { month: 'Jan', amount: 185000, target: 180000 },
    { month: 'Feb', amount: 192000, target: 185000 },
    { month: 'Mar', amount: 208000, target: 190000 },
    { month: 'Apr', amount: 215000, target: 195000 },
    { month: 'May', amount: 225000, target: 200000 },
    { month: 'Jun', amount: 225000, target: 205000 }
  ];

  constructor(private exportService: ExportService) { }

  ngOnInit(): void {
  }

  // Export functionality
  exportRevenueData(): void {
    // Combine all revenue data for export
    const revenueData = [
      {
        category: 'Summary',
        total_revenue: this.totalRevenue,
        quarterly_growth: this.quarterlyGrowth + '%',
        period: 'Current Quarter'
      },
      ...this.revenueStreams.map(stream => ({
        category: 'Revenue Stream',
        name: stream.name,
        amount: stream.amount,
        percentage: stream.percentage + '%',
        growth: stream.growth + '%'
      })),
      ...this.monthlyRevenue.map(month => ({
        category: 'Monthly Revenue',
        month: month.month,
        actual_amount: month.amount,
        target_amount: month.target,
        variance: month.amount - month.target
      }))
    ];

    // Generate filename with current date
    const currentDate = new Date().toISOString().split('T')[0];
    const filename = `revenue_report_${currentDate}`;
    
    // Export the data
    this.exportService.exportToCSV(revenueData, filename, ['actions']);
  }

}