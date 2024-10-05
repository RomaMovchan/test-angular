import { inject, Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private httpClient = inject(HttpClient)

  public get(url: string): Observable<any> {
    return this.httpClient.get(`/api/${url}`);
  }

  public post(url: string, payload: any): Observable<any> {
    return this.httpClient.post(`/api/${url}`, payload);
  }
}
