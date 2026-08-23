import { __ } from '@wordpress/i18n';
import { PanelBody, ToggleControl, SelectControl, TextControl, __experimentalNumberControl as NumberControl, Notice} from '@wordpress/components';

const LAYOUT_OPTIONS = [
	{ value: 'none',       label: __( 'None', 'b-blocks' ) },
	{ value: 'pageLength', label: __( 'Page Length', 'b-blocks' ) },
	{ value: 'search',     label: __( 'Search', 'b-blocks' ) },
	{ value: 'info',       label: __( 'Info', 'b-blocks' ) },
	{ value: 'paging',     label: __( 'Paging', 'b-blocks' ) },
];

const PAGING_TYPE_OPTIONS = [
	{ value: 'simple',            label: 'Simple' },
	{ value: 'simple_numbers',    label: 'Simple Numbers' },
	{ value: 'full',              label: 'Full' },
	{ value: 'full_numbers',      label: 'Full Numbers' },
	{ value: 'first_last_numbers',label: 'First Last Numbers' },
];

const SELECT_STYLE_OPTIONS = [
	{ value: 'single', label: __( 'Single row', 'b-blocks' ) },
	{ value: 'multi',  label: __( 'Multi row', 'b-blocks' ) },
	{ value: 'os',     label: __( 'OS-style (Ctrl/Shift)', 'b-blocks' ) },
];

/**
 * All DataTables InspectorControls, isolated so General.js stays clean.
 * All state updates go through setAttributes to avoid nested-object merge bugs.
 */
