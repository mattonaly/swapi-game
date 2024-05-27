import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { IPerson } from '../../models/person.model';
import { Resource } from '../../models/resource.enum';
import { GameMockService } from '../../services/game.mock.service';
import { GameService } from '../../services/game.service';
import { GameComponent } from './game.component';

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameComponent, BrowserAnimationsModule],
    }).compileComponents();
    await TestBed.overrideProvider(GameService, {
      useValue: new GameMockService(),
    }).compileComponents();

    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default resource and call play method', () => {
    spyOn(component, 'play').and.callThrough();
    component.ngOnInit();
    expect(component.play).toHaveBeenCalled();
    expect(component.resource()).toBe(Resource.PEOPLE);
  });

  describe('should load random resources', () => {
    it('should load random people', fakeAsync(() => {
      component.resource.set(Resource.PEOPLE);
      component.play();
      fixture.detectChanges();
      expect(component.items().length).toBe(2);
      expect(component.items()[0].name).toBe('Luke Skywalker');
    }));

    it('should load random starships', fakeAsync(() => {
      component.resource.set(Resource.STARSHIPS);
      component.play();
      fixture.detectChanges();
      expect(component.items().length).toBe(2);
      expect(component.items()[0].name).toBe('CR90 corvette');
    }));
  });

  describe('should update scores', () => {
    it('should update scores when player 1 wins', () => {
      component.scores.set([0, 0]);
      component['updateScores'](0);
      expect(component.scores()[0]).toBe(1);
    });

    it('should update scores when player 2 wins', () => {
      component.scores.set([0, 0]);
      component['updateScores'](1);
      expect(component.scores()[1]).toBe(1);
    });
  });

  describe('should determine winner', () => {
    it('should determine winner when player 1 wins', () => {
      const items = [
        { name: 'A', mass: 1 },
        { name: 'B', mass: 2 },
      ] as unknown[] as IPerson[];
      component['determineWinner'](items);
      expect(component.winnerIndex()).toBe(1);
    });

    it('should determine winner when player 2 wins', () => {
      const items = [
        { name: 'A', mass: 2 },
        { name: 'B', mass: 1 },
      ] as unknown[] as IPerson[];
      component['determineWinner'](items);
      expect(component.winnerIndex()).toBe(0);
    });

    it('should determine winner when equal', () => {
      const items = [
        { name: 'A', mass: 1 },
        { name: 'B', mass: 1 },
      ] as unknown[] as IPerson[];
      spyOn(component['snackbar'], 'open');
      expect(() => component['determineWinner'](items)).toThrowError();
      expect(component['snackbar'].open).toHaveBeenCalled();
    });

    it('should determine winner when unknown', () => {
      const items = [
        { name: 'A', mass: 'unknown' },
        { name: 'B', mass: 1 },
      ] as unknown[] as IPerson[];
      spyOn(component['snackbar'], 'open');
      expect(() => component['determineWinner'](items)).toThrowError();
      expect(component['snackbar'].open).toHaveBeenCalled();
    });
  });
});
