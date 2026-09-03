import { __ } from '@wordpress/i18n';
import { InnerBlocks, RichText, useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { useSelect, withSelect } from '@wordpress/data';

import { updateAttributes } from '../../../../../bpl-tools/utils/functions';

import Style from '../Common/Style';
import Settings from './Settings/Settings';
import { getTimelineItemClasses, withItemDefaults } from '../../utils/functions';

const Edit = ( props ) => {
	const { attributes, setAttributes, clientId, device } = props;
	// Merged against the schema so a nested key added after this entry was
	// saved cannot read as undefined — WordPress fills a missing attribute but
	// never merges into one that is present.
	const resolved = withItemDefaults( attributes );
	const { date, icon, item } = resolved;

	const isPremium = bBlocksPremiumChecker;
	const updateObj = updateAttributes( attributes, setAttributes );

	// A button appender only belongs on an empty card — left on permanently it
	// draws a bordered placeholder box over cards that already have content.
	const isEmpty = useSelect(
		( select ) => 0 === select( 'core/block-editor' ).getBlockCount( clientId ),
		[ clientId ]
	);

	const blockProps = useBlockProps( { className: getTimelineItemClasses( item ) } );

	// The card is the inner-blocks container so the editor structure matches
	// what render.php outputs, which keeps one stylesheet working in both.
	const innerBlocksProps = useInnerBlocksProps(
		{ className: 'b-blocks-timeline-card' },
		{
			templateLock: false,
			renderAppender: isEmpty ? InnerBlocks.ButtonBlockAppender : InnerBlocks.DefaultBlockAppender
		}
	);

	return <>
		<Settings { ...{ attributes: resolved, setAttributes, updateObj, isPremium, device, clientId } } />

		<div { ...blockProps }>
			<Style attributes={ resolved } id={ `block-${ clientId }` } isBackend={ true } />

			<div className='b-blocks-timeline-content'>
				<div { ...innerBlocksProps } />
			</div>

			<div className='b-blocks-timeline-marker'>
				{ icon && <span dangerouslySetInnerHTML={ { __html: icon } } /> }
			</div>

			<RichText
				tagName='div'
				className='b-blocks-timeline-date'
				value={ date }
				onChange={ ( value ) => setAttributes( { date: value } ) }
				placeholder={ __( 'Add a date…', 'b-blocks' ) }
			/>
		</div>
	</>;
};

export default withSelect( ( select ) => {
	const { getDeviceType } = select( 'core/editor' );

	return {
		device: getDeviceType()?.toLowerCase() || 'desktop'
	};
} )( Edit );
