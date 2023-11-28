import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Prosumer } from '../../models/prosumer/prosumer';

@Injectable({
  providedIn: 'root'
})
export class ProsumerService {

  url = 'http://localhost:3000/Prosumer'; // api rest fake

  // injetando o HttpClient
  constructor(private httpClient: HttpClient) { }

  // Headers
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }

  getProsumers(): Observable<Prosumer[]> {
    return this.httpClient.get<Prosumer[]>(this.url)
      .pipe(
        retry(2),
        catchError(this.handleError))
  }

  getProsumersUc(uc: number): Observable<Prosumer> {
    return this.httpClient.get<Prosumer>(this.url + '/' + uc)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

  // Manipulação de erros
  handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Erro ocorreu no lado do client
      errorMessage = error.error.message;
    } else {
      // Erro ocorreu no lado do servidor
      errorMessage = `Código do erro: ${error.status}, ` + `menssagem: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  };

}