const DataTablesSettings = ( { attributes, setAttributes } ) => {
	const { datatables: dt } = attributes;

	// Immutable-style updater helpers for each config sub-tree
	const upDt = ( patch ) =>
		setAttributes( { datatables: { ...dt, ...patch } } );

	const upPaging = ( patch ) =>
		upDt( { paging: { ...dt.paging, ...patch } } );

	const upSearching = ( patch ) =>
		upDt( { searching: { ...dt.searching, ...patch } } );

	const upOrdering = ( patch ) =>
		upDt( { ordering: { ...dt.ordering, ...patch } } );

	const upLayout = ( patch ) =>
		upDt( { layout: { ...dt.layout, ...patch } } );

	const upButtons = ( patch ) =>
		upDt( { buttons: { ...dt.buttons, ...patch } } );

	const upSelect = ( patch ) =>
		upDt( { select: { ...dt.select, ...patch } } );

	const upServerSide = ( patch ) =>
		upDt( { serverSide: { ...dt.serverSide, ...patch } } );

	const upLang = ( patch ) =>
		upDt( { language: { ...dt.language, ...patch } } );

	const upLangPaginate = ( patch ) =>
		upLang( { paginate: { ...dt.language.paginate, ...patch } } );

	const hasAnyButton =
		dt.buttons.copy  || dt.buttons.csv    || dt.buttons.excel ||
		dt.buttons.pdf   || dt.buttons.print  || dt.buttons.colvis;

	return (
		<PanelBody className='bPlPanelBody' title={ __( 'DataTables', 'b-blocks' ) } initialOpen={ false }>

			<ToggleControl
				label={ __( 'Enable DataTables', 'b-blocks' ) }
				checked={ dt.enabled }
				onChange={ ( val ) => upDt( { enabled: val } ) }
				help={__( 'Turn this on to enable DataTables library features for the table.', 'b-blocks' ) }
				// help={ __( 'Adds interactive sorting, search, and pagination to your table on the frontend.', 'b-blocks' ) }
			/>

			{ dt.enabled && <>
				{ /* ── Core Features ── */ }
				<PanelBody className='mt10' title={ __( 'Core Features', 'b-blocks' ) } initialOpen={ true }>

					<ToggleControl
						label={ __( 'Pagination', 'b-blocks' ) }
						checked={ dt.paging.enabled }
						onChange={ ( val ) => upPaging( { enabled: val } ) }
					/>
					{ dt.paging.enabled && <>
						<NumberControl
							className='mt10'
							label={ __( 'Default Page Length', 'b-blocks' ) }
							value={ dt.paging.pageLength }
							onChange={ ( val ) => upPaging( { pageLength: Math.max( 1, Number( val ) || 10 ) } ) }
							min={ 1 }
							max={ 500 }
						/>
						<SelectControl
							className='mt10'
							label={ __( 'Pagination Style', 'b-blocks' ) }
							value={ dt.paging.pagingType }
							onChange={ ( val ) => upPaging( { pagingType: val } ) }
							options={ PAGING_TYPE_OPTIONS }
						/>
					</> }

					<ToggleControl
						className='mt10'
						label={ __( 'Search', 'b-blocks' ) }
						checked={ dt.searching.enabled }
						onChange={ ( val ) => upSearching( { enabled: val } ) }
					/>
					{ dt.searching.enabled && <>
						<ToggleControl
							className='mt10'
							label={ __( 'Smart Search', 'b-blocks' ) }
							checked={ dt.searching.smart }
							onChange={ ( val ) => upSearching( { smart: val } ) }
							help={ __( 'Matches keywords in any order across the row.', 'b-blocks' ) }
						/>
						<ToggleControl
							className='mt10'
							label={ __( 'Case Insensitive', 'b-blocks' ) }
							checked={ dt.searching.caseInsensitive }
							onChange={ ( val ) => upSearching( { caseInsensitive: val } ) }
						/>
						<ToggleControl
							className='mt10'
							label={ __( 'Regex Search', 'b-blocks' ) }
							checked={ dt.searching.regex }
							onChange={ ( val ) => upSearching( { regex: val } ) }
							help={ __( 'Let visitors enter regular expressions in the search box.', 'b-blocks' ) }
						/>
					</> }

					<ToggleControl
						className='mt10'
						label={ __( 'Column Sorting', 'b-blocks' ) }
						checked={ dt.ordering.enabled }
						onChange={ ( val ) => upOrdering( { enabled: val } ) }
					/>
					{ dt.ordering.enabled && (
						<ToggleControl
							className='mt10'
							label={ __( 'Multi-Column Sort', 'b-blocks' ) }
							checked={ dt.ordering.multiColumn }
							onChange={ ( val ) => upOrdering( { multiColumn: val } ) }
							help={ __( 'Shift+click column headers to sort by multiple columns simultaneously.', 'b-blocks' ) }
						/>
					) }

					<ToggleControl
						className='mt10'
						label={ __( 'Show Record Info', 'b-blocks' ) }
						checked={ dt.info }
						onChange={ ( val ) => upDt( { info: val } ) }
						help={ __( 'Shows "Showing X to Y of Z entries" text.', 'b-blocks' ) }
					/>
				</PanelBody>

				{ /* ── Layout & Toolbar ── */ }
				<PanelBody title={ __( 'Layout & Toolbar', 'b-blocks' ) } initialOpen={ false }>
					<p style={ { fontSize: 11, color: '#757575', marginBottom: 8 } }>
						{ __( 'Choose which control appears in each toolbar position.', 'b-blocks' ) }
					</p>
					<SelectControl
						className='mt10'
						label={ __( 'Top Left', 'b-blocks' ) }
						value={ dt.layout.topStart }
						onChange={ ( val ) => upLayout( { topStart: val } ) }
						options={ LAYOUT_OPTIONS }
					/>
					<SelectControl
						className='mt10'
						label={ __( 'Top Right', 'b-blocks' ) }
						value={ dt.layout.topEnd }
						onChange={ ( val ) => upLayout( { topEnd: val } ) }
						options={ LAYOUT_OPTIONS }
					/>
					<SelectControl
						className='mt10'
						label={ __( 'Bottom Left', 'b-blocks' ) }
						value={ dt.layout.bottomStart }
						onChange={ ( val ) => upLayout( { bottomStart: val } ) }
						options={ LAYOUT_OPTIONS }
					/>
					<SelectControl
						className='mt10'
						label={ __( 'Bottom Right', 'b-blocks' ) }
						value={ dt.layout.bottomEnd }
						onChange={ ( val ) => upLayout( { bottomEnd: val } ) }
						options={ LAYOUT_OPTIONS }
					/>
					{ dt.buttons.enabled && hasAnyButton && (
						<Notice status='info' isDismissible={ false } style={ { marginTop: 8 } }>
							{ __( 'Export buttons are placed in an additional row above the toolbar automatically.', 'b-blocks' ) }
						</Notice>
					) }
				</PanelBody>

				{ /* ── Extensions ── */ }
				<PanelBody title={ __( 'Extensions', 'b-blocks' ) } initialOpen={ false }>

					<ToggleControl
						className='mt10'
						label={ __( 'Responsive', 'b-blocks' ) }
						checked={ dt.responsive }
						onChange={ ( val ) => upDt( { responsive: val } ) }
						help={ __( 'Collapses overflow columns on small screens with expandable child rows.', 'b-blocks' ) }
					/>

					<ToggleControl
						className='mt10'
						label={ __( 'Fixed Header', 'b-blocks' ) }
						checked={ dt.fixedHeader }
						onChange={ ( val ) => upDt( { fixedHeader: val } ) }
						help={ __( 'Keeps the header row visible when the user scrolls down.', 'b-blocks' ) }
					/>

					<ToggleControl
						className='mt10'
						label={ __( 'Row Selection', 'b-blocks' ) }
						checked={ dt.select.enabled }
						onChange={ ( val ) => upSelect( { enabled: val } ) }
					/>
					{ dt.select.enabled && (
						<SelectControl
							className='mt10'
							label={ __( 'Selection Style', 'b-blocks' ) }
							value={ dt.select.style }
							onChange={ ( val ) => upSelect( { style: val } ) }
							options={ SELECT_STYLE_OPTIONS }
						/>
					) }

					<ToggleControl
						className='mt10'
						label={ __( 'Export Buttons', 'b-blocks' ) }
						checked={ dt.buttons.enabled }
						onChange={ ( val ) => upButtons( { enabled: val } ) }
					/>
					{ dt.buttons.enabled && <>
						<p style={ { fontSize: 11, color: '#757575', margin: '4px 0 6px' } }>
							{ __( 'Select which export actions to display:', 'b-blocks' ) }
						</p>
						<ToggleControl className='mt10' label={ __( 'Copy',              'b-blocks' ) } checked={ dt.buttons.copy   } onChange={ ( v ) => upButtons( { copy:   v } ) } />
						<ToggleControl className='mt10' label={ __( 'CSV',               'b-blocks' ) } checked={ dt.buttons.csv    } onChange={ ( v ) => upButtons( { csv:    v } ) } />
						<ToggleControl className='mt10' label={ __( 'Excel',             'b-blocks' ) } checked={ dt.buttons.excel  } onChange={ ( v ) => upButtons( { excel:  v } ) } />
						<ToggleControl className='mt10' label={ __( 'PDF',               'b-blocks' ) } checked={ dt.buttons.pdf    } onChange={ ( v ) => upButtons( { pdf:    v } ) } />
						<ToggleControl className='mt10' label={ __( 'Print',             'b-blocks' ) } checked={ dt.buttons.print  } onChange={ ( v ) => upButtons( { print:  v } ) } />
						<ToggleControl className='mt10' label={ __( 'Column Visibility', 'b-blocks' ) } checked={ dt.buttons.colvis } onChange={ ( v ) => upButtons( { colvis: v } ) } />
						{/* { ( dt.buttons.excel || dt.buttons.pdf ) && (
							<Notice status='warning' isDismissible={ false } style={ { marginTop: 4 } }>
								{ __( 'Excel and PDF export require jszip and pdfmake. Run: npm install jszip pdfmake', 'b-blocks' ) }
							</Notice>
						) } */}
					</>}
				</PanelBody>

				{ /* ── Performance ── */ }
				<PanelBody title={ __( 'Performance', 'b-blocks' ) } initialOpen={ false }>
					<ToggleControl
						label={ __( 'Save Table State', 'b-blocks' ) }
						checked={ dt.stateSave }
						onChange={ ( val ) => upDt( { stateSave: val } ) }
						help={ __( 'Persists the user\'s search, sort, and page in localStorage between visits.', 'b-blocks' ) }
					/>
					<ToggleControl
						className='mt10'
						label={ __( 'Auto Column Width', 'b-blocks' ) }
						checked={ dt.autoWidth }
						onChange={ ( val ) => upDt( { autoWidth: val } ) }
					/>
					<NumberControl
						className='mt10'
						label={ __( 'Search Delay (ms)', 'b-blocks' ) }
						value={ dt.searchDelay }
						onChange={ ( val ) => upDt( { searchDelay: Math.max( 0, Number( val ) || 400 ) } ) }
						min={ 0 }
						max={ 2000 }
						help={ __( 'Milliseconds to wait after the user types before triggering a search redraw.', 'b-blocks' ) }
					/>
				</PanelBody>

				{ /* ── Server-Side Processing ── */ }
				<PanelBody title={ __( 'Server-Side Processing', 'b-blocks' ) } initialOpen={ false }>
					<ToggleControl
						className='mt10'
						label={ __( 'Enable Server-Side Processing', 'b-blocks' ) }
						checked={ dt.serverSide.enabled }
						onChange={ ( val ) => upServerSide( { enabled: val } ) }
						help={ __( 'Sends search, sort, and page requests to a server endpoint. Required for very large datasets.', 'b-blocks' ) }
					/>
					{ dt.serverSide.enabled && <>
						<TextControl
							className='mt10'
							label={ __( 'API Endpoint URL', 'b-blocks' ) }
							value={ dt.serverSide.endpoint }
							onChange={ ( val ) => upServerSide( { endpoint: val } ) }
							placeholder='https://your-site.com/wp-json/b-blocks/v1/table-data'
							help={ __( 'Must return the DataTables server-side JSON contract: draw, recordsTotal, recordsFiltered, data.', 'b-blocks' ) }
						/>
						<Notice status='warning' isDismissible={ false }>
							{ __( 'When server-side mode is active, the table\'s HTML content is ignored — data comes entirely from the endpoint.', 'b-blocks' ) }
						</Notice>
					</> }
				</PanelBody>

				{ /* ── Language ── */ }
				<PanelBody title={ __( 'Language / Labels', 'b-blocks' ) } initialOpen={ false }>
					<TextControl
						label={ __( 'Search Label', 'b-blocks' ) }
						value={ dt.language.search }
						onChange={ ( val ) => upLang( { search: val } ) }
					/>
					<TextControl
						label={ __( 'Length Menu Label', 'b-blocks' ) }
						value={ dt.language.lengthMenu }
						onChange={ ( val ) => upLang( { lengthMenu: val } ) }
						help={ __( 'Use _MENU_ as placeholder for the page-size dropdown.', 'b-blocks' ) }
					/>
					<TextControl
						label={ __( 'Info Label', 'b-blocks' ) }
						value={ dt.language.info }
						onChange={ ( val ) => upLang( { info: val } ) }
						help={ __( 'Placeholders: _START_, _END_, _TOTAL_', 'b-blocks' ) }
					/>
					<TextControl
						label={ __( 'Empty Table', 'b-blocks' ) }
						value={ dt.language.emptyTable }
						onChange={ ( val ) => upLang( { emptyTable: val } ) }
					/>
					<TextControl
						label={ __( 'No Results', 'b-blocks' ) }
						value={ dt.language.zeroRecords }
						onChange={ ( val ) => upLang( { zeroRecords: val } ) }
					/>
					<TextControl
						label={ __( 'Previous Button', 'b-blocks' ) }
						value={ dt.language.paginate.previous }
						onChange={ ( val ) => upLangPaginate( { previous: val } ) }
					/>
					<TextControl
						label={ __( 'Next Button', 'b-blocks' ) }
						value={ dt.language.paginate.next }
						onChange={ ( val ) => upLangPaginate( { next: val } ) }
					/>
					<TextControl
						label={ __( 'First Button', 'b-blocks' ) }
						value={ dt.language.paginate.first }
						onChange={ ( val ) => upLangPaginate( { first: val } ) }
					/>
					<TextControl
						label={ __( 'Last Button', 'b-blocks' ) }
						value={ dt.language.paginate.last }
						onChange={ ( val ) => upLangPaginate( { last: val } ) }
					/>
				</PanelBody>

			</> }
		</PanelBody>
	);
};

export default DataTablesSettings;
