import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, combineLatest, map, Observable } from 'rxjs';

import { IResponse } from '../../core/models/response.model';
import { IPerson } from '../models/person.model';
import { IStarship } from '../models/starship.model';

@Injectable()
export class GameService {
  private baseUrl = 'https://www.swapi.tech/api';

  constructor(private readonly httpClient: HttpClient) {}

  public getRandomPeople(n: number): Observable<IPerson[]> {
    const people$ = [...Array(n)].map(() => this.getRandomPerson());
    return combineLatest(people$);
  }

  public getRandomStarships(n: number): Observable<IStarship[]> {
    const starships$ = [...Array(n)].map(() => this.getRandomStarship());
    return combineLatest(starships$);
  }

  private getRandomPerson(): Observable<IPerson> {
    const id = Math.floor(Math.random() * 82) + 1;
    return this.httpClient
      .get<IResponse<IPerson>>(`${this.baseUrl}/people/${id}`)
      .pipe(
        map((res) => res.result.properties),
        catchError(() => this.getRandomPerson()),
      );
  }

  private getRandomStarship(): Observable<IStarship> {
    const id = Math.floor(Math.random() * 36) + 1;
    return this.httpClient
      .get<IResponse<IStarship>>(`${this.baseUrl}/starships/${id}`)
      .pipe(
        map((res) => res.result.properties),
        catchError(() => this.getRandomStarship()),
      );
  }
}
