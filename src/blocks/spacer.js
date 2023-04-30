import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl, ResizableBox } from '@wordpress/components';

// Settings Components
import { Label } from '../../../Components';

// Icon
import { rectangleIcon } from '../utils/icons';

registerBlockType('b-blocks/spacer', {
	// Build In attributes
	title: __('Spacer', 'b-blocks'),
	description: __('Empty space between blocks & sections', 'b-blocks'),
	icon: rectangleIcon,
	category: 'bBlocks',
	keywords: [__('Space', 'b-blocks'), __('Empty Space', 'b-blocks'), __('Empty', 'b-blocks')],
	supports: {
		align: ['center', 'wide', 'full']
	},

	// Custom Attributes
	attributes: {
		align: { type: 'string', default: 'full' },

		height: { type: 'number', default: 50 }
	},

	// Build In Functions
	edit: props => {
		const { attributes: { height }, setAttributes, isSelected, toggleSelection } = props;

		return <>
			<InspectorControls>
				{/* Spacer Settings */}
				<PanelBody className='bBlocksPanelBody' title={__('Spacer Settings', 'b-blocks')} initialOpen={true}>
					{/* Height/Size */}
					<Label className=''>{__('Height/Size:', 'b-blocks')}</Label>
					<RangeControl value={height} onChange={cng => setAttributes({ height: cng })} min={0} max={1000} step={1} />
				</PanelBody>
			</InspectorControls>


			<div className='b_blocks_spacer'>
				<div style={{ height: `${height}px`, color: '#4527a4', backgroundColor: `${isSelected ? '#edf3ff' : ''}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>
					{__(`SPACER ---- This content ${isSelected ? '& background color' : ''}`, 'b-blocks')}

					<ResizableBox size={{ height }} enable={{ bottom: true }} onResizeStop={(event, direction, elt, delta) => {
						setAttributes({ height: parseInt(height + delta.height, 0) });
						toggleSelection(true);
					}} onResizeStart={() => {
						toggleSelection(false);
					}} style={{ position: 'absolute' }} />
					&nbsp;{__('will not show in front End', 'b-blocks')}
				</div>
			</div>
		</>
	},

	save: props => {
		const { height } = props.attributes;

		return (
			<div className='b_blocks_spacer'>
				<div style={{ height: `${height}px`, textAlign: 'inherit' }}></div>
			</div>
		)
	},

	example: {
		attributes: {
			'preview': true,
		},
	},
});