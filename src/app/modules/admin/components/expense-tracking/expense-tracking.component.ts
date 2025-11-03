import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpenseService } from '../../../../services/expense.service';
import { ExportService } from '../../../../services/export.service';
import { AddExpenseDialogComponent } from './add-expense-dialog/add-expense-dialog.component';
import { ConfirmationDialogComponent } from '../../../../components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-expense-tracking',
  standalone: true,
  imports: [CommonModule, FormsModule, AddExpenseDialogComponent, ConfirmationDialogComponent],
  templateUrl: './expense-tracking.component.html',
  styleUrls: ['./expense-tracking.component.scss']
})
export class ExpenseTrackingComponent implements OnInit {

  // Mock expense data
  totalExpenses = 89000;
  monthlyBudget = 95000;
  allexpenseData:any;
  statisticData:any
  expenseCategories = {
    rent: 15000,
    daily_expense: 8500,
    bills_utilities: 12000,
    salaries: 35000,
    medical_supplies: 25000,
    other: 9500
  };

  recentExpenses = [
    { date: '2024-01-15', description: 'Medical Equipment Purchase', category: 'Medical Supplies', amount: 5500, status: 'Approved' },
    { date: '2024-01-14', description: 'Monthly Staff Salaries', category: 'Staff Salaries', amount: 35000, status: 'Paid' },
    { date: '2024-01-13', description: 'Electricity Bill', category: 'Utilities', amount: 2800, status: 'Pending' },
    { date: '2024-01-12', description: 'MRI Machine Maintenance', category: 'Equipment Maintenance', amount: 3200, status: 'Approved' }
  ];

  constructor(
    private expenseService: ExpenseService,
    private exportService: ExportService
  ) { }

  ngOnInit(): void {
    // Set default date range (current month)
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    this.dateFrom = firstDay.toISOString().split('T')[0];
    this.dateTo = lastDay.toISOString().split('T')[0];

    this.getExpenseData();
    this.getExpenseStatistics();
  }



  getExpenseData(){
    let params = '';
    if (this.dateFrom && this.dateTo) {
      params = `?date_from=${this.dateFrom}&date_to=${this.dateTo}`;
    }
    
    this.expenseService.getExpenses(params).subscribe((resp)=>{
      // console.log('Expense data:', resp);
      this.allexpenseData=resp
    })
  }
  
  getExpenseStatistics(){
    let params = '';
    if (this.dateFrom && this.dateTo) {
      params = `?date_from=${this.dateFrom}&date_to=${this.dateTo}`;
    }
    
    this.expenseService.getExpenseStatistics(params).subscribe((resp)=>{
      // console.log('Statistics data:', resp);
      this.statisticData=resp
    })
  }

  // Dialog visibility and edit mode
  isAddExpenseDialogVisible = false;
  isEditMode = false;
  selectedExpenseData: any = null;

  // Delete confirmation dialog
  isDeleteConfirmationVisible = false;
  expenseToDelete: any = null;

  // Date range filtering
  dateFrom: string = '';
  dateTo: string = '';
  expenseStatistics: any = null;

  getBudgetUsagePercentage(): number {
    return (this.totalExpenses / this.monthlyBudget) * 100;
  }

  openAddExpenseDialog(): void {
    this.isEditMode = false;
    this.selectedExpenseData = null;
    this.isAddExpenseDialogVisible = true;
  }

  openEditExpenseDialog(expense: any): void {
    this.isEditMode = true;
    this.selectedExpenseData = expense;
    this.isAddExpenseDialogVisible = true;
  }

  onCloseExpenseDialog(): void {
    this.isAddExpenseDialogVisible = false;
    this.isEditMode = false;
    this.selectedExpenseData = null;
  }

  onSaveExpense(expenseData: any): void {
    if (this.isEditMode) {
      // console.log('Expense updated:', expenseData);
      this.expenseService.editExpenses(expenseData.id,expenseData).subscribe((resp)=>{
        // console.log('Expense updated response:', resp);
        this.getExpenseData();
      })
      // Here you can call update API
      // this.expenseService.updateExpense(expenseData.id, expenseData).subscribe((resp) => {
      //   console.log('Expense updated response:', resp);
      //   this.getExpenseData();
      // });
    } else {
      // console.log('Expense added:', expenseData);
      // Here you can add the expense to your data or call a service
      this.expenseService.addExpenses(expenseData).subscribe((resp)=>{
        // console.log('Expense saved response:', resp);
        // Refresh the expense data after adding
        this.getExpenseData();
      })
    }
    this.isAddExpenseDialogVisible = false;
    this.isEditMode = false;
    this.selectedExpenseData = null;
  }

  // Helper method to get CSS classes for expense types
  getExpenseTypeClass(expenseType: string): string {
    const typeClasses: { [key: string]: string } = {
      'Rent': 'bg-purple-100 text-purple-800',
      'Daily Expense': 'bg-orange-100 text-orange-800',
      'Bills/Utilities': 'bg-blue-100 text-blue-800',
      'Salaries': 'bg-green-100 text-green-800',
      'Medical Supplies': 'bg-red-100 text-red-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    return typeClasses[expenseType] || 'bg-gray-100 text-gray-800';
  }

  // Helper method to format date
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  // Delete functionality
  openDeleteConfirmation(expense: any): void {
    this.expenseToDelete = expense;
    this.isDeleteConfirmationVisible = true;
  }

  onDeleteConfirm(): void {
    if (this.expenseToDelete) {
      // console.log('Deleting expense:', this.expenseToDelete);
      this.expenseService.deleteExpenses(this.expenseToDelete.id).subscribe((resp)=>{
        // console.log('Expense deleted response:', resp);
        this.getExpenseData();
      })
    }
    this.isDeleteConfirmationVisible = false;
    this.expenseToDelete = null;
  }

  onDeleteCancel(): void {
    this.isDeleteConfirmationVisible = false;
    this.expenseToDelete = null;
  }

  // Date range functionality
  onDateRangeChange(): void {
    if (this.dateFrom && this.dateTo) {
      // console.log(`Filtering expenses from ${this.dateFrom} to ${this.dateTo}`);
      this.getExpenseData();
      this.getExpenseStatistics();
    }
  }

  resetDateRange(): void {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    this.dateFrom = firstDay.toISOString().split('T')[0];
    this.dateTo = lastDay.toISOString().split('T')[0];
    
    this.onDateRangeChange();
  }

  // Export functionality
  exportExpenses(): void {
    if (!this.allexpenseData || this.allexpenseData.length === 0) {
      alert('No expense data available to export');
      return;
    }

    // Generate filename with date range
    const filename = `expenses_report_${this.dateFrom}_to_${this.dateTo}`;
    
    // Export excluding actions and internal fields
    this.exportService.exportToCSV(this.allexpenseData, filename, ['actions', 'id']);
  }

}