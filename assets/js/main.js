(function () {
	var window = document.querySelector(window),
		body = document.querySelector('body'),
		wrapper = document.querySelector('#wrapper'),
		header = document.querySelector('#header'),
		footer = document.querySelector('#footer'),
		main = document.querySelector('#main'),
		mainArticles = main.querySelectorAll('article');

	// Breakpoints.
	breakpoints({
		xlarge: ['1281px', '1680px'],
		large: ['981px', '1280px'],
		medium: ['737px', '980px'],
		small: ['481px', '736px'],
		xsmall: ['361px', '480px'],
		xxsmall: [null, '360px']
	});

	// Play initial animations on page load.
	window.addEventListener('load', function () {
		setTimeout(function () {
			body.classList.remove('is-preload');
		}, 100);
	});

	// Fix: Flexbox min-height bug on IE.
	if (browser.name == 'ie') {
		var flexboxFixTimeoutId;

		window.addEventListener('resize', function () {
			clearTimeout(flexboxFixTimeoutId);

			flexboxFixTimeoutId = setTimeout(function () {
				if (wrapper.scrollHeight > window.innerHeight)
					wrapper.style.height = 'auto';
				else
					wrapper.style.height = '100vh';
			}, 250);
		});

		window.dispatchEvent(new Event('resize'));
	}

	// Nav.
	var nav = header.querySelector('nav'),
		navLi = nav.querySelectorAll('li');

	// Add "middle" alignment classes if we're dealing with an even number of items.
	if (navLi.length % 2 == 0) {
		nav.classList.add('use-middle');
		navLi[Math.floor(navLi.length / 2)].classList.add('is-middle');
	}

	// Main.
	var delay = 325,
		locked = false;

	// Methods.
	main._show = function (id, initial) {
		var article = mainArticles.filter(function (article) {
			return article.id === id;
		});

		// No such article? Bail.
		if (article.length == 0)
			return;

		// Handle lock.

		// Already locked? Speed through "show" steps w/o delays.
		if (locked || (typeof initial != 'undefined' && initial === true)) {
			// Mark as switching.
			body.classList.add('is-switching');

			// Mark as visible.
			body.classList.add('is-article-visible');

			// Deactivate all articles (just in case one's already active).
			mainArticles.forEach(function (article) {
				article.classList.remove('active');
			});

			// Hide header, footer.
			header.style.display = 'none';
			footer.style.display = 'none';

			// Show main, article.
			main.style.display = '';
			article.style.display = '';

			// Activate article.
			article.classList.add('active');

			// Unlock.
			locked = false;

			// Unmark as switching.
			setTimeout(function () {
				body.classList.remove('is-switching');
			}, (initial ? 1000 : 0));

			return;
		}

		// Lock.
		locked = true;

		// Article already visible? Just swap articles.
		if (body.classList.contains('is-article-visible')) {
			// Deactivate current article.
			var currentArticle = mainArticles.filter(function (article) {
				return article.classList.contains('active');
			});
			currentArticle.classList.remove('active');

			// Show article.
			setTimeout(function () {
				// Hide current article.
				currentArticle.style.display = 'none';

				// Show article.
				article.style.display = '';

				// Activate article.
				article.classList.add('active');

				// Unlock.
				locked = false;
			}, main.dataset.timeout);
		}

		// Otherwise, handle as normal.
		else {
			// Mark as visible.
			body.classList.add('is-article-visible');

			// Show article.
			setTimeout(function () {
				// Hide header, footer.
				header.style.display = 'none';
				footer.style.display = 'none';

				// Show main, article.
				main.style.display = '';
				article.style.display = '';

				// Activate article.
				article.classList.add('active');

				// Unlock.
				locked = false;
			}, delay);
		}
	};

	main._hide = function (addState) {
		// If already hidden, skip.
		if (!body.classList.contains('is-article-visible'))
			return;

		// Add state?
		if (typeof addState != 'undefined'
			&& addState === true)
			history.pushState(null, null, '#');

		// Handle lock.

		// Already locked? Speed through "hide" steps w/o delays.
		if (locked) {

			// Mark as switching.
			document.body.classList.add('is-switching');

			// Deactivate article.
			document.querySelector('.active').classList.remove('active');

			// Hide article, main.
			document.querySelector('.article').style.display = 'none';
			document.querySelector('.main').style.display = 'none';

			// Show footer, header.
			document.querySelector('.footer').style.display = 'block';
			document.querySelector('.header').style.display = 'block';

			// Unmark as visible.
			document.body.classList.remove('is-article-visible');

			// Unlock.
			locked = false;

			// Unmark as switching.
			document.body.classList.remove('is-switching');

			// Window stuff.
			window.scrollTo(0, 0);
			window.dispatchEvent(new Event('resize.flexbox-fix'));

			return;

		}

		// Lock.
		locked = true;

		// Deactivate article.
		document.querySelector('.active').classList.remove('active');

		// Hide article.
		setTimeout(function () {

			// Hide article, main.
			document.querySelector('.article').style.display = 'none';
			document.querySelector('.main').style.display = 'none';

			// Show footer, header.
			document.querySelector('.footer').style.display = 'block';
			document.querySelector('.header').style.display = 'block';

			// Unmark as visible.
			setTimeout(function () {

				document.body.classList.remove('is-article-visible');

				// Window stuff.
				window.scrollTo(0, 0);
				window.dispatchEvent(new Event('resize.flexbox-fix'));

				// Unlock.
				setTimeout(function () {
					locked = false;
				}, delay);

			}, 25);

		}, delay);

		// Articles.
		document.querySelectorAll('.main article').forEach(function (article) {

			// Close.
			const closeButton = document.createElement('div');
			closeButton.classList.add('close');
			closeButton.innerHTML = 'Close';
			article.appendChild(closeButton);

			closeButton.addEventListener('click', function () {
				location.hash = '';
			});

			// Prevent clicks from inside article from bubbling.
			article.addEventListener('click', function (event) {
				event.stopPropagation();
			});

		});

		// Events.
		document.body.addEventListener('click', function (event) {

			// Article visible? Hide.
			if (document.body.classList.contains('is-article-visible')) {
				document.querySelector('.main')._hide(true);
			}
		});

		window.addEventListener('keyup', function (event) {
			switch (event.keyCode) {
				case 27:
					if ($body.classList.contains('is-article-visible')) {
						hideMain(true);
					}
					break;
				default:
					break;
			}
		});

		window.addEventListener('hashchange', function (event) {
			if (location.hash === '' || location.hash === '#') {
				event.preventDefault();
				event.stopPropagation();
				hideMain();
			} else {
				var matchingArticle = [].slice.call($mainArticles).find(function (article) {
					return article.id === location.hash.substr(1);
				});
				if (matchingArticle) {
					event.preventDefault();
					event.stopPropagation();
					showMain(location.hash.substr(1));
				}
			}
		});

		// Scroll restoration
		if ('scrollRestoration' in history) {
			history.scrollRestoration = 'manual';
		} else {
			var oldScrollPos = 0;
			var scrollPos = 0;
			var htmlBody = document.querySelector('html,body');

			window.addEventListener('scroll', function () {
				oldScrollPos = scrollPos;
				scrollPos = htmlBody.scrollTop;
			});

			window.addEventListener('hashchange', function () {
				window.scrollTo(0, oldScrollPos);
			});

		}

		// Initialize
		$main.style.display = 'none';
		[].slice.call($mainArticles).forEach(function (article) {
			article.style.display = 'none';
		});

		if (location.hash !== '' && location.hash !== '#') {
			window.addEventListener('load', function () {
				showMain(location.hash.substr(1), true);
			});
		}

		function hideMain(instant) {
			// Hide main, articles
			$main.style.display = 'none';
			[].slice.call($mainArticles).forEach(function (article) {
				article.style.display = 'none';
			});

			// Remove is-article-visible class
			$body.classList.remove('is-article-visible');

			// Scroll back to top
			window.scrollTo(0, 0);

			// Unmark as visible
			function hideMain(instant) {
				// Hide main, articles
				$main.style.display = 'none';
				[].slice.call($mainArticles).forEach(function (article) {
					article.style.display = 'none';
				});

				// Remove is-article-visible class
				$body.classList.remove('is-article-visible');

				// Scroll back to top
				window.scrollTo(0, 0);

				// Unmark as visible
				if (instant) {
					$body.classList.remove('is-article-visible-instant');
				} else {
					$body.classList.add('is-article-visible-instant');
				}
			}

			function showMain(id, instant) {
				var $article = document.getElementById(id);

				// No article? Bail.
				if (!$article) return;

				// Handle lock.

				// Already locked? Speed through "show" steps w/o delays.
				if ($body.classList.contains('is-article-visible')) {
					// Mark as instant.
					if (instant) $body.classList.add('is-article-visible-instant');

					// Show main, article.
					$main.style.display = '';
					$article.style.display = '';

					// Unlock.
					setTimeout(function () {
						$body.classList.remove('is-article-visible-instant');
					}, delay);

					return;
				}

				// Lock.
				$body.classList.add('is-article-visible');

				// Show main, article.
				$main.style.display = '';
				$article.style.display = '';

				// Unlock.
				setTimeout(function () {
					$body.classList.remove('is-article-visible-instant');
				}, delay);
			}
		}
	}
});  