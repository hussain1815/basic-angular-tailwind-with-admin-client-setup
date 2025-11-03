import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  constructor(private http:HttpClient) { }


  getExpenses(params?: string){
    const url = params ? `${environment.apiUrl}/api/expenses/${params}` : `${environment.apiUrl}/api/expenses/`;
    return this.http.get(url);
  }
  addExpenses(payload:any){
    return this.http.post(`${environment.apiUrl}/api/expenses/`,payload);
  }

  editExpenses(id:any,paylaod:any){
    return this.http.put(`${environment.apiUrl}/api/expenses/${id}/`,paylaod);
  }

  deleteExpenses(id:any){
    return this.http.delete(`${environment.apiUrl}/api/expenses/${id}/`);
  }


  getExpenseStatistics(params?: string){
    const url = params ? `${environment.apiUrl}/api/expenses/statistics/${params}` : `${environment.apiUrl}/api/expenses/statistics/`;
    return this.http.get(url);
  }
}
