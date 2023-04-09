import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { InspectorControls, ColorPalette, InnerBlocks } from '@wordpress/block-editor';
import { PanelBody, RangeControl } from '@wordpress/components';

// Variables
import { colors } from '../utils/options';

const userSelect = [
	{ label: __('Auto', 'b-blocks'), value: 'auto', icon: 'AUTO' },
	{ label: __('All', 'b-blocks'), value: 'all', icon: 'ALL' },
	{ label: __('None', 'b-blocks'), value: 'none', icon: 'NONE' },
];

// Settings Components
import Title from '../../../Components/Title';
import BtnGroup from '../../../Components/BtnGroup';

// Icon
import { selectionIcon } from '../utils/icons';

registerBlockType('b-blocks/selection', {
	// Build In attributes
	title: __('Selection', 'b-blocks'),
	description: __('Text selection enabled disabled', 'b-blocks'),
	icon: selectionIcon,
	category: 'bBlocks',
	keywords: [__('Select', 'b-blocks'), __('Text Selection', 'b-blocks'), __('Block Selection', 'b-blocks')],
	supports: {
		align: ['center', 'wide', 'full']
	},

	// Custom Attributes
	attributes: {
		align: { type: 'string', default: 'center' },

		selection: { type: 'string', default: 'auto' },
		BGColor: { type: 'string', default: '#f1f1f1' },
		selectionPTB: { type: 'number', default: 10 },
		selectionPLR: { type: 'number', default: 15 },
	},

	// Build In Functions
	edit: props => {
		const { attributes: { selection, BGColor, selectionPTB, selectionPLR }, setAttributes } = props;

		// Styles
		const selectionStyle = { userSelect: `${selection}!important`, backgroundColor: BGColor, padding: `${selectionPTB}px ${selectionPLR}px` };

		return <>
			<InspectorControls>
				{/* Selection Settings */}
				<PanelBody className='bBlocksPanelBody' title={__('Selection Settings', 'b-blocks')} initialOpen={true}>
					{/* Selection */}
					<Title className=''>{__('Selection:', 'b-blocks')}</Title>
					<BtnGroup options={userSelect} myValue={selection} setState={cng => setAttributes({ selection: cng })} />

					{/* Background Color */}
					<Title>{__('Background Color:', 'b-blocks')}</Title>
					<ColorPalette value={BGColor} onChange={cng => setAttributes({ BGColor: cng })} colors={colors} />

					{/* Padding Top Bottom */}
					<Title>{__('Padding Top Bottom:', 'b-blocks')}</Title>
					<RangeControl value={selectionPTB} onChange={cng => setAttributes({ selectionPTB: cng })} min={0} max={100} step={1} />

					{/* Padding Left Right */}
					<Title>{__('Padding Left Right:', 'b-blocks')}</Title>
					<RangeControl value={selectionPLR} onChange={cng => setAttributes({ selectionPLR: cng })} min={0} max={150} step={1} />
				</PanelBody>
			</InspectorControls>


			<div className='b_blocks_selection'>
				<div className='bBlocksInnerContent' style={selectionStyle}>
					<InnerBlocks />
				</div>
			</div>
		</>
	},

	save: props => {
		const { selection, BGColor, selectionPTB, selectionPLR } = props.attributes;

		// Styles
		const selectionStyle = { userSelect: `${selection}!important`, backgroundColor: BGColor, padding: `${selectionPTB}px ${selectionPLR}px`, textAlign: 'inherit' };

		return (
			<div className='b_blocks_selection'>
				<div className='bBlocksInnerContent' style={selectionStyle}>
					<InnerBlocks.Content />
				</div>
			</div>
		)
	},

	example: {
		attributes: {
			'preview': true,
		},
	},
});