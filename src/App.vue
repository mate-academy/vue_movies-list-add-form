<script setup>
// import movies from './data/movies.json';
</script>

<template>
  <!-- eslint-disable max-len -->
  <div class="page">
    <div class="page-content">
      <div class="movies">
        <div class="card" data-cy="movie">
          <div class="card-image">
            <figure class="image is-4by3">
              <img
                src="https://m.media-amazon.com/images/M/MV5BMjEwMzMxODIzOV5BMl5BanBnXkFtZTgwNzg3OTAzMDI@._V1_SY1000_SX675_AL_.jpg"
                alt="Film logo"
              />
            </figure>
          </div>
          <div class="card-content">
            <div class="media">
              <div class="media-left">
                <figure class="image is-48x48">
                  <img src="/images/imdb-logo.jpeg" alt="imdb" />
                </figure>
              </div>
              <div class="media-content">
                <p class="title is-8">Rogue One</p>
              </div>
            </div>
            <div class="content">
              The daughter of an Imperial scientist joins the Rebel Alliance in
              a risky move to steal the Death Star plans.
              <br />
              <a href="https://www.imdb.com/title/tt3748528">IMDB</a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="sidebar">
      <form>
        <h2 class="title">Add a movie</h2>
        <div class="field">
          <label class="label" for="title-20492567846734056">Title</label>
          <div class="control">
            <input
              id="title-20492567846734056"
              data-cy="movie-form__title"
              class="input is-danger"
              placeholder="Enter Title"
            />
          </div>
          <p class="help is-danger">Title is required</p>
        </div>

        <div class="field">
          <label class="label" for="description-07461245336845779">
            Description
          </label>
          <div class="control">
            <textarea
              id="description-07461245336845779"
              data-cy="movie-form__description"
              class="textarea"
              placeholder="Enter Description"
            ></textarea>
          </div>
        </div>

        <div class="field">
          <label class="label" for="imgUrl-03780931512410235">Image URL</label>
          <div class="control">
            <input
              id="imgUrl-03780931512410235"
              data-cy="movie-form__imgUrl"
              class="input is-danger"
              placeholder="Enter image URL"
            />
          </div>
          <p class="help is-danger">Image URL is required</p>
        </div>

        <div class="field">
          <label class="label" for="imdbId-7255654555627964">Imdb ID</label>
          <div class="control">
            <input
              id="imdbId-7255654555627964"
              data-cy="movie-form__imdbId"
              class="input is-danger"
              placeholder="Enter Imdb ID"
            />
          </div>
          <p class="help is-danger">Imdb ID is required</p>
        </div>

        <div class="field is-grouped">
          <div class="control">
            <button
              type="submit"
              data-cy="movie-form__submit-button"
              class="button is-link"
            >
              Add
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
