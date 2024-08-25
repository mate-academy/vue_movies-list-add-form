/* eslint-disable max-len */
import movies from '../../src/data/movies.json';

const newMovie = {
  title: 'Inside Out',
  description:
    'After young Riley is uprooted from her Midwest life and moved to San Francisco, her emotions - Joy, Fear, Anger, Disgust and Sadness - conflict on how best to navigate a new city, house, and school.',
  imgUrl:
    'https://m.media-amazon.com/images/M/MV5BOTgxMDQwMDk0OF5BMl5BanBnXkFtZTgwNjU5OTg2NDE@._V1_QL75_UX380_CR0,0,380,562_.jpg',
  imdbId: 'tt2096673',
};

const SELECTED_CLASS = 'has-background-grey';

const list = {
  getMovies: () => cy.byDataCy('movie'),
  selectMovie: index =>
    list.getMovies().eq(index).byDataCy('movie__select-button').click(),
  unselectMovie: index =>
    list.getMovies().eq(index).byDataCy('movie__unselect-button').click(),
  deleteMovie: index =>
    list.getMovies().eq(index).byDataCy('movie__delete-button').click(),

  assertSelected: index =>
    list.getMovies().eq(index).should('have.class', SELECTED_CLASS),
  assertNotSelected: index =>
    list.getMovies().eq(index).should('not.have.class', SELECTED_CLASS),
  assertSelectedCount: count => {
    cy.get(`[data-cy="movie"].${SELECTED_CLASS}`).should('have.length', count);
  },

  assertMovieAt: (index, movie) => {
    list
      .getMovies()
      .eq(index)
      .byDataCy('movie__title')
      .should('have.text', movie.title);
    list
      .getMovies()
      .eq(index)
      .byDataCy('movie__description')
      .should('contain', movie.description);
    list
      .getMovies()
      .eq(index)
      .byDataCy('movie__link')
      .should(
        'have.attr',
        'href',
        `https://www.imdb.com/title/${movie.imdbId}`,
      );
    list
      .getMovies()
      .eq(index)
      .byDataCy('movie__image')
      .should('have.attr', 'src', movie.imgUrl);
  },
};

const form = {
  field: name => cy.byDataCy(`movie-form__${name}`),
  submitButton: () => cy.byDataCy(`movie-form__submit-button`),
  cancelButton: () => cy.byDataCy(`movie-form__cancel-button`),
  error: name => form.field(name).parents('.field').find('.help.is-danger'),

  submit: () => form.submitButton().click({ force: true }),
  reset: () => form.cancelButton().click({ force: true }),

  fill: movie => {
    const empty = '{selectAll}{del}';

    form.field('title').type(movie.title || empty);
    form.field('description').type(movie.description || empty);
    form.field('imgUrl').type(movie.imgUrl || empty);
    form.field('imdbId').type(movie.imdbId || empty);
  },

  assertValue: (name, value) => form.field(name).should('have.value', value),

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

let failed = false;

Cypress.on('fail', e => {
  failed = true;
  throw e;
});

describe('', () => {
  beforeEach(() => {
    if (failed) Cypress.runner.stop();
    cy.visit('/');
  });

  describe('by default', () => {
    it('should not have movies', () => {
      list.getMovies().should('have.length', 0);
    });

    it('should be empty', () => {
      form.assertEmpty();
    });

    it('should not have errors', () => {
      form.assertNoErrors();
    });

    it('should allow to enter a title', () => {
      form.field('title').type('The Umbrella Academy');
      form.assertValue('title', 'The Umbrella Academy');
    });

    it('should allow to enter a description', () => {
      form.field('description').type('Some description');
      form.assertValue('description', 'Some description');
    });

    it('should allow to enter an imgUrl', () => {
      const URL = 'https://www.example.com/image.jpg';

      form.field('imgUrl').type(URL);
      form.assertValue('imgUrl', URL);
    });

    it('should allow to enter an imdbId', () => {
      form.field('imdbId').type('tt1312171');
      form.assertValue('imdbId', 'tt1312171');
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
  });

  describe('on success', () => {
    it('should clear the form', () => {
      form.fill({ ...newMovie });
      form.submit();

      form.assertEmpty();
      form.assertNoErrors();
    });

    it('should add a movie', () => {
      form.fill({ ...newMovie });
      form.submit();

      list.getMovies().should('have.length', 1);
      list.assertMovieAt(0, newMovie);
    });

    it('should not reload the page', () => {
      // eslint-disable-next-line no-param-reassign
      cy.window().then(w => (w.beforeReload = true));

      form.fill({ ...newMovie });
      form.submit();

      cy.window().should('have.prop', 'beforeReload', true);
    });

    it('should allow to add multiple movies', () => {
      form.fill({ ...movies[0] });
      form.submit();

      form.fill({ ...movies[1] });
      form.submit();

      form.fill({ ...movies[2] });
      form.submit();

      list.getMovies().should('have.length', 3);
    });
  });

  describe('on validation error', () => {
    it('should not add a movie', () => {
      form.fill({ ...newMovie, title: '' });
      form.submit();

      list.getMovies().should('have.length', 0);
    });

    it('should not reload the page', () => {
      // eslint-disable-next-line no-param-reassign
      cy.window().then(w => (w.beforeReload = true));

      form.fill({ ...newMovie, title: '' });
      form.submit();

      cy.window().should('have.prop', 'beforeReload', true);
    });

    it('should show all validation errors', () => {
      form.fill({ ...newMovie, title: '', imgUrl: '', imdbId: '' });
      form.submit();

      form.error('title').should('exist');
      form.error('imgUrl').should('exist');
      form.error('imdbId').should('exist');
      form.error('description').should('not.exist');
    });

    it('should not clear the form if title is empty', () => {
      form.fill({ ...newMovie, title: '' });
      form.submit();

      form.assertValue('description', newMovie.description);
      form.assertValue('imgUrl', newMovie.imgUrl);
      form.assertValue('imdbId', newMovie.imdbId);
    });

    it('should not clear the form if imgUrl is empty', () => {
      form.fill({ ...newMovie, imgUrl: '' });
      form.submit();

      form.assertValue('description', newMovie.description);
      form.assertValue('title', newMovie.title);
      form.assertValue('imdbId', newMovie.imdbId);
    });

    it('should not clear the form if imdbId is empty', () => {
      form.fill({ ...newMovie, imdbId: '' });
      form.submit();

      form.assertValue('description', newMovie.description);
      form.assertValue('title', newMovie.title);
      form.assertValue('imgUrl', newMovie.imgUrl);
    });
  });
});
