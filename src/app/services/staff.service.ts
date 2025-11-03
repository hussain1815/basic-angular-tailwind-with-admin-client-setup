import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StaffService {

  constructor(private http:HttpClient) { }


  postStaff(payload:any){
    return this.http.post(`${environment.apiUrl}/api/staff/`,payload)
  }
  getStaff(){
    return this.http.get(`${environment.apiUrl}/api/staff/`)
  }
  updateStaff(id: number, payload: any){
    return this.http.put(`${environment.apiUrl}/api/staff/${id}/`, payload)
  }
  deleteStaff(id: number){
    return this.http.delete(`${environment.apiUrl}/api/staff/${id}/`)
  }
}
