/// <reference types="cypress" />
/* eslint-disable max-len */
import movies from '../../src/data/movies.json';

const page = {
  getMovies: () => cy.byDataCy('movie'),
};

const form = {
  field: name => cy.byDataCy(`movie-form__${name}`),
  submitButton: () => cy.byDataCy(`movie-form__submit-button`),
  error: name => form.field(name).parents('.field').find('.help.is-danger'),

  submit: () => form.submitButton().click({ force: true }),

  fill: movie => {
    const empty = '{selectAll}{del}';

    form.field('title').type(movie.title || empty);
    form.field('description').type(movie.description || empty);
    form.field('imgUrl').type(movie.imgUrl || empty);
    form.field('imdbId').type(movie.imdbId || empty);
  },

  assertEmpty() {
    form.field('title').should('be.empty');
    form.field('description').should('be.empty');
    form.field('imgUrl').should('be.empty');
    form.field('imdbId').should('be.empty');
  },

  assertNoErrors() {
    form.error('title').should('not.exist');
    form.error('description').should('not.exist');
    form.error('imgUrl').should('not.exist');
    form.error('imdbId').should('not.exist');
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

describe('Form', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should have empty fields by default', () => {
    form.assertEmpty();
  });

  it('should not show errors by default', () => {
    form.assertNoErrors();
  });

  it('should allow to enter a title', () => {
    form.field('title').type('The Umbrella Academy');
    form.field('title').should('have.value', 'The Umbrella Academy');
  });

  it('should allow to enter a description', () => {
    form.field('description').type('Some description');
    form.field('description').should('have.value', 'Some description');
  });

  it('should allow to enter an imgUrl', () => {
    const URL = 'https://www.example.com/image.jpg';

    form.field('imgUrl').type(URL);
    form.field('imgUrl').should('have.value', URL);
  });

  it('should allow to enter an imdbId', () => {
    form.field('imdbId').type('tt1312171');
    form.field('imdbId').should('have.value', 'tt1312171');
  });

  it('should disable submit button by default', () => {
    form.submitButton().should('be.disabled');
  });

  it('should enable submit button after entering all the required fields', () => {
    form.fill({ ...newMovie });

    form.submitButton().should('not.be.disabled');
  });

  it('should not enable submit button if title is empty', () => {
    form.fill({ ...newMovie, title: '' });

    form.submitButton().should('be.disabled');
  });

  it('should not enable submit button if imgUrl is empty', () => {
    form.fill({ ...newMovie, imgUrl: '' });

    form.submitButton().should('be.disabled');
  });

  it('should not enable submit button if imdbId is empty', () => {
    form.fill({ ...newMovie, imdbId: '' });

    form.submitButton().should('be.disabled');
  });

  it('should enable submit button if description is empty', () => {
    form.fill({ ...newMovie, description: '' });

    form.submitButton().should('not.be.disabled');
  });

  it('should show title error only after blur', () => {
    form.field('title').focus();
    form.error('title').should('not.exist');

    form.field('title').type('1{backspace}');
    form.error('title').should('not.exist');

    form.field('title').blur();
    form.error('title').should('exist');
  });

  it('should not show description error when empty', () => {
    form.field('description').focus();
    form.field('description').type('1{backspace}');
    form.field('description').blur();

    form.error('description').should('not.exist');
  });

  it('should show imgUrl error only after blur', () => {
    form.field('imgUrl').focus();
    form.error('imgUrl').should('not.exist');

    form.field('imgUrl').type('1{backspace}');
    form.error('imgUrl').should('not.exist');

    form.field('imgUrl').blur();
    form.error('imgUrl').should('exist');
  });

  it('should show imdbId error only after blur', () => {
    form.field('imdbId').focus();
    form.error('imdbId').should('not.exist');

    form.field('imdbId').type('1{backspace}');
    form.error('imdbId').should('not.exist');

    form.field('imdbId').blur();
    form.error('imdbId').should('exist');
  });

  it('should clear the form after a successful submission', () => {
    form.fill({ ...newMovie });
    form.submit();

    form.assertEmpty();
  });

  it('should not clear the form if title is empty', () => {
    form.fill({ ...newMovie, title: '' });
    form.submit();

    form.field('description').should('have.value', newMovie.description);
    form.field('imgUrl').should('have.value', newMovie.imgUrl);
    form.field('imdbId').should('have.value', newMovie.imdbId);
  });

  it('should not clear the form if imgUrl is empty', () => {
    form.fill({ ...newMovie, imgUrl: '' });
    form.submit();

    form.field('description').should('have.value', newMovie.description);
    form.field('title').should('have.value', newMovie.title);
    form.field('imdbId').should('have.value', newMovie.imdbId);
  });

  it('should not clear the form if imdbId is empty', () => {
    form.fill({ ...newMovie, imdbId: '' });
    form.submit();

    form.field('description').should('have.value', newMovie.description);
    form.field('title').should('have.value', newMovie.title);
    form.field('imgUrl').should('have.value', newMovie.imgUrl);
  });

  it('should not have errors after a successful submission', () => {
    form.assertNoErrors();
  });

  it('should add a movie with correct data', () => {
    form.fill({ ...newMovie });
    form.submit();

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
    form.fill({ ...newMovie });

    cy.window().should('not.have.prop', 'beforeReload');

    // eslint-disable-next-line no-param-reassign
    cy.window().then(w => (w.beforeReload = true));

    form.submit();

    cy.window().should('have.prop', 'beforeReload', true);
  });

  it('should clean the form after adding a movie', () => {
    form.fill({ ...newMovie });
    form.submit();

    form.field('title').should('be.empty');
    form.field('description').should('be.empty');
    form.field('imgUrl').should('be.empty');
    form.field('imdbId').should('be.empty');
  });

  it('should add multiple movies', () => {
    form.fill({ ...movies[0] });
    form.submit();

    form.fill({ ...movies[1] });
    form.submit();

    form.fill({ ...movies[2] });
    form.submit();

    page.getMovies().should('have.length', 3);
  });
});
