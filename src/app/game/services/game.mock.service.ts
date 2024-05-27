import { Observable, of } from 'rxjs';
import { IPerson } from '../models/person.model';
import { IStarship } from '../models/starship.model';

export class GameMockService {
  public getRandomPeople(n: number): Observable<IPerson[]> {
    return of([...Array(n)].map(() => this.getRandomPerson()));
  }

  public getRandomStarships(n: number): Observable<IStarship[]> {
    return of([...Array(n)].map(() => this.getRandomStarship()));
  }

  private getRandomPerson(): IPerson {
    return {
      height: '172',
      mass: Math.floor(Math.random() * 1000).toString(),
      hair_color: 'blond',
      skin_color: 'fair',
      eye_color: 'blue',
      birth_year: '19BBY',
      gender: 'male',
      created: new Date('2024-05-26T09:22:06.330Z'),
      edited: new Date('2024-05-26T09:22:06.330Z'),
      name: 'Luke Skywalker',
      homeworld: 'https://www.swapi.tech/api/planets/1',
      url: 'https://www.swapi.tech/api/people/1',
    };
  }

  private getRandomStarship(): IStarship {
    return {
      model: 'CR90 corvette',
      starship_class: 'corvette',
      manufacturer: 'Corellian Engineering Corporation',
      cost_in_credits: '3500000',
      length: '150',
      crew: Math.floor(Math.random() * 1000).toString(),
      passengers: '600',
      max_atmosphering_speed: '950',
      hyperdrive_rating: '2.0',
      MGLT: '60',
      cargo_capacity: '3000000',
      consumables: '1 year',
      pilots: [],
      created: new Date('2020-09-17T17:55:06.604Z'),
      edited: new Date('2020-09-17T17:55:06.604Z'),
      name: 'CR90 corvette',
      url: 'https://www.swapi.tech/api/starships/2',
    };
  }
}
