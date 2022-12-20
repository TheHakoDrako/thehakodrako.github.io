function navList() {
	var $this = this;
	var $a = $this.find('a');
	var b = [];

	$a.each(function () {
		var $this = this;
		var indent = Math.max(0, $this.parents('li').length - 1);
		var href = $this.getAttribute('href');
		var target = $this.getAttribute('target');

		b.push(
			`<a class="link depth-${indent}"${(typeof target !== 'undefined' && target != '') ? ' target="' + target + '"' : ''}${(typeof href !== 'undefined' && href != '') ? ' href="' + href + '"' : ''}><span class="indent-${indent}"></span>${$this.textContent}</a>`
		);
	});

	return b.join('');
}


/**
 * Panel-ify an element.
 * @param {object} userConfig User config.
 * @return {jQuery} jQuery object.
 */

function panel(userConfig) {
	// No elements?
	if (this.length == 0)
		return this;

	// Multiple elements?
	if (this.length > 1) {
		for (var i = 0; i < this.length; i++)
			this[i].panel(userConfig);

		return this;
	}

	// Vars.
	var $this = this,
		$body = document.querySelector('body'),
		$window = window,
		id = this.getAttribute('id'),
		config;

	// Config.
	config = Object.assign(
		{
			// Delay.
			delay: 0,

			// Hide panel on link click.
			hideOnClick: false,

			// Hide panel on escape keypress.
			hideOnEscape: false,

			// Hide panel on swipe.
			hideOnSwipe: false,

			// Reset scroll position on hide.
			resetScroll: false,

			// Reset forms on hide.
			resetForms: false,

			// Side of viewport the panel will appear.
			side: null,

			// Target element for "class".
			target: this,

			// Class to toggle.
			visibleClass: 'visible'
		},
		userConfig
	);

	// Expand "target" if it's not a jQuery object already.
	if (typeof config.target != 'object') config.target = document.querySelector(config.target);

	// Panel.

	// Methods.
	this._hide = function (event) {
		// Already hidden? Bail.
		if (!config.target.classList.contains(config.visibleClass)) return;

		// If an event was provided, cancel it.
		if (event) {
			event.preventDefault();
			event.stopPropagation();
		}

		// Hide.
		config.target.classList.remove(config.visibleClass);

		// Post-hide stuff.
		window.setTimeout(function () {
			// Reset scroll position.
			if (config.resetScroll) $this.scrollTop = 0;

			// Reset forms.
			if (config.resetForms) {
				var forms = $this.querySelectorAll('form');
				forms.forEach(function (form) {
					form.reset();
				});
			}
		}, config.delay);
	};

	// Vendor fixes.
	this.style.msOverflowStyle = '-ms-autohiding-scrollbar';
	this.style.webkitOverflowScrolling = 'touch';

	// Hide on click.
	if (config.hideOnClick) {
		this.querySelectorAll('a').forEach(a => {
			a.style.webkitTapHighlightColor = 'rgba(0,0,0,0)';
		});

		this.addEventListener('click', event => {
			const a = event.target.closest('a');
			if (!a) return;

			const href = a.getAttribute('href');
			const target = a.getAttribute('target');

			if (!href || href === '#' || href === '' || href === '#' + id) return;

			// Cancel original event.
			event.preventDefault();
			event.stopPropagation();

			// Hide panel.
			this._hide();

			// Redirect to href.
			setTimeout(() => {
				if (target === '_blank') {
					window.open(href);
				} else {
					window.location.href = href;
				}
			}, config.delay + 10);
		});
	}

	// Event: Touch stuff.
	this.addEventListener('touchstart', event => {
		this.touchPosX = event.touches[0].pageX;
		this.touchPosY = event.touches[0].pageY;
	});

	this.addEventListener('touchmove', event => {
		if (this.touchPosX === null || this.touchPosY === null) return;

		const diffX = this.touchPosX - event.touches[0].pageX;
		const diffY = this.touchPosY - event.touches[0].pageY;
		const th = this.offsetHeight;
		const ts = (this.scrollHeight - this.scrollTop);
	});

	// Hide on swipe?
	if (config.hideOnSwipe) {
		let result = false;
		const boundary = 20;
		const delta = 50;

		switch (config.side) {
			case 'left':
				result = (diffY < boundary && diffY > (-1 * boundary)) && (diffX > delta);
				break;
			case 'right':
				result = (diffY < boundary && diffY > (-1 * boundary)) && (diffX < (-1 * delta));
				break;
			case 'top':
				result = (diffX < boundary && diffX > (-1 * boundary)) && (diffY > delta);
				break;
			case 'bottom':
				result = (diffX < boundary && diffX > (-1 * boundary)) && (diffY < (-1 * delta));
				break;
			default:
				break;
		}

		if (result) {
			this.touchPosX = null;
			this.touchPosY = null;
			this._hide();
			return false;
		}
	}

	// Prevent vertical scrolling past the top or bottom.
	if (
		(this.scrollTop() < 0 && diffY < 0) ||
		(ts > (th - 2) && ts < (th + 2) && diffY > 0)
	) {
		event.preventDefault();
		event.stopPropagation();
	}

	// Event: Prevent certain events inside the panel from bubbling.
	this.addEventListener('click', function (event) {
		event.stopPropagation();
	});
	this.addEventListener('touchend', function (event) {
		event.stopPropagation();
	});
	this.addEventListener('touchstart', function (event) {
		event.stopPropagation();
	});
	this.addEventListener('touchmove', function (event) {
		event.stopPropagation();
	});

	// Event: Hide panel if a child anchor tag pointing to its ID is clicked.
	this.addEventListener('click', function (event) {
		var target = event.target;
		if (target.tagName === 'A' && target.getAttribute('href') === '#' + id) {
			event.preventDefault();
			event.stopPropagation();
			config.target.classList.remove(config.visibleClass);
		}
	});

	// Body.

	// Event: Hide panel on body click/tap.
	document.body.addEventListener('click', function (event) {
		this._hide(event);
	});
	document.body.addEventListener('touchend', function (event) {
		this._hide(event);
	});

	// Event: Toggle.
	document.body.addEventListener('click', function (event) {
		var target = event.target;
		if (target.tagName === 'A' && target.getAttribute('href') === '#' + id) {
			event.preventDefault();
			event.stopPropagation();
			config.target.classList.toggle(config.visibleClass);
		}
	});

	// Window.

	// Event: Hide on ESC.
	if (config.hideOnEscape) {
		window.addEventListener('keydown', function (event) {
			if (event.keyCode === 27) {
				this._hide(event);
			}
		});
	}

	return this;

/**
* Apply "placeholder" attribute polyfill to one or more forms.
* @return {jQuery} jQuery object.
*/

function placeholder() {
		// Browser natively supports placeholders? Bail.
		if (typeof (document.createElement('input')).placeholder != 'undefined') {
			return this;
		}

		// No elements?
		if (this.length == 0) {
			return this;
		}

		// Multiple elements?
		if (this.length > 1) {
			for (var i = 0; i < this.length; i++) {
				placeholder.call(this[i]);
			}
			return this;
		}

		// Vars.
		var that = this;

		// Text, TextArea.
		this.querySelectorAll('input[type=text],textarea')
			.forEach(function (el) {
				if (el.value == '' || el.value == el.getAttribute('placeholder')) {
					el.classList.add('polyfill-placeholder');
					el.value = el.getAttribute('placeholder');
				}
			})
			.forEach(function (el) {
				el.addEventListener('blur', function () {
					if (el.getAttribute('name').match(/-polyfill-field$/)) {
						return;
					}
					if (el.value == '') {
						el.classList.add('polyfill-placeholder');
						el.value = el.getAttribute('placeholder');
					}
				});
			})
			.forEach(function (el) {
				el.addEventListener('focus', function () {
					if (el.getAttribute('name').match(/-polyfill-field$/)) {
						return;
					}
					if (el.value == el.getAttribute('placeholder')) {
						el.classList.remove('polyfill-placeholder');
						el.value = '';
					}
				});
			});
	}

	// Password.
	document.querySelectorAll('input[type=password]').forEach(function (i) {
		var x = document.createElement('div');
		x.innerHTML = i.cloneNode(true).outerHTML.replace(/type="password"/i, 'type="text"').replace(/type=password/i, 'type=text');
		x = x.firstChild;

		if (i.hasAttribute('id')) {
			x.setAttribute('id', i.getAttribute('id') + '-polyfill-field');
		}
		if (i.hasAttribute('name')) {
			x.setAttribute('name', i.getAttribute('name') + '-polyfill-field');
		}
		x.classList.add('polyfill-placeholder');
		x.value = x.getAttribute('placeholder');
		i.insertAdjacentElement('afterend', x);

		if (i.value === '') {
			i.style.display = 'none';
		} else {
			x.style.display = 'none';
		}

		i.addEventListener('blur', function (event) {
			event.preventDefault();

			var x = i.parentElement.querySelector('input[name=' + i.getAttribute('name') + '-polyfill-field]');

			if (i.value === '') {
				i.style.display = 'none';
				x.style.display = '';
			}
		});

		x.addEventListener('focus', function (event) {
			event.preventDefault();

			var i = x.parentElement.querySelector('input[name=' + x.getAttribute('name').replace('-polyfill-field', '') + ']');

			x.style.display = 'none';
			i.style.display = '';
			i.focus();
		});

		x.addEventListener('keypress', function (event) {
			event.preventDefault();
			x.value = '';
		});
	});

	const form = document.querySelector('form');

	form.addEventListener('submit', function () {
		const inputs = form.querySelectorAll('input[type=text], input[type=password], textarea');
		inputs.forEach(input => {
			if (input.getAttribute('name').match(/-polyfill-field$/)) {
				input.setAttribute('name', '');
			}
			if (input.value === input.getAttribute('placeholder')) {
				input.classList.remove('polyfill-placeholder');
				input.value = '';
			}
		});
	});

	form.addEventListener('reset', function (event) {
		event.preventDefault();
		const select = form.querySelector('select');
		select.value = select.querySelector('option:first-child').value;
		const inputs = form.querySelectorAll('input, textarea');
		inputs.forEach(input => {
			input.classList.remove('polyfill-placeholder');
			switch (input.type) {
				case 'submit':
				case 'reset':
					break;
				case 'password':
					input.value = input.getAttribute('defaultValue');
					const polyfillField = form.querySelector(`input[name=${input.getAttribute('name')}-polyfill-field]`);
					if (input.value === 'jerodatadev@gmail.com') {
						input.style.display = 'none';
						polyfillField.style.display = 'block';
					} else {
						input.style.display = 'block';
						polyfillField.style.display = 'none';
					}
					break;
				case 'checkbox':
				case 'radio':
					input.checked = input.getAttribute('defaultValue') === 'true';
					break;
				case 'text':
				case 'textarea':
					input.value = input.getAttribute('defaultValue');
					if (input.value === '') {
						input.classList.add('polyfill-placeholder');
						input.value = input.getAttribute('placeholder');
					}
					break;
				default:
					input.value = input.getAttribute('defaultValue');
					break;
			}
		});
	});

	/**
	 * Moves elements to/from the first positions of their respective parents.
	 * @param {jQuery} $elements Elements (or selector) to move.
	 * @param {bool} condition If true, moves elements to the top. Otherwise, moves elements back to their original locations.
	 */

	function prioritize(elements, condition) {
		const key = '__prioritize';
	  
		// Expand elements if it's not already a NodeList.
		if (!(elements instanceof NodeList)) {
		  elements = document.querySelectorAll(elements);
		}
	  
		// Step through elements.
		elements.forEach(function (element) {
		  let p, parent = element.parentNode;
	  
		  // No parent? Bail.
		  if (!parent) return;
	  
		  // Not moved? Move it.
		  if (!element.dataset[key]) {
			// Condition is false? Bail.
			if (!condition) return;
	  
			// Get placeholder (which will serve as our point of reference for when this element needs to move back).
			p = element.previousElementSibling;
	  
			// Couldn't find anything? Means this element's already at the top, so bail.
			if (!p) return;
	  
			// Move element to top of parent.
			parent.insertBefore(element, parent.firstChild);
	  
			// Mark element as moved.
			element.dataset[key] = p;
		  }
	  
		  // Moved already?
		  else {
			// Condition is true? Bail.
			if (condition) return;
	  
			p = element.dataset[key];
	  
			// Move element back to its original location (using our placeholder).
			p.insertAdjacentElement('afterend', element);
	  
			// Unmark element as moved.
			delete element.dataset[key];
		  }
		});
	}
};
	  