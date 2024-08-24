/* eslint-disable max-len */
const page = {
  getMovies: () => cy.byDataCy('movie-card'),

  submitForm: () => {
    return cy.byDataCy('submit-button').click({ force: true });
  },

  fillForm: movie => {
    const empty = '{selectAll}{del}';

    cy.byDataCy('movie-title').type(movie.title || empty);
    cy.byDataCy('movie-description').type(movie.description || empty);
    cy.byDataCy('movie-imgUrl').type(movie.imgUrl || empty);
    cy.byDataCy('movie-imdbUrl').type(movie.imdbUrl || empty);
    cy.byDataCy('movie-imdbId').type(movie.imdbId || empty);
  },

  getError: name => {
    return cy
      .byDataCy(`movie-${name}`)
      .parents('.field')
      .find('.help.is-danger');
  },

  assertFormIsEmpty() {
    cy.byDataCy('movie-title').should('be.empty');
    cy.byDataCy('movie-description').should('be.empty');
    cy.byDataCy('movie-imgUrl').should('be.empty');
    cy.byDataCy('movie-imdbUrl').should('be.empty');
    cy.byDataCy('movie-imdbId').should('be.empty');
  },

  assertNoErrors() {
    page.getError('title').should('not.exist');
    page.getError('description').should('not.exist');
    page.getError('imgUrl').should('not.exist');
    page.getError('imdbUrl').should('not.exist');
    page.getError('imdbId').should('not.exist');
  },
};

const newMovie = {
  title: 'The Umbrella Academy',
  description:
    'A family of former child heroes, now grown apart, must reunite to continue to protect the world.',
  imgUrl:
    'https://m.media-amazon.com/images/M/MV5BOTdlODM0MTAtMzRiZi00MTQxLWE0MGUtNTNjOGZjNjAzN2E0XkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_QL75_UY562_CR35,0,380,562_.jpg',
  imdbId: 'tt1312171',
};

describe('NewMovie', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should have empty fields by default', () => {
    page.assertFormIsEmpty();
  });

  it('should not show errors by default', () => {
    page.assertNoErrors();
  });

  it('should allow to enter a title', () => {
    const title = 'The Umbrella Academy';

    cy.byDataCy('movie-title').type(title);
    cy.byDataCy('movie-title').should('have.value', title);
  });

  it('should allow to enter a description', () => {
    page.getByDataCy('movie-description').type('Some description');

    page
      .getByDataCy('movie-description')
      .should('have.value', 'Some description');
  });

  it('should allow to enter an imgUrl', () => {
    cy.byDataCy('movie-imgUrl').type('https://www.example.com/image.jpg');
    cy.byDataCy('movie-imgUrl').should(
      'have.value',
      'https://www.example.com/image.jpg',
    );
  });

  it('should allow to enter an imdbId', () => {
    cy.byDataCy('movie-imdbId').type('tt1312171');
    cy.byDataCy('movie-imdbId').should('have.value', 'tt1312171');
  });

  it('should disable submit button by default', () => {
    cy.byDataCy('submit-button').should('be.disabled');
  });

  it('should enable submit button after entering all the required fields', () => {
    page.fillForm({ ...newMovie });

    cy.byDataCy('submit-button').should('not.be.disabled');
  });

  it('should show title error only after blur', () => {
    cy.byDataCy('movie-title').focus();
    cy.byDataCy('movie-title').type('1{backspace}');

    page.getError('title').should('not.exist');

    cy.byDataCy('movie-title').blur();

    page.getError('title').should('exist');
  });

  it('should not show description error when empty', () => {
    cy.byDataCy('movie-description').focus();
    cy.byDataCy('movie-description').type('1{backspace}');
    cy.byDataCy('movie-description').blur();

    page.getError('description').should('not.exist');
  });

  it('should show imgUrl error only after blur', () => {
    cy.byDataCy('movie-imgUrl').focus();
    cy.byDataCy('movie-imgUrl').type('1{backspace}');

    page.getError('imgUrl').should('not.exist');

    cy.byDataCy('movie-imgUrl').blur();

    page.getError('imgUrl').should('exist');
  });

  it('should show imdbUrl error only after blur', () => {
    cy.byDataCy('movie-imdbUrl').focus();
    cy.byDataCy('movie-imdbUrl').type('1{backspace}');

    page.getError('imdbUrl').should('not.exist');

    cy.byDataCy('movie-imdbUrl').blur();

    page.getError('imdbUrl').should('exist');
  });

  it('should show imdbId error only after blur', () => {
    cy.byDataCy('movie-imdbId').focus();
    cy.byDataCy('movie-imdbId').type('1{backspace}');

    page.getError('imdbId').should('not.exist');

    cy.byDataCy('movie-imdbId').blur();

    page.getError('imdbId').should('exist');
  });

  it('should clear the form after a successful submission', () => {
    page.fillForm({ ...newMovie });
    page.submitForm();

    page.assertFormIsEmpty();
  });

  it('should not clear the form if title is empty', () => {
    page.fillForm({ ...newMovie, title: '' });
    page.submitForm();

    page
      .getByDataCy('movie-description')
      .should('have.value', newMovie.description);

    cy.byDataCy('movie-imgUrl').should('have.value', newMovie.imgUrl);
    cy.byDataCy('movie-imdbId').should('have.value', newMovie.imdbId);
  });

  it('should not have errors after a successful submission', () => {
    page.assertNoErrors();
  });
});

describe('Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should add a movie with correct data', () => {
    page.fillForm({ ...newMovie });
    page.submitForm();

    page.getMovies().should('have.length', 1);
    page.getMovies().last().find('.title').should('have.text', newMovie.title);

    page
      .getMovies()
      .last()
      .find('.content')
      .should('contain', newMovie.description);

    page
      .getMovies()
      .last()
      .find(`a[href="https://www.imdb.com/title/${newMovie.imdbId}"]`)
      .should('exist');
  });

  it('should not be reloaded', () => {
    page.fillForm({ ...newMovie });

    cy.window().should('not.have.prop', 'beforeReload');

    // eslint-disable-next-line no-param-reassign
    cy.window().then(w => (w.beforeReload = true));

    page.submitForm();

    cy.window().should('have.prop', 'beforeReload', true);
  });

  it('should clean the form after adding a movie', () => {
    page.fillForm({ ...newMovie });
    page.submitForm();

    cy.byDataCy('movie-title').should('be.empty');
    cy.byDataCy('movie-description').should('be.empty');
    cy.byDataCy('movie-imgUrl').should('be.empty');
    cy.byDataCy('movie-imdbUrl').should('be.empty');
    cy.byDataCy('movie-imdbId').should('be.empty');
  });
});
