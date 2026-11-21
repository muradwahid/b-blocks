import { useState, useEffect } from 'react';
import { sanitizeHtml } from '../../../utils/sanitizeHtml';

const CN = 'bBlocks-interactive-checklist';
const STORAGE = 'bb_checklist_';
const TAGS = [ 'h2', 'h3', 'h4' ];

const readState = ( key ) => {
	try {
		const raw = window.localStorage && window.localStorage.getItem( STORAGE + key );
		const parsed = raw && JSON.parse( raw );
		return parsed && 'object' === typeof parsed ? parsed : {};
	} catch ( e ) {
		return {};
	}
};

/**
 * Interactive Checklist — shared React render used by view.js (frontend).
 * Checked state persists per instance in localStorage keyed by persistKey.
 */
const Checklist = ( { attributes, id } ) => {
	const { heading = {}, items = [], checkbox = {}, item = {}, progress = {}, reset = {}, persistKey = '' } = attributes;

	const key = ( persistKey || id || '' ).toString();
	const cbStyle = 'round' === checkbox.style ? 'round' : 'square';
	const strike = item.strike === true;
	const showProgress = progress.show !== false;
	const showReset = reset.show !== false;
	const HeadingTag = TAGS.includes( heading.tag ) ? heading.tag : 'h3';
	const headingHtml = ( heading.text || '' ).toString().trim() ? heading.text : '';

	const clean = ( Array.isArray( items ) ? items : [] ).filter( ( i ) => ( i && i.label || '' ).toString().trim() );

	const [ checked, setChecked ] = useState( {} );

	useEffect( () => {
		setChecked( readState( key ) );
	}, [ key ] );

	const total = clean.length;
	const done = clean.filter( ( i ) => checked[ i.id ] ).length;
	const pct = total > 0 ? Math.round( ( done / total ) * 100 ) : 0;

	const toggle = ( itemId ) => {
		setChecked( ( prev ) => {
			const next = { ...prev, [ itemId ]: ! prev[ itemId ] };
			try {
				window.localStorage && window.localStorage.setItem( STORAGE + key, JSON.stringify( next ) );
			} catch ( e ) { /* storage unavailable */ }
			return next;
		} );
	};

	const doReset = () => {
		// eslint-disable-next-line no-alert
		if ( ! window.confirm( 'Reset your checklist progress?' ) ) {
			return;
		}
		setChecked( {} );
		try {
			window.localStorage && window.localStorage.removeItem( STORAGE + key );
		} catch ( e ) { /* storage unavailable */ }
	};

	const wrapperClasses = [
		`${ CN }-wrapper`,
		`${ CN }-checkbox-${ cbStyle }`,
		strike ? `${ CN }-has-strike` : '',
		total > 0 && done === total ? 'is-complete' : '',
	].filter( Boolean ).join( ' ' );

	return (
		<div className={ wrapperClasses }>
			{ headingHtml && (
				<HeadingTag className={ `${ CN }-heading` } dangerouslySetInnerHTML={ { __html: sanitizeHtml( headingHtml ) } } />
			) }

			{ showProgress && total > 0 && (
				<div className={ `${ CN }-progress` }>
					<p className={ `${ CN }-progress-text` } aria-live='polite' aria-atomic='true'>
						{ `${ done } of ${ total } complete` }
					</p>
					<div className={ `${ CN }-progress-track` } aria-hidden='true'>
						<span className={ `${ CN }-progress-fill` } style={ { width: `${ pct }%` } } />
					</div>
				</div>
			) }

			{ 0 === total ? (
				<p className={ `${ CN }-empty` }>No checklist items to display.</p>
			) : (
				<ul className={ `${ CN }-list` }>
					{ clean.map( ( it ) => {
						const isChecked = !! checked[ it.id ];
						return (
							<li key={ it.id } className={ `${ CN }-item ${ isChecked ? 'is-checked' : '' }` }>
								<label className={ `${ CN }-label` }>
									<input
										type='checkbox'
										className={ `${ CN }-checkbox` }
										checked={ isChecked }
										onChange={ () => toggle( it.id ) }
									/>
									<span className={ `${ CN }-box` } aria-hidden='true' />
									<span className={ `${ CN }-text` }>{ it.label }</span>
								</label>
							</li>
						);
					} ) }
				</ul>
			) }

			{ showReset && total > 0 && (
				<button type='button' className={ `${ CN }-reset` } onClick={ doReset }>
					Reset progress
				</button>
			) }
		</div>
	);
};
export default Checklist;
