/**
 * Shared DataTables configuration builder.
 * Pure function — no imports of datatables.net so it can be safely required
 * in both the editor bundle (index.js) and the frontend bundle (view.js).
 */

/**
 * Returns the array of enabled button names in the correct DataTables order.
 *
 * @param {Object} buttons  The `datatables.buttons` sub-attribute.
 * @returns {string[]}
 */
export const buildButtonList = ( buttons ) => {
	const order = [ 'copy', 'csv', 'excel', 'pdf', 'print', 'colvis' ];
	return order.filter( ( key ) => buttons[ key ] );
};

/**
 * Converts the block's `datatables` attribute into a DataTables 2.x init config.
 * Returns null when `enabled` is false so callers can short-circuit cleanly.
 *
 * @param {Object}  dt            The `attributes.datatables` sub-object.
 * @param {boolean} [editorMode] When true, forces stateSave off so editor
 *                               previews don't pollute the visitor's localStorage.
 * @returns {Object|null}
 */
export const buildDtConfig = ( dt, editorMode = false ) => {
	if ( ! dt?.enabled ) return null;

	const cfg = {
		paging:      dt.paging.enabled,
		searching:   dt.searching.enabled,
		ordering:    dt.ordering.enabled,
		info:        dt.info,
		autoWidth:   dt.autoWidth,
		stateSave:   editorMode ? false : dt.stateSave,
		searchDelay: dt.searchDelay,
	};

	// Pagination
	if ( dt.paging.enabled ) {
		cfg.pageLength = dt.paging.pageLength;
		cfg.pagingType = dt.paging.pagingType;
		cfg.lengthMenu = [ [ 5, 10, 25, 50, 100, -1 ], [ '5', '10', '25', '50', '100', 'All' ] ];
	}

	// Search options
	if ( dt.searching.enabled ) {
		cfg.search = {
			smart:           dt.searching.smart,
			regex:           dt.searching.regex,
			caseInsensitive: dt.searching.caseInsensitive,
		};
	}

	// Ordering
	if ( dt.ordering.enabled ) {
		cfg.orderMulti = dt.ordering.multiColumn;
	}

	// Extensions
	if ( dt.responsive )      cfg.responsive  = true;
	if ( dt.fixedHeader )     cfg.fixedHeader = true;
	if ( dt.select?.enabled ) cfg.select       = { style: dt.select.style };

	// Language
	if ( dt.language ) {
		cfg.language = { ...dt.language };
	}

	// Layout — set slots explicitly: null hides the slot, omitting it lets DT use its default.
	const layoutSlots = {};
	[ 'topStart', 'topEnd', 'bottomStart', 'bottomEnd' ].forEach( ( slot ) => {
		const val = dt.layout[ slot ];
		layoutSlots[ slot ] = ( val && val !== 'none' ) ? val : null;
	} );

	// Buttons land in an extra layout row so they don't displace other controls
	if ( dt.buttons?.enabled ) {
		const btns = buildButtonList( dt.buttons );
		if ( btns.length ) layoutSlots.top2Start = { buttons: btns };
	}

	cfg.layout = layoutSlots;

	// Server-side processing
	if ( dt.serverSide?.enabled && dt.serverSide?.endpoint ) {
		cfg.serverSide = true;
		cfg.ajax       = dt.serverSide.endpoint;
	}

	return cfg;
};
