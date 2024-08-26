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
  error: name => form.field(name).parents('.field').find('.help.is-danger'),
  submitButton: () => cy.byDataCy(`movie-form__submit-button`),
  cancelButton: () => cy.byDataCy(`movie-form__cancel-button`),

  submit: () => form.submitButton().click({ force: true }),
  reset: () => form.cancelButton().click({ force: true }),

  fill: movie => {
    const empty = '{selectAll}{del}';

    form.field('title').type(movie.title || empty);
    form.field('description').type(movie.description || empty);
    form.field('imgUrl').type(movie.imgUrl || empty);
    form.field('imdbId').type(movie.imdbId || empty);
  },

  assertFieldValue: (name, value) =>
    form.field(name).should('have.value', value),

  assertsValues: movie => {
    form.assertFieldValue('title', movie.title);
    form.assertFieldValue('description', movie.description);
    form.assertFieldValue('imgUrl', movie.imgUrl);
    form.assertFieldValue('imdbId', movie.imdbId);
  },

  assertEmpty() {
    form.field('title').should('be.empty');
    form.field('description').should('be.empty');
    form.field('imgUrl').should('be.empty');
    form.field('imdbId').should('be.empty');
  },

  assertErrorCount(count) {
    cy.get('form .help.is-danger').should('have.length', count);
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
    it('list has no movies', () => {
      list.getMovies().should('have.length', 0);
    });

    it('form is empty', () => {
      form.assertEmpty();
    });

    it('form has no errors', () => {
      form.assertErrorCount(0);
    });

    it('title can be entered', () => {
      form.field('title').type('The Umbrella Academy');
      form.assertFieldValue('title', 'The Umbrella Academy');
    });

    it('description can be entered', () => {
      form.field('description').type('Some description');
      form.assertFieldValue('description', 'Some description');
    });

    it('imgUrl can be entered', () => {
      const URL = 'https://www.example.com/image.jpg';

      form.field('imgUrl').type(URL);
      form.assertFieldValue('imgUrl', URL);
    });

    it('imdbId can be entered', () => {
      form.field('imdbId').type('tt1312171');
      form.assertFieldValue('imdbId', 'tt1312171');
    });

    it('empty title error appears only on blur', () => {
      form.field('title').focus();
      form.error('title').should('not.exist');

      form.field('title').type('1{backspace}');
      form.error('title').should('not.exist');

      form.field('title').blur();
      form.error('title').should('exist');
    });

    it('empty description error never appears', () => {
      form.field('description').focus();
      form.field('description').type('1{backspace}');
      form.field('description').blur();

      form.error('description').should('not.exist');
    });

    it('empty imgUrl error appears only on blur', () => {
      form.field('imgUrl').focus();
      form.error('imgUrl').should('not.exist');

      form.field('imgUrl').type('1{backspace}');
      form.error('imgUrl').should('not.exist');

      form.field('imgUrl').blur();
      form.error('imgUrl').should('exist');
    });

    it('empty imdbId error appears only on blur', () => {
      form.field('imdbId').focus();
      form.error('imdbId').should('not.exist');

      form.field('imdbId').type('1{backspace}');
      form.error('imdbId').should('not.exist');

      form.field('imdbId').blur();
      form.error('imdbId').should('exist');
    });
  });

  describe('on submit with correct values', () => {
    beforeEach(() => {
      form.fill({ ...newMovie });
    });

    it('movie is added', () => {
      form.submit();

      list.getMovies().should('have.length', 1);
      list.assertMovieAt(0, newMovie);
    });

    it('form is cleared', () => {
      form.submit();

      form.assertEmpty();
      form.assertErrorCount(0);
    });

    it('page is not reloaded', () => {
      // eslint-disable-next-line no-param-reassign
      cy.window().then(w => (w.beforeReload = true));
      form.submit();

      cy.window().should('have.prop', 'beforeReload', true);
    });

    it('can add more movies', () => {
      form.fill({ ...movies[0] });
      form.submit();

      form.fill({ ...movies[1] });
      form.submit();

      form.fill({ ...movies[2] });
      form.submit();

      list.getMovies().should('have.length', 3);
    });
  });

  describe('on submit with missing values', () => {
    it('errors are shown for all empty required fields', () => {
      form.fill({ title: '', description: '', imgUrl: '', imdbId: '' });
      form.submit();

      form.assertErrorCount(3);
      form.error('title').should('exist');
      form.error('imgUrl').should('exist');
      form.error('imdbId').should('exist');
    });

    it('movie is not added', () => {
      form.fill({ ...newMovie, title: '' });
      form.submit();

      list.getMovies().should('have.length', 0);
    });

    it('page is not reloaded', () => {
      // eslint-disable-next-line no-param-reassign
      cy.window().then(w => (w.beforeReload = true));

      form.fill({ ...newMovie, title: '' });
      form.submit();

      cy.window().should('have.prop', 'beforeReload', true);
    });

    it('form is not cleared', () => {
      const values = { ...newMovie, title: '' };

      form.fill(values);
      form.submit();

      form.assertsValues(values);

      form.assertErrorCount(1);
      form.error('title').should('exist');
    });

    it('empty imgUrl is handled correctly', () => {
      const values = { ...newMovie, imgUrl: '' };

      form.fill(values);
      form.submit();

      form.assertsValues(values);

      form.assertErrorCount(1);
      form.error('imgUrl').should('exist');
    });

    it('empty imdbId is handled correctly', () => {
      const values = { ...newMovie, imdbId: '' };

      form.fill(values);
      form.submit();

      form.assertsValues(values);

      form.assertErrorCount(1);
      form.error('imdbId').should('exist');
    });
  });
});
