import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl } from '@wordpress/components';

import { ColorControl, Notice, Typography } from '../../../../../../../bpl-tools/Components';

/**
 * Mirrors data-table's caption position control. The caption exists in the
 * markup already but was screen-reader-only, so this makes it optional visible
 * content rather than adding a new element.
 */
const CaptionStyle = ({ attributes, updateObj }) => {
	const { content = {} } = attributes;
	const captionPosition = content.captionPosition || 'hidden';

	return <PanelBody className='bPlPanelBody' title={__('Caption', 'b-blocks')} initialOpen={false}>
		<SelectControl
			label={__('Position', 'b-blocks')}
			value={captionPosition}
			options={[
				{ label: __('Screen readers only', 'b-blocks'), value: 'hidden' },
				{ label: __('Above the table', 'b-blocks'), value: 'top' },
				{ label: __('Below the table', 'b-blocks'), value: 'bottom' }
			]}
			onChange={(val) => updateObj('content', val, 'captionPosition')}
			__nextHasNoMarginBottom
		/>

		{'hidden' === captionPosition && <Notice status='info' isIcon={true}>
			{__('The caption is still read by screen readers — set a position to show it on the page too.', 'b-blocks')}
		</Notice>}

		{'hidden' !== captionPosition && <>
			<ColorControl className='mt10' label={__('Color:', 'b-blocks')} value={content.captionColor} onChange={(val) => updateObj('content', val, 'captionColor')} />

			<Typography className='mt10' label={__('Typography', 'b-blocks')} value={content.captionTypo || {}} onChange={(val) => updateObj('content', val, 'captionTypo')} />
		</>}
	</PanelBody>;
};
export default CaptionStyle;
