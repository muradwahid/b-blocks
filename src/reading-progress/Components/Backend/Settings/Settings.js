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

const POSITION_OPTIONS = [
	{ label: __('Top', 'b-blocks'), value: 'top' },
	{ label: __('Bottom', 'b-blocks'), value: 'bottom' },
];

const TARGET_OPTIONS = [
	{ label: __('Entire page', 'b-blocks'), value: 'page' },
	{ label: __('Post content only', 'b-blocks'), value: 'content' },
];

const clampInt = (value, min, max, fallback) => {
	const n = parseInt(value, 10);
	if (Number.isNaN(n)) return fallback;
	if (n < min) return min;
	if (n > max) return max;
	return n;
};

const Settings = ({ attributes, setAttributes }) => {
	const {
		position,
		height,
		foregroundColor,
		backgroundColor,
		borderRadius,
		zIndex,
		scrollTarget,
		contentSelector,
		hideOnMobile,
		animationDuration,
	} = attributes;

	return (
		<InspectorControls>
			<HelpPanel slug={pluginSlug} />

			<PanelBody
				className='bPlPanelBody'
				title={__('Layout', 'b-blocks')}
				initialOpen={true}
			>
				<SelectControl
					label={__('Position', 'b-blocks')}
					value={position || 'top'}
					options={POSITION_OPTIONS}
					onChange={(val) => setAttributes({ position: val })}
					help={__('Pin the bar to the top or bottom of the viewport.', 'b-blocks')}
					__nextHasNoMarginBottom
				/>

				<RangeControl
					label={__('Bar height (px)', 'b-blocks')}
					value={clampInt(height, 1, 20, 4)}
					onChange={(val) => setAttributes({ height: clampInt(val, 1, 20, 4) })}
					min={1}
					max={20}
					step={1}
					__nextHasNoMarginBottom
				/>

				<RangeControl
					label={__('Border radius (px)', 'b-blocks')}
					value={clampInt(borderRadius, 0, 20, 0)}
					onChange={(val) => setAttributes({ borderRadius: clampInt(val, 0, 20, 0) })}
					min={0}
					max={20}
					step={1}
					__nextHasNoMarginBottom
				/>

				<RangeControl
					label={__('Z-index', 'b-blocks')}
					value={clampInt(zIndex, 1, 99999, 9999)}
					onChange={(val) => setAttributes({ zIndex: clampInt(val, 1, 99999, 9999) })}
					min={1}
					max={99999}
					step={1}
					help={__('Set high so the bar sits above your theme header.', 'b-blocks')}
					__nextHasNoMarginBottom
				/>

				<ToggleControl
					label={__('Hide on mobile', 'b-blocks')}
					checked={!!hideOnMobile}
					onChange={(val) => setAttributes({ hideOnMobile: !!val })}
					help={__('Hide the bar on viewports narrower than 768px.', 'b-blocks')}
				/>
			</PanelBody>

			<PanelBody
				className='bPlPanelBody'
				title={__('Colors', 'b-blocks')}
				initialOpen={false}
			>
				<PanelRow>
					<Label className=''>{__('Fill color:', 'b-blocks')}</Label>
					<ColorControl
						value={foregroundColor || '#0073aa'}
						onChange={(val) => setAttributes({ foregroundColor: val || '#0073aa' })}
						defaultColor='#0073aa'
					/>
				</PanelRow>

				<PanelRow>
					<Label className=''>{__('Track color:', 'b-blocks')}</Label>
					<ColorControl
						value={backgroundColor || ''}
						onChange={(val) => setAttributes({ backgroundColor: val || '' })}
						defaultColor='#e0e0e0'
					/>
				</PanelRow>
				<p
					style={{
						fontSize: 12,
						color: '#50575e',
						margin: '4px 0 0',
					}}
				>
					{__('Clearing the track color makes the unfilled portion transparent.', 'b-blocks')}
				</p>
			</PanelBody>

			<PanelBody
				className='bPlPanelBody'
				title={__('Behavior', 'b-blocks')}
				initialOpen={false}
			>
				<SelectControl
					label={__('Scroll target', 'b-blocks')}
					value={scrollTarget || 'page'}
					options={TARGET_OPTIONS}
					onChange={(val) => setAttributes({ scrollTarget: val })}
					help={__('"Entire page" measures the full document; "Post content only" measures the first matching content element below.', 'b-blocks')}
					__nextHasNoMarginBottom
				/>

				{scrollTarget === 'content' && (
					<TextControl
						label={__('Content CSS selector (optional)', 'b-blocks')}
						value={contentSelector || ''}
						onChange={(val) => setAttributes({ contentSelector: val || '' })}
						placeholder='.entry-content'
						help={__('Leave blank to auto-detect article, .entry-content, .post-content, or main.', 'b-blocks')}
						__nextHasNoMarginBottom
					/>
				)}

				<RangeControl
					label={__('Transition duration (ms)', 'b-blocks')}
					value={clampInt(animationDuration, 0, 300, 0)}
					onChange={(val) => setAttributes({ animationDuration: clampInt(val, 0, 300, 0) })}
					min={0}
					max={300}
					step={10}
					help={__('Set to 0 to disable. Always disabled when the visitor opts into reduced motion.', 'b-blocks')}
					__nextHasNoMarginBottom
				/>
			</PanelBody>
		</InspectorControls>
	);
};

export default Settings;
