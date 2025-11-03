import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CllinicProfileService {

  constructor(private http:HttpClient) { }


  postClinicProfile(payload:any){
    return this.http.post(`${environment.apiUrl}/api/clinic/`,payload)
  }
  getclinicprofile(){
    return this.http.get(`${environment.apiUrl}/api/clinic/`)
  }
  
  getClinicStatistics(){
    return this.http.get(`${environment.apiUrl}/api/clinic/statistics`)
  }
}
