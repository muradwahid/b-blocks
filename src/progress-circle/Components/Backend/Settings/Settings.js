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

const lineCapOptions = [
	{ label: __('Round', 'b-blocks'), value: 'round' },
	{ label: __('Flat', 'b-blocks'), value: 'butt' },
];

const labelTypeOptions = [
	{ label: __('Percentage', 'b-blocks'), value: 'percentage' },
	{ label: __('Custom Text', 'b-blocks'), value: 'custom' },
];

const Settings = ({ attributes, setAttributes }) => {
	const {
		percentage,
		size,
		strokeWidth,
		fillColor,
		trackColor,
		lineCap,
		showLabel,
		labelType,
		customLabel,
		labelColor,
		labelFontSize,
		prefix,
		suffix,
		showTitle,
		title,
		titleColor,
		titleFontSize,
		animate,
		animationDuration,
	} = attributes;

	return (
		<InspectorControls>
			<HelpPanel slug={pluginSlug} />

			<PanelBody className='bPlPanelBody' title={__('Value', 'b-blocks')} initialOpen={true}>
				<RangeControl
					label={__('Percentage', 'b-blocks')}
					value={percentage}
					onChange={(val) => setAttributes({ percentage: val })}
					min={0}
					max={100}
					step={1}
				/>
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={__('Style', 'b-blocks')} initialOpen={false}>
				<RangeControl
					label={__('Size (px)', 'b-blocks')}
					help={__('Diameter of the circle.', 'b-blocks')}
					value={size}
					onChange={(val) => setAttributes({ size: val })}
					min={80}
					max={400}
					step={4}
				/>

				<RangeControl
					label={__('Stroke Width (px)', 'b-blocks')}
					value={strokeWidth}
					onChange={(val) => setAttributes({ strokeWidth: val })}
					min={2}
					max={40}
					step={1}
				/>

				<SelectControl
					label={__('Line Cap', 'b-blocks')}
					value={lineCap}
					options={lineCapOptions}
					onChange={(val) => setAttributes({ lineCap: val })}
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
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={__('Label', 'b-blocks')} initialOpen={false}>
				<ToggleControl
					label={__('Show Label', 'b-blocks')}
					checked={showLabel}
					onChange={(val) => setAttributes({ showLabel: val })}
				/>

				{showLabel && (
					<>
						<SelectControl
							label={__('Label Type', 'b-blocks')}
							value={labelType}
							options={labelTypeOptions}
							onChange={(val) => setAttributes({ labelType: val })}
						/>

						{labelType === 'custom' && (
							<TextControl
								label={__('Custom Label', 'b-blocks')}
								value={customLabel}
								onChange={(val) => setAttributes({ customLabel: val })}
								placeholder={__('e.g. Goal', 'b-blocks')}
							/>
						)}

						{labelType === 'percentage' && (
							<>
								<TextControl
									label={__('Number Prefix', 'b-blocks')}
									value={prefix}
									onChange={(val) => setAttributes({ prefix: val })}
									placeholder={__('e.g. $', 'b-blocks')}
								/>

								<TextControl
									label={__('Number Suffix', 'b-blocks')}
									value={suffix}
									onChange={(val) => setAttributes({ suffix: val })}
									placeholder={__('e.g. %', 'b-blocks')}
								/>
							</>
						)}

						<RangeControl
							label={__('Label Font Size (px)', 'b-blocks')}
							value={labelFontSize}
							onChange={(val) => setAttributes({ labelFontSize: val })}
							min={10}
							max={80}
							step={1}
						/>

						<PanelRow>
							<Label className=''>{__('Label Color:', 'b-blocks')}</Label>
							<ColorControl
								value={labelColor}
								onChange={(val) => setAttributes({ labelColor: val || '' })}
								defaultColor=''
							/>
						</PanelRow>
					</>
				)}
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={__('Title', 'b-blocks')} initialOpen={false}>
				<ToggleControl
					label={__('Show Title', 'b-blocks')}
					checked={showTitle}
					onChange={(val) => setAttributes({ showTitle: val })}
				/>

				{showTitle && (
					<>
						<TextControl
							label={__('Title', 'b-blocks')}
							value={title}
							onChange={(val) => setAttributes({ title: val })}
							placeholder={__('Progress', 'b-blocks')}
						/>

						<RangeControl
							label={__('Title Font Size (px)', 'b-blocks')}
							value={titleFontSize}
							onChange={(val) => setAttributes({ titleFontSize: val })}
							min={10}
							max={40}
							step={1}
						/>

						<PanelRow>
							<Label className=''>{__('Title Color:', 'b-blocks')}</Label>
							<ColorControl
								value={titleColor}
								onChange={(val) => setAttributes({ titleColor: val || '' })}
								defaultColor=''
							/>
						</PanelRow>
					</>
				)}
			</PanelBody>

			<PanelBody className='bPlPanelBody' title={__('Animation', 'b-blocks')} initialOpen={false}>
				<ToggleControl
					label={__('Animate on Scroll', 'b-blocks')}
					help={__('Fill the arc from 0% to the target value when it scrolls into view.', 'b-blocks')}
					checked={animate}
					onChange={(val) => setAttributes({ animate: val })}
				/>

				{animate && (
					<RangeControl
						label={__('Animation Duration (ms)', 'b-blocks')}
						value={animationDuration}
						onChange={(val) => setAttributes({ animationDuration: val })}
						min={300}
						max={3000}
						step={100}
					/>
				)}
			</PanelBody>
		</InspectorControls>
	);
};

export default Settings;
