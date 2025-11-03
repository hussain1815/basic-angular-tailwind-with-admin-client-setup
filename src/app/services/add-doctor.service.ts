import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AddDoctorService {

  constructor( private http: HttpClient) { }


  addDoctor(payload:any){
    return this.http.post(`${environment.apiUrl}/api/doctors/`,payload)
  }

  getallDoctors(){
    return this.http.get(`${environment.apiUrl}/api/doctors/`)
  }

  // STEP 4: Add update method for editing doctors
  updateDoctor(id: number, payload: any){
    return this.http.put(`${environment.apiUrl}/api/doctors/${id}/`, payload)
  }

  // NEW: Add delete method for removing doctors
  deleteDoctor(id: number){
    return this.http.delete(`${environment.apiUrl}/api/doctors/${id}/`)
  }
}
