import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { InspectorControls, ColorPalette, InnerBlocks } from '@wordpress/block-editor';
import { PanelBody, RangeControl } from '@wordpress/components';

// Settings Components
import Title from '../../../Components/Title';

// Variables
import { colors } from '../utils/options';
const INNER_TEMPLATE = [['b-blocks/section-heading', {}]];

// Icon
import { sectionIcon } from '../utils/icons';

registerBlockType('b-blocks/section', {
	// Build In attributes
	title: __('Section', 'b-blocks'),
	description: __('Implement a section', 'b-blocks'),
	icon: sectionIcon,
	category: 'bBlocks',
	keywords: [__('Section', 'b-blocks'), __('Section Content', 'b-blocks'), __('Inner Block', 'b-blocks')],
	supports: {
		align: ['center', 'wide', 'full']
	},

	// Custom Attributes
	attributes: {
		align: { type: 'string', default: 'full' },

		BGColor: { type: 'string', default: '#f3f4f5' },
		PT: { type: 'number', default: 50 },
		PR: { type: 'number', default: 15 },
		PB: { type: 'number', default: 50 },
		PL: { type: 'number', default: 15 },
	},

	// Build In Functions
	edit: props => {
		const { attributes: { BGColor, PT, PR, PB, PL }, setAttributes, isSelected } = props;

		const sectionStyle = { backgroundColor: `${isSelected ? '#dbd0ff' : BGColor}`, padding: `${PT}px ${PR}px ${PB}px ${PL}px`, position: 'relative', zIndex: 0 }

		return <>
			<InspectorControls>
				{/* Section Settings */}
				<PanelBody className='bBlocksPanelBody' title={__('Section Settings', 'b-blocks')} initialOpen={true}>
					{/* Background Color */}
					<Title>{__('Background Color:', 'b-blocks')}</Title>
					<ColorPalette value={BGColor} onChange={cng => setAttributes({ BGColor: cng })} colors={colors} />

					{/* Padding Top */}
					<Title>{__('Padding Top:', 'b-blocks')}</Title>
					<RangeControl value={PT} onChange={cng => setAttributes({ PT: cng })} min={0} max={100} step={1} />

					{/* Padding Right */}
					<Title>{__('Padding Right:', 'b-blocks')}</Title>
					<RangeControl value={PR} onChange={cng => setAttributes({ PR: cng })} min={0} max={150} step={1} />

					{/* Padding Bottom */}
					<Title>{__('Padding Bottom:', 'b-blocks')}</Title>
					<RangeControl value={PB} onChange={cng => setAttributes({ PB: cng })} min={0} max={100} step={1} />

					{/* Padding Left */}
					<Title>{__('Padding Left:', 'b-blocks')}</Title>
					<RangeControl value={PL} onChange={cng => setAttributes({ PL: cng })} min={0} max={150} step={1} />
				</PanelBody>
			</InspectorControls>


			<div className='b_blocks_section bBlocksInnerContent'>
				<div style={sectionStyle}>
					<InnerBlocks template={INNER_TEMPLATE} />

					{isSelected && <div style={{ backgroundColor: BGColor, display: 'block', position: 'absolute', top: `${PT}px`, left: `${PL}px`, right: `${PR}px`, bottom: `${PB}px`, zIndex: '-1' }} />}
				</div>
			</div>
		</>
	},

	save: props => {
		const { BGColor, PT, PR, PB, PL } = props.attributes;

		const sectionStyle = { backgroundColor: BGColor, padding: `${PT}px ${PR}px ${PB}px ${PL}px`, textAlign: 'inherit' }

		return (
			<div className='b_blocks_section bBlocksInnerContent'>
				<div style={sectionStyle}>
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