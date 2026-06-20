import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';

import Settings from './Settings/Settings';

const LAYOUT_VALUES = ['card', 'inline'];
const ALIGN_VALUES = ['left', 'center', 'right'];
const BUTTON_STYLES = ['filled', 'outline'];

const NETWORK_PREVIEW = [
	{ key: 'twitter', label: __('Share on X', 'b-blocks'), icon: 'fa-brands fa-x-twitter', text: __('Share on X', 'b-blocks') },
	{ key: 'facebook', label: __('Share on Facebook', 'b-blocks'), icon: 'fa-brands fa-facebook-f', text: __('Facebook', 'b-blocks') },
	{ key: 'linkedin', label: __('Share on LinkedIn', 'b-blocks'), icon: 'fa-brands fa-linkedin-in', text: __('LinkedIn', 'b-blocks') },
	{ key: 'whatsapp', label: __('Share on WhatsApp', 'b-blocks'), icon: 'fa-brands fa-whatsapp', text: __('WhatsApp', 'b-blocks') },
	{ key: 'email', label: __('Share by Email', 'b-blocks'), icon: 'fa-solid fa-envelope', text: __('Email', 'b-blocks') }
];

const Edit = (props) => {
	const { attributes, setAttributes } = props;
	const {
		viewStyle,
		quoteText,
		citeText,
		platforms = {},
		layout,
		alignment,
		showQuoteIcon,
		showButtonLabels,
		copyButtonLabel,
		colors = {},
		buttonStyle,
		border = {},
		buttonBorderRadius,
		padding = {},
		fontSize,
		fontWeight
	} = attributes;

	const VIEW_STYLES = ['default', 'minimal', 'card', 'highlight', 'quote-marks', 'tweet'];
	const safeViewStyle = VIEW_STYLES.includes(viewStyle) ? viewStyle : 'default';

	const safeLayout = LAYOUT_VALUES.includes(layout) ? layout : 'card';
	const safeAlign = ALIGN_VALUES.includes(alignment) ? alignment : 'left';
	const safeBtnStyle = BUTTON_STYLES.includes(buttonStyle) ? buttonStyle : 'filled';

	const wrapperClasses = [
		'bb-click-to-share',
		`bb-cts-view--${safeViewStyle}`,
		`bb-cts-layout--${safeLayout}`,
		`bb-cts-align--${safeAlign}`,
		`bb-cts-btn--${safeBtnStyle}`
	].join(' ');

	const wrapperStyle = {
		'--bb-cts-bg': colors.bg || '#f0f7ff',
		'--bb-cts-text': colors.text || '#1a1a1a',
		'--bb-cts-quote-icon': colors.quoteIcon || '#0575e6',
		'--bb-cts-border': colors.border || '#0575e6',
		'--bb-cts-border-width': border.width || '4px',
		'--bb-cts-radius': border.radius || '6px',
		'--bb-cts-btn-bg': colors.buttonBg || '#0575e6',
		'--bb-cts-btn-text': colors.buttonText || '#ffffff',
		'--bb-cts-btn-radius': buttonBorderRadius || '4px',
		'--bb-cts-pad-top': padding.top || '20px',
		'--bb-cts-pad-right': padding.right || '24px',
		'--bb-cts-pad-bottom': padding.bottom || '20px',
		'--bb-cts-pad-left': padding.left || '24px',
		'--bb-cts-font-size': fontSize || '18px',
		'--bb-cts-font-weight': fontWeight || '600'
	};

	const blockProps = useBlockProps({
		className: wrapperClasses,
		style: wrapperStyle
	});

	const activeNetworks = NETWORK_PREVIEW.filter((n) => !!platforms[n.key]);
	const showCopy = !!platforms.copy;
	const hasAnyAction = activeNetworks.length > 0 || showCopy;

	return (
		<>
			<Settings attributes={attributes} setAttributes={setAttributes} />

			<div {...blockProps}>
				<figure className='bb-cts-card'>
					{showQuoteIcon && (
						<span className='bb-cts-quote-icon' aria-hidden='true'>
							<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 24 24' fill='currentColor' focusable='false'>
								<path d='M7.17 6C4.87 6 3 7.87 3 10.17v3.66C3 16.13 4.87 18 7.17 18h.66c.46 0 .83-.37.83-.83V13.5c0-.46-.37-.83-.83-.83H6.5c-.28 0-.5-.22-.5-.5v-1.67c0-1.01.82-1.83 1.83-1.83h.67c.46 0 .83-.37.83-.83V6.83c0-.46-.37-.83-.83-.83h-1.33zm9 0c-2.3 0-4.17 1.87-4.17 4.17v3.66C12 16.13 13.87 18 16.17 18h.66c.46 0 .83-.37.83-.83V13.5c0-.46-.37-.83-.83-.83h-1.33c-.28 0-.5-.22-.5-.5v-1.67c0-1.01.82-1.83 1.83-1.83h.67c.46 0 .83-.37.83-.83V6.83c0-.46-.37-.83-.83-.83h-1.33z' />
							</svg>
						</span>
					)}

					<blockquote className='bb-cts-quote'>
						<RichText
							tagName='p'
							className='bb-cts-quote-text'
							value={quoteText || ''}
							onChange={(val) => setAttributes({ quoteText: val })}
							placeholder={__('Type the quote you want readers to share…', 'b-blocks')}
							allowedFormats={['core/bold', 'core/italic', 'core/link']}
						/>
						{citeText && (
							<footer className='bb-cts-cite'>
								<cite>{citeText}</cite>
							</footer>
						)}
					</blockquote>

					{hasAnyAction && (
						<div className='bb-cts-actions' role='group' aria-label={__('Share this quote', 'b-blocks')}>
							{activeNetworks.map((net) => (
								<span
									key={net.key}
									className={`bb-cts-btn bb-cts-btn--${net.key}`}
									aria-label={net.label}
								>
									<span className='bb-cts-btn__icon' aria-hidden='true'>
										<i className={net.icon}></i>
									</span>
									{showButtonLabels && (
										<span className='bb-cts-btn__text'>{net.text}</span>
									)}
								</span>
							))}

							{showCopy && (
								<span
									className='bb-cts-btn bb-cts-btn--copy'
									aria-label={copyButtonLabel || __('Copy Link', 'b-blocks')}
								>
									<span className='bb-cts-btn__icon' aria-hidden='true'>
										<i className='fa-regular fa-copy'></i>
									</span>
									{showButtonLabels && (
										<span className='bb-cts-btn__text'>
											{copyButtonLabel || __('Copy Link', 'b-blocks')}
										</span>
									)}
								</span>
							)}
						</div>
					)}
				</figure>
			</div>
		</>
	);
};

export default Edit;
