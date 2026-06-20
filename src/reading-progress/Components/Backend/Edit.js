import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

import Settings from './Settings/Settings';

const clampInt = (value, min, max, fallback) => {
	const n = parseInt(value, 10);
	if (Number.isNaN(n)) return fallback;
	if (n < min) return min;
	if (n > max) return max;
	return n;
};

const Edit = (props) => {
	const { attributes, setAttributes } = props;
	const {
		position,
		height,
		foregroundColor,
		backgroundColor,
		borderRadius,
		scrollTarget,
		hideOnMobile,
	} = attributes;

	const safePosition = position === 'bottom' ? 'bottom' : 'top';
	const safeHeight = clampInt(height, 1, 20, 4);
	const safeRadius = clampInt(borderRadius, 0, 20, 0);

	const previewStyle = {
		'--bb-rp-preview-color': foregroundColor || '#0073aa',
		'--bb-rp-preview-bg': backgroundColor || '#e0e0e0',
		'--bb-rp-preview-height': `${safeHeight}px`,
		'--bb-rp-preview-radius': `${safeRadius}px`,
	};

	const blockProps = useBlockProps({
		className: 'bb-rp-editor-placeholder',
	});

	const positionLabel = safePosition === 'top'
		? __('Top of viewport', 'b-blocks')
		: __('Bottom of viewport', 'b-blocks');

	const targetLabel = scrollTarget === 'content'
		? __('Post content only', 'b-blocks')
		: __('Entire page', 'b-blocks');

	return (
		<>
			<Settings
				attributes={attributes}
				setAttributes={setAttributes}
			/>

			<div {...blockProps}>
				<div className='bb-rp-editor-header'>
					<span className='bb-rp-editor-header__icon' aria-hidden='true'>📖</span>
					<span>{__('Reading Progress Bar', 'b-blocks')}</span>
				</div>

				<p className='bb-rp-editor-note'>
					{__('A thin bar will appear at the chosen position of the viewport on the frontend, filling as the reader scrolls. The preview below shows a sample 60% fill — the bar is not visible inside the editor.', 'b-blocks')}
				</p>

				{safePosition === 'top' && (
					<div className='bb-rp-editor-preview' style={previewStyle}>
						<div className='bb-rp-editor-preview__fill' />
					</div>
				)}

				<div className='bb-rp-editor-meta'>
					<span className='bb-rp-editor-meta__item'>
						<span className='bb-rp-editor-meta__key'>{__('Position:', 'b-blocks')}</span>
						<span>{positionLabel}</span>
					</span>
					<span className='bb-rp-editor-meta__item'>
						<span className='bb-rp-editor-meta__key'>{__('Height:', 'b-blocks')}</span>
						<span>{`${safeHeight}px`}</span>
					</span>
					<span className='bb-rp-editor-meta__item'>
						<span className='bb-rp-editor-meta__key'>{__('Measure:', 'b-blocks')}</span>
						<span>{targetLabel}</span>
					</span>
					{hideOnMobile && (
						<span className='bb-rp-editor-meta__item'>
							<span className='bb-rp-editor-meta__key'>{__('Mobile:', 'b-blocks')}</span>
							<span>{__('Hidden below 768px', 'b-blocks')}</span>
						</span>
					)}
				</div>

				{safePosition === 'bottom' && (
					<div className='bb-rp-editor-preview bb-rp-editor-preview--bottom' style={previewStyle}>
						<div className='bb-rp-editor-preview__fill' />
					</div>
				)}
			</div>
		</>
	);
};

export default Edit;
