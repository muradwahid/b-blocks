import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	RangeControl,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';

import { Label, ColorControl, HelpPanel } from '../../../../../../bpl-tools/Components';

import { pluginSlug } from '../../../../utils/data';

const percentagePositionOptions = [
	{ label: __('At the end', 'b-blocks'), value: 'end' },
	{ label: __('Inside the bar', 'b-blocks'), value: 'inside' },
];

const titlePositionOptions = [
	{ label: __('Above the bar', 'b-blocks'), value: 'above' },
	{ label: __('Inline (beside the bar)', 'b-blocks'), value: 'inline' },
];

const Settings = ({ attributes, setAttributes }) => {
	const {
		title,
		showTitle,
		percentage,
		showPercentage,
		percentagePosition,
		titlePosition,
		height,
		borderRadius,
		fillColor,
		trackColor,
		titleColor,
		percentageColor,
		titleFontSize,
		striped,
		animate,
		animationDuration,
	} = attributes;

	return (
		<InspectorControls>
			<HelpPanel slug={pluginSlug} />

			<PanelBody className='bPlPanelBody' title={__('Content', 'b-blocks')} initialOpen={true}>
				<TextControl
					label={__('Bar Label', 'b-blocks')}
					value={title}
					onChange={(val) => setAttributes({ title: val })}
					placeholder={__('Progress', 'b-blocks')}
				/>

				<ToggleControl
					label={__('Show Title', 'b-blocks')}
					checked={showTitle}
					onChange={(val) => setAttributes({ showTitle: val })}
				/>

				<RangeControl
					label={__('Percentage', 'b-blocks')}
					value={percentage}
					onChange={(val) => setAttributes({ percentage: val })}
					min={0}
					max={100}
					step={1}
				/>

				<ToggleControl
					label={__('Show Percentage', 'b-blocks')}
					checked={showPercentage}
					onChange={(val) => setAttributes({ showPercentage: val })}
				/>

				{showPercentage && (
					<SelectControl
						label={__('Percentage Position', 'b-blocks')}
						value={percentagePosition}
						options={percentagePositionOptions}
						onChange={(val) => setAttributes({ percentagePosition: val })}
					/>
				)}

				{showTitle && (
					<SelectControl
						label={__('Title Position', 'b-blocks')}
						value={titlePosition}
						options={titlePositionOptions}
						onChange={(val) => setAttributes({ titlePosition: val })}
					/>
				)}
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={__('Style', 'b-blocks')} initialOpen={false}>
				<RangeControl
					label={__('Bar Height (px)', 'b-blocks')}
					value={height}
					onChange={(val) => setAttributes({ height: val })}
					min={8}
					max={60}
					step={1}
				/>

				<RangeControl
					label={__('Border Radius (px)', 'b-blocks')}
					value={borderRadius}
					onChange={(val) => setAttributes({ borderRadius: val })}
					min={0}
					max={40}
					step={1}
				/>

				<PanelRow>
					<Label className=''>{__('Fill Color:', 'b-blocks')}</Label>
					<ColorControl
						value={fillColor}
						onChange={(val) => setAttributes({ fillColor: val })}
						defaultColor='#4f46e5'
					/>
				</PanelRow>

				<PanelRow>
					<Label className=''>{__('Track Color:', 'b-blocks')}</Label>
					<ColorControl
						value={trackColor}
						onChange={(val) => setAttributes({ trackColor: val })}
						defaultColor='#e5e7eb'
					/>
				</PanelRow>

				<PanelRow>
					<Label className=''>{__('Title Color:', 'b-blocks')}</Label>
					<ColorControl
						value={titleColor}
						onChange={(val) => setAttributes({ titleColor: val || '' })}
						defaultColor=''
					/>
				</PanelRow>

				<PanelRow>
					<Label className=''>{__('Percentage Color:', 'b-blocks')}</Label>
					<ColorControl
						value={percentageColor}
						onChange={(val) => setAttributes({ percentageColor: val })}
						defaultColor='#ffffff'
					/>
				</PanelRow>

				<RangeControl
					label={__('Title Font Size (px)', 'b-blocks')}
					value={titleFontSize}
					onChange={(val) => setAttributes({ titleFontSize: val })}
					min={10}
					max={40}
					step={1}
				/>

				<ToggleControl
					label={__('Striped Fill', 'b-blocks')}
					help={__('Add a diagonal stripe pattern to the fill.', 'b-blocks')}
					checked={striped}
					onChange={(val) => setAttributes({ striped: val })}
				/>
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={__('Behavior', 'b-blocks')} initialOpen={false}>
				<ToggleControl
					label={__('Animate on Scroll', 'b-blocks')}
					help={__('Fill the bar from 0% to the target value when it scrolls into view.', 'b-blocks')}
					checked={animate}
					onChange={(val) => setAttributes({ animate: val })}
				/>

				<RangeControl
					label={__('Animation Duration (ms)', 'b-blocks')}
					value={animationDuration}
					onChange={(val) => setAttributes({ animationDuration: val })}
					min={300}
					max={3000}
					step={100}
					disabled={!animate}
				/>
			</PanelBody>
		</InspectorControls>
	);
};

export default Settings;
