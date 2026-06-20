import { __, sprintf } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';

import Settings from './Settings/Settings';

const ALIGN_VALUES = ['left', 'center', 'right'];

const Edit = (props) => {
	const { attributes, setAttributes } = props;
	const {
		couponCode,
		couponType,
		title,
		description,
		discountLabel,
		buttonLabel,
		dealButtonLabel,
		revealMode,
		revealButtonLabel,
		expiryText,
		alignment,
		colors = {},
		border = {},
		padding = {},
		codeFontSize,
	} = attributes;

	const safeType = couponType === 'deal' ? 'deal' : 'coupon';
	const safeAlign = ALIGN_VALUES.includes(alignment) ? alignment : 'center';
	const isRevealMode = !!revealMode && safeType === 'coupon';

	const wrapperClasses = [
		'bb-coupon-code',
		`bb-cc-type--${safeType}`,
		`bb-cc-align--${safeAlign}`,
		isRevealMode ? 'bb-cc-has-reveal is-revealed' : '',
	].filter(Boolean).join(' ');

	const wrapperStyle = {
		'--bb-cc-bg': colors.bg || '#f9f9f9',
		'--bb-cc-text': colors.text || '#333333',
		'--bb-cc-code-bg': colors.codeBg || '#ffffff',
		'--bb-cc-code-text': colors.codeText || '#333333',
		'--bb-cc-btn-bg': colors.buttonBg || '#0073aa',
		'--bb-cc-btn-text': colors.buttonText || '#ffffff',
		'--bb-cc-discount-bg': colors.discountBg || '#0073aa',
		'--bb-cc-discount-text': colors.discountText || '#ffffff',
		'--bb-cc-border-width': border.width || '1px',
		'--bb-cc-border-color': border.color || '#dddddd',
		'--bb-cc-radius': border.radius || '8px',
		'--bb-cc-pad-top': padding.top || '20px',
		'--bb-cc-pad-right': padding.right || '24px',
		'--bb-cc-pad-bottom': padding.bottom || '20px',
		'--bb-cc-pad-left': padding.left || '24px',
		'--bb-cc-code-font-size': codeFontSize || '20px',
	};

	const blockProps = useBlockProps({
		className: wrapperClasses,
		style: wrapperStyle,
	});

	return (
		<>
			<Settings attributes={attributes} setAttributes={setAttributes} />

			<div {...blockProps}>
				<div className='bb-cc-card'>
					<div className='bb-cc-discount'>
						<RichText
							tagName='span'
							className='bb-cc-discount__text'
							value={discountLabel || ''}
							onChange={(val) => setAttributes({ discountLabel: val })}
							placeholder={__('20% OFF', 'b-blocks')}
							allowedFormats={[]}
						/>
					</div>

					<div className='bb-cc-body'>
						<RichText
							tagName='h3'
							className='bb-cc-title'
							value={title || ''}
							onChange={(val) => setAttributes({ title: val })}
							placeholder={__('Special Offer', 'b-blocks')}
							allowedFormats={['core/bold', 'core/italic']}
						/>

						<RichText
							tagName='div'
							className='bb-cc-description'
							value={description || ''}
							onChange={(val) => setAttributes({ description: val })}
							placeholder={__('Add a short description of the offer (optional)…', 'b-blocks')}
							allowedFormats={['core/bold', 'core/italic', 'core/link']}
						/>

						{safeType === 'coupon' ? (
							<div className='bb-cc-code-row'>
								<div
									className='bb-cc-code-btn'
									role='group'
									aria-label={__('Coupon code preview', 'b-blocks')}
								>
									<RichText
										tagName='code'
										className='bb-cc-code bb-cc-code-edit'
										value={couponCode || ''}
										onChange={(val) => setAttributes({ couponCode: val })}
										placeholder={__('SAVE20', 'b-blocks')}
										allowedFormats={[]}
									/>
									<span className='bb-cc-copy-label'>
										{buttonLabel || __('Copy Code', 'b-blocks')}
									</span>
								</div>
							</div>
						) : (
							<div className='bb-cc-code-row bb-cc-code-row--deal'>
								<span className='bb-cc-deal-btn'>
									{dealButtonLabel || __('Get This Deal', 'b-blocks')}
								</span>
							</div>
						)}

						{isRevealMode && (
							<p
								className='bb-cc-editor-note'
								style={{
									margin: 0,
									fontSize: '12px',
									opacity: 0.7,
									fontStyle: 'italic',
								}}
							>
								{sprintf(
									/* translators: %s: reveal button label */
									__('Reveal mode is on. Visitors will see a "%s" button before the code is shown.', 'b-blocks'),
									revealButtonLabel || __('Reveal Code', 'b-blocks')
								)}
							</p>
						)}

						{expiryText && (
							<p className='bb-cc-expiry'>
								<span className='bb-cc-expiry__icon' aria-hidden='true'>
									<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
										<circle cx='12' cy='12' r='10'></circle>
										<polyline points='12 6 12 12 16 14'></polyline>
									</svg>
								</span>
								<time className='bb-cc-expiry__text'>{expiryText}</time>
							</p>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default Edit;
