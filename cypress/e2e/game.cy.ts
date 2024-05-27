describe('SWAPI Game', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Visits the initial game page', () => {
    cy.visit('/');
    cy.contains('SWAPI Game');
  });

  it('should have default scores', () => {
    cy.get('p#scores').should('have.length', 2);
    cy.get('p#scores').each((score) => {
      cy.wrap(score).contains('0');
    });
  });

  describe('should allow changing resource and playing the game', () => {
    it('should play with people', () => {
      cy.get('mat-select').click();
      cy.get('mat-option').contains('people').click();

      cy.get('button').contains('Play').click();

      cy.get('app-game-card').should('have.length', 2);
      cy.get('app-game-card').each((card) => {
        cy.wrap(card).contains('Mass');
      });
    });

    it('should play with starships', () => {
      cy.get('mat-select').click();
      cy.get('mat-option').contains('starships').click();

      cy.get('button').contains('Play').click();

      cy.get('app-game-card').should('have.length', 2);
      cy.get('app-game-card').each((card) => {
        cy.wrap(card).contains('Crew');
      });
    });
  });

  describe('should show winner', () => {
    it('should determine a winner and update the score', () => {
      let invalidMass = false;
      let massValue: number | null = null;

      cy.get('app-game-card')
        .each((card) => {
          cy.wrap(card)
            .find('p')
            .contains('Mass:')
            .then((mass) => {
              const massText = mass.text();
              const currentMassValue = parseInt(massText.split(' ')[1]);
              if (isNaN(currentMassValue)) {
                invalidMass = true;
              }
              if (massValue === null) {
                massValue = currentMassValue;
              } else if (massValue === currentMassValue) {
                invalidMass = true;
              }
            });
        })
        .then(() => {
          if (!invalidMass) {
            cy.get('app-game-card.winner').should('exist');

            cy.get('p').then((els) => {
              const scores = els
                .map((index, el) => parseInt(el.innerText, 10))
                .get();
              expect(scores.some((score) => score > 0)).to.be.true;
            });
          } else {
            cy.get('app-game-card.winner').should('not.exist');
          }
        });
    });
  });
});
