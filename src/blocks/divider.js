import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { InspectorControls, ColorPalette } from '@wordpress/block-editor';
import { PanelBody, SelectControl, RangeControl } from '@wordpress/components';

// Variables
import options from '../Const/options';
const { aligns, borderStyles, colors, sizeTypes } = options;

// Components
import BtnGroup from '../Components/BtnGroup';

// Functions
import func from '../Const/functions';
const { firstTitle, otherTitle } = func;

// Icons
import icons from '../Const/icons';

registerBlockType('b-blocks/divider', {
	// Build In attributes
	title: __('Divider', 'b-blocks'),
	description: __('Divider between sections and blocks', 'b-blocks'),
	icon: icons.minus,
	category: 'bBlocks',
	keywords: [__('Divide', 'b-blocks'), __('Divider', 'b-blocks'), __('Divider Line', 'b-blocks')],
	supports: {
		align: ['center', 'wide', 'full']
	},

	// Custom Attributes
	attributes: {
		align: { type: 'string', default: 'full' },

		divideAlign: { type: 'string', default: 'center' },
		divideWidth: { type: 'number', default: 450 },
		divideWidthType: { type: 'string', default: 'px' },
		divideThick: { type: 'number', default: 3 },
		divideStyle: { type: 'string', default: 'solid' },
		divideColor: { type: 'string', default: '#8344c5' },
		divideMT: { type: 'number', default: 10 },
		divideMB: { type: 'number', default: 15 },
	},

	// Build In Functions
	edit: props => {
		const { attributes: { divideAlign, divideWidth, divideWidthType, divideThick, divideStyle, divideColor, divideMT, divideMB }, setAttributes } = props;

		// Styles
		const containerStyle = { textAlign: divideAlign, padding: `${divideMT}px 0 ${divideMB}px 0` };
		const dividerStyle = { display: 'inline-block', width: `${divideWidth}${divideWidthType}`, borderBottom: `${divideThick}px ${divideStyle} ${divideColor}` };

		return <>
			<InspectorControls>
				{/* Divider Settings */}
				<PanelBody className='bBlocksPanelBody' title={__('Divider Settings', 'b-blocks')} initialOpen={true}>
					{/* Alignment */}
					{firstTitle('Alignment:')}
					<BtnGroup options={aligns} myValue={divideAlign} setState={cng => setAttributes({ divideAlign: cng })} icon={true} />

					{/* Width */}
					{otherTitle('Width:')}
					<BtnGroup options={sizeTypes} myValue={divideWidthType} setState={(cng, def) => setAttributes({ divideWidthType: cng, divideWidth: def })} classes="bBlocksSizeType" size="small" />

					<RangeControl value={divideWidth} onChange={cng => setAttributes({ divideWidth: cng })} min={0} max={("%" == divideWidthType) ? 100 : 1920} step={1} />

					{/* Thickness */}
					{otherTitle('Thickness:')}
					<RangeControl value={divideThick} onChange={cng => setAttributes({ divideThick: cng })} min={0} max={50} step={.1} />

					{/* Style */}
					{otherTitle('Style:')}
					<SelectControl value={divideStyle} onChange={cng => setAttributes({ divideStyle: cng })} options={borderStyles} />

					{/* Color */}
					{otherTitle('Color:')}
					<ColorPalette value={divideColor} onChange={cng => setAttributes({ divideColor: cng })} colors={colors} />

					{/* Margin Top */}
					{otherTitle('Margin Top:')}
					<RangeControl value={divideMT} onChange={cng => setAttributes({ divideMT: cng })} min={0} max={100} step={1} />

					{/* Margin Bottom */}
					{otherTitle('Margin Bottom:')}
					<RangeControl value={divideMB} onChange={cng => setAttributes({ divideMB: cng })} min={0} max={100} step={1} />
				</PanelBody>
			</InspectorControls>


			<div className="b_blocks_divider">
				<div style={containerStyle}>
					<div style={dividerStyle}></div>
				</div>
			</div>
		</>
	},

	save: props => {
		const { divideAlign, divideWidth, divideWidthType, divideThick, divideStyle, divideColor, divideMT, divideMB } = props.attributes;

		// Styles
		const containerStyle = { textAlign: divideAlign, padding: `${divideMT}px 0 ${divideMB}px 0` };
		const dividerStyle = { display: 'inline-block', width: `${divideWidth}${divideWidthType}`, borderBottom: `${divideThick}px ${divideStyle} ${divideColor}` };

		return (
			<div className="b_blocks_divider">
				<div style={containerStyle}>
					<div style={dividerStyle}></div>
				</div>
			</div>
		);
	},

	example: {
		attributes: {
			'preview': true,
		},
	},
});