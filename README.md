# Movies List Add Form

> Here is the [working version](https://mate-academy.github.io/vue_movies-list-add-form/)

You start with an empty movies list a form. Implement adding movies from `src/data/movies.json` or [IMDB](https://www.imdb.com/title/tt1312171). `imgUrl` can taken using `DevTools` -> `Network` -> `Img` -> the first image loaded on the page.

1. Check if `title`, `imgUrl`, `imdbId` are entered when an they loose focus (`@blur`) and show an error message and a red border (`is-danger` class) if field is empty (spaces should be trimmed).
1. The `description` is optional.
1. Disable the submit button until all the required fields are filled.
1. Clear the form after adding a new movie.
1. Errors should not be shown after clearing the form.

## Instructions

- Install Prettier Extention and use this [VSCode settings](https://mate-academy.github.io/fe-program/tools/vscode/settings.json) to enable format on save.
- Open one more terminal and run tests with `npm test` to ensure your solution is correct.
- Replace `<your_account>` with your Github username in the [DEMO LINK](https://<your_account>.github.io/react_movies-list-js/) and add it to the PR description.
