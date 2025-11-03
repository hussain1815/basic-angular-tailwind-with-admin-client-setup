import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  constructor(private http:HttpClient) { }


  addAppointment(payload:any){
    return this.http.post(`${environment.apiUrl}/api/appointments/`,payload)
  }
  getAppointments(){
    return this.http.get(`${environment.apiUrl}/api/appointments/`)
  }

  deleteAppointment(id:number){
    return this.http.delete(`${environment.apiUrl}/api/appointments/${id}/`)
  }


  editAppointment(id:number,payload:any, updateAll: boolean = false){
    const url = updateAll 
      ? `${environment.apiUrl}/api/appointments/${id}/?update_all=true`
      : `${environment.apiUrl}/api/appointments/${id}/`;
    return this.http.patch(url, payload);
  }


  addbulkappointments(payload:any){
    return this.http.post(`${environment.apiUrl}/api/appointments/bulk_create/`,payload)
  }
}
