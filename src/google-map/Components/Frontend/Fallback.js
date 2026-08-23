import { __ } from '@wordpress/i18n';

import { mapsSearchUrl, P } from '../../utils/data';

/**
 * Everything the map shows when it cannot show a map: no API key, a failed
 * script load, or a lazy-load placeholder waiting for a click. Always keeps a
 * real link out to Google Maps so the content is never a dead end.
 */
const Fallback = ({ address = '', message = '', status = 'info', onActivate = null, actionLabel = '' }) => (
	<div className={`${P}-fallback ${P}-fallback-${status}`} role='note'>
		{message ? <p className={`${P}-fallback-message`}>{message}</p> : null}

		{address ? <p className={`${P}-fallback-address`}>{address}</p> : null}

		{onActivate ? (
			<button type='button' className={`${P}-fallback-button`} onClick={onActivate}>
				{actionLabel || __('Load map', 'b-blocks')}
			</button>
		) : (
			<a className={`${P}-fallback-link`} href={mapsSearchUrl(address)} target='_blank' rel='noopener noreferrer'>
				{__('Open in Google Maps', 'b-blocks')}
			</a>
		)}
	</div>
);
export default Fallback;
