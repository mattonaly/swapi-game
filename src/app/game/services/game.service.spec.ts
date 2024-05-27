import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { GameService } from './game.service';
import { IPerson } from '../models/person.model';
import { IStarship } from '../models/starship.model';

describe('GameService', () => {
  let service: GameService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [GameService],
    });
    service = TestBed.inject(GameService);
    httpController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getRandomPeople', () => {
    it('should return an Observable of IPerson array', () => {
      const n = 5;
      const mockPeople: IPerson[] = [...Array(n)].map(() => ({
        name: 'Luke Skywalker',
        height: '172',
        mass: '77',
        hair_color: 'blond',
        skin_color: 'fair',
        eye_color: 'blue',
        birth_year: '19BBY',
        gender: 'male',
        homeworld: 'https://swapi.tech/api/planets/1',
        created: new Date(),
        edited: new Date(),
        url: 'https://swapi.tech/api/people/1',
      }));

      service.getRandomPeople(n).subscribe((people) => {
        expect(people.length).toBe(n);
        people.forEach((person, index) => {
          expect(person).toEqual(mockPeople[index]);
        });
      });

      const requests = httpController.match((req) =>
        req.url.startsWith('https://www.swapi.tech/api/people/'),
      );
      expect(requests.length).toBe(n);
      requests.forEach((req, index) => {
        expect(req.request.method).toBe('GET');
        req.flush({ result: { properties: mockPeople[index] } });
      });
    });
  });

  describe('getRandomStarships', () => {
    it('should return an Observable of IStarship array', () => {
      const n = 5;
      const mockStarships: IStarship[] = [...Array(n)].map(() => ({
        name: 'Millennium Falcon',
        model: 'YT-1300 light freighter',
        starship_class: 'Light freighter',
        manufacturer: 'Corellian Engineering Corporation',
        cost_in_credits: '100000',
        length: '34.37',
        crew: '4',
        passengers: '6',
        max_atmosphering_speed: '1050',
        hyperdrive_rating: '0.5',
        MGLT: '75',
        cargo_capacity: '100000',
        consumables: '2 months',
        pilots: [],
        created: new Date(),
        edited: new Date(),
        url: 'https://swapi.tech/api/starships/10',
      }));

      service.getRandomStarships(n).subscribe((starships) => {
        expect(starships.length).toBe(n);
        starships.forEach((starship, index) => {
          expect(starship).toEqual(mockStarships[index]);
        });
      });

      const requests = httpController.match((req) =>
        req.url.startsWith('https://www.swapi.tech/api/starships/'),
      );
      expect(requests.length).toBe(n);
      requests.forEach((req, index) => {
        expect(req.request.method).toBe('GET');
        req.flush({ result: { properties: mockStarships[index] } });
      });
    });
  });
});
