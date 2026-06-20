/**
 * Woo Sale Badge — frontend behavior.
 *
 * The block is fully static, server-rendered HTML: all discount math (percentage
 * off, amount saved, sale vs. regular price) happens in render.php. There is no
 * AJAX, no timer, no animation, and no localStorage. This stub exists only to
 * satisfy the bBlocks `viewScript` convention and to provide a future-proof hook
 * point ([data-bb-wsb-instance]); a per-instance init guard prevents double
 * binding if the block is ever re-hydrated. It is intentionally a no-op in MVP.
 */

import './style.scss';

const initBlock = ( wrapper ) => {
	if ( wrapper.dataset.bbWsbInit === '1' ) return;
	wrapper.dataset.bbWsbInit = '1';

	// No-op in MVP: price + badge are baked at render time. Reserved for a
	// potential live price refresh in a future release.
};

document.addEventListener( 'DOMContentLoaded', () => {
	document
		.querySelectorAll( '.bb-wsb[data-bb-wsb-instance]' )
		.forEach( initBlock );
} );
