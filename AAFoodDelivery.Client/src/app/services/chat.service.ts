import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private http = inject(HttpClient);

  private apiUrl = 'https://localhost:7188/api/Chat';

  sendMessage(message: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, {
      message: message
    });
  }
}
