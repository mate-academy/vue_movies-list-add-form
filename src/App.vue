<script setup>
import { ref } from 'vue';

const movies = ref([]);

const getEmptyValues = () => ({
  title: '',
  description: '',
  imgUrl: '',
  imdbId: '',
});

const getEmptyErrors = () => ({
  title: false,
  imgUrl: false,
  imdbId: false,
});

const values = ref(getEmptyValues());
const errors = ref(getEmptyErrors());

function handleSubmit() {
  errors.value = {
    title: !values.value.title,
    imgUrl: !values.value.imgUrl,
    imdbId: !values.value.imdbId,
  };

  if (Object.values(errors.value).some(Boolean)) {
    return;
  }

  const imdbUrl = `https://www.imdb.com/title/${values.value.imdbId}`;

  movies.value.push({ ...values.value, imdbUrl });
  values.value = getEmptyValues();
}
</script>

<template>
  <!-- eslint-disable max-len -->
  <div class="page">
    <div class="page-content">
      <div class="movies">
        <div
          v-for="movie of movies"
          :key="movie.imdbId"
          class="card"
          data-cy="movie"
        >
          <div class="card-image">
            <figure class="image is-4by3">
              <img
                data-cy="movie__image"
                :src="movie.imgUrl"
                :alt="movie.title"
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
                <p data-cy="movie__title" class="title is-8">
                  {{ movie.title }}
                </p>
              </div>
            </div>

            <div data-cy="movie__description" class="content">
              {{ movie.description }}
              <br />
              <a data-cy="movie__link" :href="movie.imdbUrl"> IMDB </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="sidebar">
      <form @submit.prevent="handleSubmit">
        <h2 class="title">Add a movie</h2>

        <div class="field">
          <label class="label" for="title-20492567846734056">Title</label>
          <div class="control">
            <input
              id="title-20492567846734056"
              data-cy="movie-form__title"
              class="input"
              :class="{ 'is-danger': errors.title }"
              placeholder="Enter Title"
              v-model.trim="values.title"
              @blur="errors.title = !values.title"
            />
          </div>
          <p class="help is-danger" v-if="errors.title">Title is required</p>
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
              v-model.trim="values.description"
            ></textarea>
          </div>
        </div>

        <div class="field">
          <label class="label" for="imgUrl-03780931512410235">Image URL</label>
          <div class="control">
            <input
              id="imgUrl-03780931512410235"
              data-cy="movie-form__imgUrl"
              class="input"
              :class="{ 'is-danger': errors.imgUrl }"
              placeholder="Enter image URL"
              v-model.trim="values.imgUrl"
              @blur="errors.imgUrl = !values.imgUrl"
            />
          </div>
          <p class="help is-danger" v-if="errors.imgUrl">
            Image URL is required
          </p>
        </div>

        <div class="field">
          <label class="label" for="imdbId-7255654555627964">Imdb ID</label>
          <div class="control">
            <input
              id="imdbId-7255654555627964"
              data-cy="movie-form__imdbId"
              class="input"
              :class="{ 'is-danger': errors.imdbId }"
              placeholder="Enter Imdb ID"
              v-model.trim="values.imdbId"
              @blur="errors.imdbId = !values.imdbId"
            />
          </div>
          <p class="help is-danger" v-if="errors.imdbId">Imdb ID is required</p>
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
