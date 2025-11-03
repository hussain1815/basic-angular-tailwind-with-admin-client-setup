import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-expense-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-expense-dialog.component.html',
  styleUrls: ['./add-expense-dialog.component.scss']
})
export class AddExpenseDialogComponent implements OnChanges {
  @Input() isVisible = false;
  @Input() editMode = false;
  @Input() expenseData: any = null;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<any>();

  expenseForm: FormGroup;
  originalFormData: any = null;
  hasChanges = false;
  
  expenseTypes = [
    'Rent',
    'Daily Expense',
    'Bills/Utilities',
    'Salaries',
    'Medical Supplies',
    'Other'
  ];

  constructor(private fb: FormBuilder) {
    this.expenseForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(1)]],
      expense_type: ['', Validators.required],
      details: ['', Validators.required]
    });

    // Watch for form changes to detect modifications
    this.expenseForm.valueChanges.subscribe(() => {
      this.checkForChanges();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['expenseData'] && this.expenseData && this.editMode) {
      this.populateForm();
    }
  }

  populateForm(): void {
    if (!this.expenseData) return;

    const formData = {
      amount: this.expenseData.amount,
      expense_type: this.expenseData.expense_type,
      details: this.expenseData.details
    };

    this.expenseForm.patchValue(formData);
    
    // Store original data for comparison
    this.originalFormData = { ...formData };
    this.hasChanges = false; // Reset changes flag
  }

  onCancel(): void {
    this.expenseForm.reset();
    this.originalFormData = null;
    this.hasChanges = false;
    this.onClose.emit();
  }

  onAdd(): void {
    if (this.expenseForm.valid) {
      const payload: any = {
        amount: this.expenseForm.value.amount,
        expense_type: this.expenseForm.value.expense_type,
        details: this.expenseForm.value.details
      };

      // Add ID for edit mode
      if (this.editMode && this.expenseData) {
        payload.id = this.expenseData.id;
      }
      
      // console.log(this.editMode ? 'Expense update payload:' : 'Expense add payload:', payload);
      this.onSave.emit(payload);
      this.expenseForm.reset();
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.expenseForm.controls).forEach(key => {
        this.expenseForm.get(key)?.markAsTouched();
      });
    }
  }

  // Method to check if form has changes
  checkForChanges(): void {
    if (!this.editMode || !this.originalFormData) {
      this.hasChanges = false;
      return;
    }

    const currentFormData = this.expenseForm.value;
    
    // Compare each field
    this.hasChanges = Object.keys(this.originalFormData).some(key => {
      const original = this.originalFormData[key];
      const current = currentFormData[key];
      
      // Handle different data types
      if (typeof original === 'number' && typeof current === 'string') {
        return original !== parseFloat(current);
      }
      
      return original !== current;
    });
  }

  // Method to check if button should be enabled
  isSubmitButtonEnabled(): boolean {
    if (!this.editMode) {
      // Add mode: button enabled if form is valid
      return this.expenseForm.valid;
    } else {
      // Edit mode: button enabled if form is valid AND has changes
      return this.expenseForm.valid && this.hasChanges;
    }
  }

  getErrorMessage(fieldName: string): string {
    const field = this.expenseForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${fieldName.replace('_', ' ')} is required`;
    }
    if (field?.hasError('min')) {
      return 'Amount must be greater than 0';
    }
    return '';
  }
}