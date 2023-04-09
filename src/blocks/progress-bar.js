import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { InspectorControls, ColorPalette } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, RangeControl } from '@wordpress/components';

// Variables
import { colors } from '../utils/options';

// Settings Components
import Title from '../../../Components/Title';
import BColor from '../../../Components/BColor';

// Icon
import { progressIcon } from '../utils/icons';

registerBlockType('b-blocks/progress-bar', {
	// Build In attributes
	title: __('Progress Bar', 'b-blocks'),
	description: __('Present your skills, experiences', 'b-blocks'),
	icon: progressIcon,
	category: 'bBlocks',
	keywords: [__('Skills', 'b-blocks'), __('Experiences', 'b-blocks'), __('Progress Width', 'b-blocks')],
	supports: {
		align: ['center', 'wide', 'full']
	},

	// Custom Attributes
	attributes: {
		align: { type: 'string', default: 'center' },

		progressBG: { type: 'string', default: '#e9ecef' },
		progressHeight: { type: 'number', default: 15 },

		progressBarBG: { type: 'string', default: '#8344c5' },
		isLabel: { type: 'boolean', default: true },
		progressBarWidth: { type: 'number', default: 75 },
		progressBarStriped: { type: 'boolean', default: true },
		progressBarStripedColor: { type: 'string', default: '#ffffff26' },
		progressBarAnimation: { type: 'boolean', default: true }
	},

	// Build In Functions
	edit: props => {
		const { attributes: { progressBG, progressHeight, progressBarBG, isLabel, progressBarWidth, progressBarStriped, progressBarStripedColor, progressBarAnimation }, setAttributes } = props;

		// Styles
		const progressStyle = { backgroundColor: progressBG, height: `${progressHeight}px`, marginBottom: '15px' }
		const progressBarStyle = { backgroundColor: progressBarBG, width: `${progressBarWidth}%`, backgroundImage: progressBarStriped ? `linear-gradient(45deg, ${progressBarStripedColor} 25%, transparent 25%, transparent 50%, ${progressBarStripedColor} 50%, ${progressBarStripedColor} 75%, transparent 75%, transparent)` : null }

		return <>
			<InspectorControls>
				{/* Progress Settings */}
				<PanelBody className='bBlocksPanelBody' title={__('Progress Settings', 'b-blocks')} initialOpen={true}>
					{/* Background Color */}
					<Title className=''>{__('Background Color:', 'b-blocks')}</Title>
					<ColorPalette value={progressBG} onChange={cng => setAttributes({ progressBG: cng })} colors={colors} />

					{/* Height */}
					<Title>{__('Height:', 'b-blocks')}</Title>
					<RangeControl value={progressHeight} onChange={cng => setAttributes({ progressHeight: cng })} min={0} max={200} step={1} />
				</PanelBody>


				{/* Progress Bar Settings */}
				<PanelBody className='bBlocksPanelBody' title={__('Progress Bar Settings', 'b-blocks')} initialOpen={false}>
					{/* Background Color */}
					<Title className=''>{__('Background Color:', 'b-blocks')}</Title>
					<ColorPalette value={progressBarBG} onChange={cng => setAttributes({ progressBarBG: cng })} colors={colors} />

					{/* Label */}
					<Title>{__('Label:', 'b-blocks')}</Title>
					<ToggleControl label={isLabel ? 'Disable Label' : 'Enable Label'} checked={isLabel} onChange={cng => setAttributes({ isLabel: cng })} />

					{/* Width */}
					<Title>{__('Width:', 'b-blocks')}</Title>
					<RangeControl value={progressBarWidth} onChange={cng => setAttributes({ progressBarWidth: cng })} min={0} max={100} step={1} />

					{/* Striped */}
					<Title>{__('Striped:', 'b-blocks')}</Title>
					<ToggleControl label={progressBarStriped ? 'Disable Striped' : 'Enable Striped'} checked={progressBarStriped} onChange={cng => setAttributes({ progressBarStriped: cng })} />

					<BColor className='mt20' label={__('Striped Color:', 'b-blocks')} value={progressBarStripedColor} onChange={cng => setAttributes({ progressBarStripedColor: cng })} defaultColor='#ffffff26' />

					{progressBarStriped && <>
						{/* Animation */}
						<Title>{__('Animation', 'b-blocks')}</Title>
						<ToggleControl label={progressBarAnimation ? 'Disable Animation' : 'Enable Animation'} checked={progressBarAnimation} onChange={cng => setAttributes({ progressBarAnimation: cng })} />
					</>}
				</PanelBody>
			</InspectorControls>


			<div className='b_blocks_progress_bar'>
				<div className='progress' style={progressStyle}>
					<div className={`progress-bar ${progressBarStriped ? 'progress-bar-striped' : ''} ${progressBarStriped && progressBarAnimation ? 'progress-bar-animated' : ''}`} role='progressbar' style={progressBarStyle} aria-valuenow={progressBarWidth} aria-valuemin='0' aria-valuemax='100'>{isLabel && `${progressBarWidth}%`}</div>
				</div>
			</div>
		</>
	},

	save: props => {
		const { progressBG, progressHeight, progressBarBG, isLabel, progressBarWidth, progressBarStriped, progressBarStripedColor, progressBarAnimation } = props.attributes;

		// Styles
		const progressStyle = { backgroundColor: progressBG, height: `${progressHeight}px`, marginBottom: '15px', textAlign: 'inherit' }
		const progressBarStyle = { backgroundColor: progressBarBG, width: `${progressBarWidth}%`, backgroundImage: progressBarStriped ? `linear-gradient(45deg, ${progressBarStripedColor} 25%, transparent 25%, transparent 50%, ${progressBarStripedColor} 50%, ${progressBarStripedColor} 75%, transparent 75%, transparent)` : null }

		return (
			<div className='b_blocks_progress_bar'>
				<div className='progress' style={progressStyle}>
					<div className={`progress-bar ${progressBarStriped && 'progress-bar-striped'} ${progressBarAnimation && 'progress-bar-animated'}`} role='progressbar' style={progressBarStyle} aria-valuenow={progressBarWidth} aria-valuemin='0' aria-valuemax='100'>{isLabel && `${progressBarWidth}%`}</div>
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