import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	InnerBlocks,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	PanelBody,
	SelectControl,
	RangeControl,
	ToggleControl,
} from '@wordpress/components';

const ANIMATION_OPTIONS = [
	{ label: __('Fade Up', 'b-blocks'), value: 'fade-up' },
	{ label: __('Fade Down', 'b-blocks'), value: 'fade-down' },
	{ label: __('Fade Left', 'b-blocks'), value: 'fade-left' },
	{ label: __('Fade Right', 'b-blocks'), value: 'fade-right' },
	{ label: __('Fade Only', 'b-blocks'), value: 'fade' },
];

const EASING_OPTIONS = [
	{ label: __('Ease Out', 'b-blocks'), value: 'ease-out' },
	{ label: __('Ease In-Out', 'b-blocks'), value: 'ease-in-out' },
	{ label: __('Linear', 'b-blocks'), value: 'linear' },
];

// Build the pre-animation transform used only for the editor preview.
const previewTransform = (animation, distance) => {
	switch (animation) {
		case 'fade-up':
			return `translate3d(0, ${distance}px, 0)`;
		case 'fade-down':
			return `translate3d(0, -${distance}px, 0)`;
		case 'fade-left':
			return `translate3d(${distance}px, 0, 0)`;
		case 'fade-right':
			return `translate3d(-${distance}px, 0, 0)`;
		default:
			return 'none';
	}
};

const Edit = (props) => {
	const { attributes, setAttributes } = props;
	const {
		animation,
		duration,
		delay,
		easing,
		translateDistance,
		triggerThreshold,
		once,
		previewInEditor,
	} = attributes;

	const isFadeOnly = animation === 'fade';

	const blockProps = useBlockProps({
		className: `bb-scroll-reveal bb-sr-anim-${animation}`,
	});

	// Editor-only preview of the pre-animation (hidden/offset) state.
	const previewStyle = previewInEditor
		? {
				opacity: 0.25,
				transform: previewTransform(animation, translateDistance),
			}
		: undefined;

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Animation', 'b-blocks')} initialOpen={true}>
					<SelectControl
						label={__('Animation Preset', 'b-blocks')}
						value={animation}
						options={ANIMATION_OPTIONS}
						onChange={(val) => setAttributes({ animation: val })}
						__nextHasNoMarginBottom
					/>
					{!isFadeOnly && (
						<RangeControl
							label={__('Translate Distance (px)', 'b-blocks')}
							help={__('How far the block slides in from.', 'b-blocks')}
							value={translateDistance}
							onChange={(val) => setAttributes({ translateDistance: val ?? 40 })}
							min={10}
							max={120}
							step={5}
							__nextHasNoMarginBottom
						/>
					)}
					<RangeControl
						label={__('Duration (ms)', 'b-blocks')}
						value={duration}
						onChange={(val) => setAttributes({ duration: val ?? 600 })}
						min={200}
						max={2000}
						step={50}
						__nextHasNoMarginBottom
					/>
					<RangeControl
						label={__('Delay (ms)', 'b-blocks')}
						help={__('Stagger multiple reveals by giving each a different delay.', 'b-blocks')}
						value={delay}
						onChange={(val) => setAttributes({ delay: val ?? 0 })}
						min={0}
						max={2000}
						step={50}
						__nextHasNoMarginBottom
					/>
					<SelectControl
						label={__('Easing', 'b-blocks')}
						value={easing}
						options={EASING_OPTIONS}
						onChange={(val) => setAttributes({ easing: val })}
						__nextHasNoMarginBottom
					/>
				</PanelBody>

				<PanelBody title={__('Trigger', 'b-blocks')} initialOpen={false}>
					<RangeControl
						label={__('Trigger Threshold', 'b-blocks')}
						help={__('Fraction of the block that must be visible before the animation starts.', 'b-blocks')}
						value={triggerThreshold}
						onChange={(val) => setAttributes({ triggerThreshold: val ?? 0.15 })}
						min={0}
						max={0.5}
						step={0.05}
						__nextHasNoMarginBottom
					/>
					<ToggleControl
						label={__('Play once only', 'b-blocks')}
						help={__('When off, the animation replays every time the block scrolls back into view.', 'b-blocks')}
						checked={once}
						onChange={(val) => setAttributes({ once: !!val })}
						__nextHasNoMarginBottom
					/>
				</PanelBody>

				<PanelBody title={__('Preview', 'b-blocks')} initialOpen={false}>
					<ToggleControl
						label={__('Show pre-animation state in editor', 'b-blocks')}
						help={__('Preview the hidden/offset starting position. Does not affect the frontend.', 'b-blocks')}
						checked={previewInEditor}
						onChange={(val) => setAttributes({ previewInEditor: !!val })}
						__nextHasNoMarginBottom
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div className='bb-sr-inner' style={previewStyle}>
					<InnerBlocks
						templateLock={false}
						renderAppender={InnerBlocks.ButtonBlockAppender}
					/>
				</div>
			</div>
		</>
	);
};

export default Edit;
