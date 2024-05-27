import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { IPerson } from '../../models/person.model';
import { IStarship } from '../../models/starship.model';

@Component({
  selector: 'app-game-card',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './game-card.component.html',
  styleUrl: './game-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameCardComponent {
  @Input() item: IPerson | IStarship | null = null;

  public isPerson(item: IPerson | IStarship | null): item is IPerson {
    return (item as IPerson)?.mass !== undefined;
  }

  public isStarship(item: IPerson | IStarship | null): item is IStarship {
    return (item as IStarship)?.crew !== undefined;
  }
}
