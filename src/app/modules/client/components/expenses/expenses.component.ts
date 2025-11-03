import { Component } from '@angular/core';
import { ExpenseTrackingComponent } from "../../../admin/components/expense-tracking/expense-tracking.component";

@Component({
  selector: 'app-expenses',
  imports: [ExpenseTrackingComponent],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.scss'
})
export class ExpensesComponent {

}
