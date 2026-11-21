import { __ } from '@wordpress/i18n';
import { sanitizeHtml } from '../../../utils/sanitizeHtml';

const TYPE_VALUES = [ 'line', 'icon', 'text' ];
const LINE_STYLE_VALUES = [ 'solid', 'dashed', 'dotted', 'double' ];
const ALIGN_VALUES = ['left', 'center', 'right'];

const Divider = ( { attributes, textSlot = null } ) => {
	const { type = 'line', layout = {}, line = {}, icon = {}, text = {} } = attributes;

	const safeType = TYPE_VALUES.includes( type ) ? type : 'line';
	const safeLineStyle = LINE_STYLE_VALUES.includes( line.style ) ? line.style : 'solid';
	const safeAlign = ALIGN_VALUES.includes( layout.alignment ) ? layout.alignment : 'center';

	const wrapperClasses = [
		'b-blocks-divider',
		`b-blocks-divider--${ safeType }`,
		`b-blocks-divider-style--${ safeLineStyle }`,
		`b-blocks-divider-align--${ safeAlign }`,
	].join( ' ' );

	return (
		<div className={ wrapperClasses }>
			{ 'line' === safeType && (
				<div className='b-blocks-divider-inner' role='separator'>
					<hr className='b-blocks-divider-line' aria-hidden='true' />
				</div>
			) }

			{ 'icon' === safeType && (
				<div className='b-blocks-divider-inner' role='separator'>
					<span className='b-blocks-divider-line' aria-hidden='true'></span>
					<span
						className='b-blocks-divider-icon'
						aria-hidden='true'
						dangerouslySetInnerHTML={ { __html: sanitizeHtml( icon.svg || '' ) } }
					/>
					<span className='b-blocks-divider-line' aria-hidden='true'></span>
				</div>
			) }

			{ 'text' === safeType && (
				<div
					className='b-blocks-divider-inner'
					role='separator'
					aria-label={ text.content || __( 'Section divider', 'b-blocks' ) }
				>
					<span className='b-blocks-divider-line' aria-hidden='true'></span>
					{ textSlot || (
						<span className='b-blocks-divider-text'>{ text.content || '' }</span>
					) }
					<span className='b-blocks-divider-line' aria-hidden='true'></span>
				</div>
			) }
		</div>
	);
};
export default Divider;
