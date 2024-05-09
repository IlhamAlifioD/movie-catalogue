import { itActsAsFavoriteMovieModel } from "./contracts/favoriteMovieContract";
import FavoriteMovieIdb from "../src/scripts/data/favorite-movie-idb";

describe("Favorite Movie Idb Contract Test Implementation", () => {
     // ? menghapus film apa pun yang sudah tersimpan sebelumnya
	afterEach(async () => {
		(await FavoriteMovieIdb.getAllMovies()).forEach(async (movie) => {
			await FavoriteMovieIdb.deleteMovie(movie.id);
		});
	});

     // ? Mendelegasikan tesnya
	itActsAsFavoriteMovieModel(FavoriteMovieIdb);
});
