import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-doctor-reporting',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './doctor-reporting.component.html',
  styleUrls: ['./doctor-reporting.component.scss']
})
export class DoctorReportingComponent implements OnInit {

  // Mock doctor performance data
  doctorStats = [
    {
      id: 1,
      name: 'Dr. John Smith',
      department: 'Cardiology',
      patientsServed: 156,
      revenue: 125000,
      satisfaction: 4.8,
      efficiency: 92,
      avatar: 'JS'
    },
    {
      id: 2,
      name: 'Dr. Sarah Johnson',
      department: 'Emergency',
      patientsServed: 203,
      revenue: 98000,
      satisfaction: 4.6,
      efficiency: 88,
      avatar: 'SJ'
    },
    {
      id: 3,
      name: 'Dr. Michael Brown',
      department: 'Surgery',
      patientsServed: 89,
      revenue: 185000,
      satisfaction: 4.9,
      efficiency: 95,
      avatar: 'MB'
    },
    {
      id: 4,
      name: 'Dr. Emily Davis',
      department: 'Pediatrics',
      patientsServed: 178,
      revenue: 87000,
      satisfaction: 4.7,
      efficiency: 90,
      avatar: 'ED'
    }
  ];

  departmentPerformance = [
    { name: 'Cardiology', doctors: 8, avgRevenue: 115000, avgSatisfaction: 4.7 },
    { name: 'Emergency', doctors: 12, avgRevenue: 85000, avgSatisfaction: 4.5 },
    { name: 'Surgery', doctors: 6, avgRevenue: 165000, avgSatisfaction: 4.8 },
    { name: 'Pediatrics', doctors: 10, avgRevenue: 78000, avgSatisfaction: 4.6 }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  getTotalRevenue(): number {
    return this.doctorStats.reduce((total, doctor) => total + doctor.revenue, 0);
  }

  getAverageSatisfaction(): number {
    const total = this.doctorStats.reduce((sum, doctor) => sum + doctor.satisfaction, 0);
    return total / this.doctorStats.length;
  }

}