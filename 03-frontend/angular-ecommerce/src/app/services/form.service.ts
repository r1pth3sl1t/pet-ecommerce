import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  private countriesUrl = 'http://localhost:8080/api/countries';
  private statesUrl = 'http://localhost:8080/api/states';
  constructor(private httpClient: HttpClient) { }

  getCreditCardYears(): Observable<number[]> {
    const startYear: number = new Date().getFullYear();

    let data: number[] = [];

    for (let i = startYear; i <= startYear + 10; i++) {
      data.push(i);
    }

    return of(data);
  }

  getCreditCardMonths(startMonth: number): Observable<number[]> {
    let data: number[] = [];

    for (let i = startMonth; i <= 12; i++) {
      data.push(i);
    }

    return of(data);
  }

  getCountries(): Observable<Country[]> {

    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
       map(response => response._embedded.countries)
    )

  }

  getStates(name: string): Observable<State[]> {
    
    const searchUrl: string = `${this.statesUrl}/search/findByCountryCode?code=${name}`;

    return this.httpClient.get<GetResponseStates>(searchUrl).pipe(
       map(response => response._embedded.states)
    )
  }

}

interface GetResponseCountries {
  _embedded: {
    countries: Country[];
  }
}

interface GetResponseStates {
  _embedded: {
    states: State[];
  }
}
