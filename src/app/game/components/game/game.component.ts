import { HttpClientModule } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { merge } from 'rxjs';

import { IPerson } from '../../models/person.model';
import { Resource } from '../../models/resource.enum';
import { IStarship } from '../../models/starship.model';
import { GameService } from '../../services/game.service';
import { GameCardComponent } from '../game-card/game-card.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    HttpClientModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    GameCardComponent,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [GameService],
})
export class GameComponent implements OnInit {
  static players = 2;

  private destroyRef = inject(DestroyRef);

  public resources = Object.values(Resource);
  public resource = signal(Resource.PEOPLE);

  public winnerIndex = signal<number | null>(null);

  public scores = signal<number[]>([0, 0]);

  constructor(
    private readonly gameService: GameService,
    private readonly snackbar: MatSnackBar,
  ) {}

  public items: WritableSignal<IPerson[] | IStarship[]> = signal([]);

  public ngOnInit(): void {
    this.play();
  }

  public resourceChange(change: MatSelectChange): void {
    this.resource.set(change.value);
  }

  public play(): void {
    this.items.set([]);

    const people$ = this.gameService.getRandomPeople(GameComponent.players);
    const starships$ = this.gameService.getRandomStarships(
      GameComponent.players,
    );

    const resource$ =
      this.resource() === Resource.PEOPLE ? people$ : starships$;

    merge(resource$)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((items) => {
        this.items.set(items);
        this.determineWinner(items);
      });
  }

  private determineWinner(items: IPerson[] | IStarship[]): void {
    this.winnerIndex.set(null);

    const winner = items.reduce((a, b) => {
      if ('crew' in a && 'crew' in b) {
        const crewHome = Number.parseInt((a as IStarship).crew);
        const crewAway = Number.parseInt((b as IStarship).crew);
        if (isNaN(crewHome) || isNaN(crewAway)) {
          const message = `Invalid crew: ${crewHome} ${crewAway}`;
          this.snackbar.open(message);
          throw new Error(message);
        }
        if (crewHome === crewAway) {
          const message = `Equal crew: ${crewHome} ${crewAway}`;
          this.snackbar.open(message);
          throw new Error(message);
        }
        return crewHome > crewAway ? a : b;
      }

      if ('mass' in a && 'mass' in b) {
        const massHome = Number.parseInt((a as IPerson).mass);
        const massAway = Number.parseInt((b as IPerson).mass);
        if (isNaN(massHome) || isNaN(massAway)) {
          const message = `Invalid mass: ${massHome} ${massAway}`;
          this.snackbar.open(message);
          throw new Error(message);
        }
        if (massHome === massAway) {
          const message = `Equal mass: ${massHome} ${massAway}`;
          this.snackbar.open(message);
          throw new Error(message);
        }
        return massHome > massAway ? a : b;
      }

      return a;
    });

    const winnerIndex = items.findIndex((item) => item === winner);

    this.winnerIndex.set(winnerIndex);
    this.updateScores(winnerIndex);
  }

  private updateScores(winnerIndex: number): void {
    this.scores.set(
      this.scores().map((score, index) =>
        index === winnerIndex ? score + 1 : score,
      ),
    );
  }
}
