/**
 * bBlocks Cache — admin bar menu. The menu links work without this file (admin-post.php, then back to the
 * page); with it they run through admin-ajax.php and the menu updates in place, without a reload.
 * Data: window.bBlocksCacheMenu = { ajaxUrl, nonce, rebuild, strings } (includes/Performance.php, cache_menu_assets()).
 */
(function () {
	var data = window.bBlocksCacheMenu;
	if (!data || !window.fetch) {
		return;
	}
	var item = function (id) { return document.getElementById('wp-admin-bar-bblocks-cache-' + id); };
	// This page's address, from whichever of its links the menu printed.
	var pageUrl = function () {
		var found = '';
		['page', 'clear-page', 'never', 'allow'].forEach(function (id) {
			var a = !found && item(id) && item(id).querySelector('a');
			if (a) {
				found = new URL(a.href, location.href).searchParams.get('url') || '';
			}
		});
		return found;
	};

	var toast;
	// stay: "Working…" remains until the answer replaces it (a preload can take 25 s).
	var say = function (text, stay) {
		if (!toast) {
			toast = document.createElement('div');
			toast.className = 'bblocks-cache-toast';
			toast.setAttribute('role', 'status');
			document.body.appendChild(toast);
		}
		toast.textContent = text;
		toast.hidden = false;
		clearTimeout(say.timer);
		if (!stay) {
			say.timer = setTimeout(function () { toast.hidden = true; }, 4000);
		}
	};
	// One action at a time: a second click while one runs would only find "a preload is already running".
	var busy = false;

	// Which page items each state offers (the same rules admin_bar_cache_menu() prints with).
	var offers = {
		page(s) { return 'not' === s.state || 'partial' === s.state; },
		'clear-page'(s) { return 'cached' === s.state || 'partial' === s.state; },
		never(s) { return 'no' !== s.state; },
		allow(s) { return 'no' === s.state && s.exact; },
	};

	var show = function (status, summary) {
		if (summary && item('summary')) {
			item('summary').querySelector('.ab-item').textContent = summary;
		}
		var line = item('status');
		if (!status || !line) {
			return;
		}
		line.className = 'bblocks-cache-' + status.state;
		line.querySelector('.ab-item').textContent = status.text;
		var focused = document.activeElement;
		Object.keys(offers).forEach(function (id) {
			if (item(id)) {
				item(id).classList.toggle('bblocks-cache-hidden', !offers[id](status));
			}
		});
		// The link just used may now be hidden: keep keyboard focus on the first page item still offered.
		if (focused && focused.closest && focused.closest('#wp-admin-bar-bblocks-cache') && !focused.offsetParent) {
			var next = Object.keys(offers).map(item).filter(function (li) { return li && !li.classList.contains('bblocks-cache-hidden'); })[0];
			var a = next && next.querySelector('a');
			if (a) {
				a.focus();
			}
		}
	};

	var send = function (action, url) {
		var body = new URLSearchParams({ action: 'bblocks_cache', _wpnonce: data.nonce, do: action, url: url || '' });
		if ('status' !== action) {
			busy = true;
			say(data.strings.working, true);
		}
		return fetch(data.ajaxUrl, { method: 'POST', credentials: 'same-origin', body })
			.then(function (r) {
				// The page was open longer than the security token lasts (or the login ended).
				if (403 === r.status) {
					throw new Error('expired');
				}
				return r.json();
			})
			.then(function (r) {
				if (!r || !r.success) {
					throw new Error('failed');
				}
				// A status read sent before an action (the editor's after-save poll) answers with the state before it.
				if ('status' === action) {
					if (!busy) {
						show(r.data.status, r.data.summary);
					}
					return true;
				}
				show(r.data.status, r.data.summary);
				if ('preload' === action) {
					var c = r.data.counts || [0, 0, 0];
					say(r.data.ok ? data.strings.preload.replace('%1$d', c[0]).replace('%2$d', c[1]).replace('%3$d', c[2]) : data.strings.busy);
					return;
				}
				say(r.data.ok ? data.strings[action] : data.strings.failed);
			})
			.catch(function (e) {
				if ('status' !== action) {
					say('expired' === e.message ? data.strings.expired : data.strings.error);
				}
				return false;
			})
			.then(function (ok) {
				if ('status' !== action) {
					busy = false;
				}
				// false: the request failed (for a status read: stop polling).
				return false !== ok;
			});
	};

	// The menu's own links only (admin-post.php?action=bblocks_cache…); "Cache settings" stays a normal link.
	document.addEventListener('click', function (e) {
		var a = e.target.closest && e.target.closest('#wp-admin-bar-bblocks-cache a');
		if (!a) {
			return;
		}
		var link = new URL(a.href, location.href);
		if ('bblocks_cache' !== link.searchParams.get('action')) {
			return;
		}
		e.preventDefault();
		if (busy) {
			return;
		}
		var action = link.searchParams.get('do');
		// These change a setting: ask first.
		if (('never' === action || 'allow' === action) && !window.confirm('never' === action ? data.strings.askNever : data.strings.askAllow)) {
			return;
		}
		// "Clear entire cache" and "Preload all pages now" carry no page: read this page's line again with them.
		send(action, link.searchParams.get('url') || pageUrl());
	});

	// Block editor: after Save/Update, "Rebuild pages after saving" may have changed the page — read its status again;
	// after the first Publish of a draft, the page items appear.
	window.addEventListener('load', function () {
		if (!window.wp || !wp.data || !wp.data.select || !wp.data.select('core/editor')) {
			return;
		}
		var saving = false;
		wp.data.subscribe(function () {
			var editor = wp.data.select('core/editor');
			var now = editor.isSavingPost() && !editor.isAutosavingPost();
			// A published post, or a draft this save just published (its page items were printed hidden, without an address).
			if (saving && !now && item('status') && (pageUrl() || editor.isCurrentPostPublished())) {
				// The address after this save (the slug may have changed): the menu's links follow it.
				var url = editor.getPermalink() || pageUrl();
				Object.keys(offers).forEach(function (id) {
					var a = item(id) && item(id).querySelector('a');
					if (a) {
						var link = new URL(a.href, location.href);
						link.searchParams.set('url', url);
						a.href = link.toString();
					}
				});
				send('status', url);
				// "Rebuild pages after saving" builds the page again in the background (WP-Cron, so the time varies):
				// look again every 5 s until it shows as cached, for up to 45 s. With that setting off, once is enough.
				if (data.rebuild) {
					var tries = 0;
					var poll = function () {
						send('status', url).then(function (ok) {
							var line = item('status');
							// An expired session or a server error will not fix itself in 5 s.
							if (!ok) {
								return;
							}
							// Cached, or never cacheable (nothing will build it): stop looking.
							if (line && -1 === ['bblocks-cache-cached', 'bblocks-cache-no'].indexOf(line.className) && ++tries < 9) {
								setTimeout(poll, 5000);
							}
						});
					};
					setTimeout(poll, 5000);
				}
			}
			saving = now;
		});
	});
})();