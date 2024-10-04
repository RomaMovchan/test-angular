import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private httpClient = inject(HttpClient)

  public get(url: string) {
    return this.httpClient.get(`/api/${url}`);
  }

  constructor() { }
}
