const assert = require('assert');

Feature("Liking Movies");

Before(({ I }) => {
	I.amOnPage("/#/like");
});

Scenario("showing empty liked movies", ({ I }) => {
	I.seeElement("#query");

	I.see("Tidak ada film untuk ditampilkan", ".movie-item__not__found");
});

Scenario('liking one movie', async ({ I }) => {
	I.see('Tidak ada film untuk ditampilkan', '.movie-item__not__found');

	I.amOnPage('/');

	// ? mengambil elemen pertama
	I.seeElement('.movie__title a');
	const firstMovie = locate('.movie__title a').first();
	const firstMovieTitle = await I.grabTextFrom(firstMovie);
	I.click(firstMovie);

	// ? Menyukai satu film
	I.seeElement('#likeButton');
	I.click('#likeButton');

	// ? Menuju like page
	I.amOnPage('/#/like');
	I.seeElement('.movie-item');
	const likedMovieTitle = await I.grabTextFrom('.movie__title');

	// ? Fungsi perbandingan untuk judul film
	assert.strictEqual(firstMovieTitle, likedMovieTitle);
});

// ? Mencari Film
Scenario("searching movies", async ({ I }) => {
	I.see("Tidak ada film untuk ditampilkan", ".movie-item__not__found");

	I.amOnPage("/");

	I.seeElement(".movie__title a");

	const titles = [];
	// ? Menyukai 3 film
	for (let i = 1; i <= 3; i++) {
		I.click(locate(".movie__title a").at(i));
		I.seeElement("#likeButton");
		I.click("#likeButton");

		// eslint-disable-next-line no-await-in-loop
		titles.push(await I.grabTextFrom(".movie__title"));
		I.amOnPage("/");
	}

	I.amOnPage("/#/like");
	I.seeElement("#query");

	const visibleLikedMovies = await I.grabNumberOfVisibleElements(
		".movie-item",
	);

	// ? Memeriksa dan memastikan jumlah film yang disukai
	assert.strictEqual(titles.length, visibleLikedMovies);

	// ? Mengambil potongan judul
	const searchQuery = titles[1].substring(1, 3);

	// ? Mengisi query pencarian
	I.fillField("#query", searchQuery);
	I.pressKey("Enter");

	// ? Mendapatkan daftar film yang sesuai dengan searchQuery
	const matchingMovies = titles.filter(
		(title) => title.indexOf(searchQuery) !== -1,
	);

	const visibleSearchedLikedMovies = await I.grabNumberOfVisibleElements(
		".movie-item",
	);

	// ? Memeriksa dan memastikan jumlah film yang muncul
	assert.strictEqual(matchingMovies.length, visibleSearchedLikedMovies);

	// ? Memeriksa judul-judul film yang diperoleh
	for (let i = 0; i < matchingMovies.length; i++) {
		// eslint-disable-next-line no-await-in-loop
		const visibleTitle = await I.grabTextFrom(
			locate(".movie__title").at(i + 1),
		);

		// ? Perbandingan judul film
		assert.strictEqual(matchingMovies[i], visibleTitle);
	}
});
