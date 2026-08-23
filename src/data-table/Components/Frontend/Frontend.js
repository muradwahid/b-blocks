import { useEffect, useRef } from 'react';

// DataTables core — DOM sourcing, no jQuery required in DT 2.x
import DataTable from 'datatables.net';

// Extensions self-register against the DataTable global when imported
import 'datatables.net-responsive';
import 'datatables.net-fixedheader';
import 'datatables.net-buttons/js/dataTables.buttons';
import 'datatables.net-buttons/js/buttons.html5';
import 'datatables.net-buttons/js/buttons.colVis';
import 'datatables.net-buttons/js/buttons.print';
import 'datatables.net-select';


import JSZip from 'jszip';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

DataTable.Buttons.jszip( JSZip );
pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts;
DataTable.Buttons.pdfMake( pdfMake );

import { buildDtConfig } from '../../utils/datatables';

/**
 * Renders the table shell, moves PHP-rendered content into it, then
 * optionally initializes DataTables — all in a single useEffect so
 * React's reconciler never touches the rows after the first paint.
 */
const Frontend = ( { templateContent, attributes } ) => {
	const wrapperRef = useRef( null );
	const dtInstance = useRef( null );

	useEffect( () => {
		if ( ! wrapperRef.current || ! templateContent ) return;

		// Move the PHP-rendered thead/tbody/tfoot into our React table once.
		if ( templateContent.dataset.moved !== '1' ) {
			const nodes = Array.from( templateContent.children );
			wrapperRef.current.append( ...nodes );
			templateContent.dataset.moved = '1';
		}

		const dtConfig = buildDtConfig( attributes?.datatables );
		if ( ! dtConfig ) return;

		// One paint cycle lets the browser measure column widths before
		// DataTables runs autoWidth, preventing layout thrash.
		const timer = setTimeout( () => {
			if ( wrapperRef.current && ! dtInstance.current ) {
				try {
					dtInstance.current = new DataTable( wrapperRef.current, dtConfig );
					// datatables.net-dt forces `border-collapse: separate !important`.
					// Only an inline !important declaration beats another !important,
					// so we use setProperty to restore the block's cellBorderType.
					wrapperRef.current.style.setProperty(
						'border-collapse',
						attributes?.content?.cellBorderType || 'collapse',
						'important'
					);
				} catch ( err ) {
					// eslint-disable-next-line no-console
					console.warn( 'b-blocks/table: DataTables init failed —', err );
				}
			}
		}, 0 );

		return () => {
			clearTimeout( timer );
			if ( dtInstance.current ) {
				dtInstance.current.destroy();
				dtInstance.current = null;
			}
		};
	}, [] ); // intentionally empty — run once after first paint

	return (
		<table className="b-blocks-table-main-container" ref={ wrapperRef } />
	);
};

export default Frontend;
