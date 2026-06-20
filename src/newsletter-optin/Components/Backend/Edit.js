import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	RichText,
	BlockControls,
	AlignmentToolbar,
} from '@wordpress/block-editor';

import Settings from './Settings/Settings';

const ALIGN_VALUES = ['left', 'center', 'right'];
const LAYOUT_VALUES = ['stacked', 'inline'];

const Edit = (props) => {
	const { attributes, setAttributes } = props;
	const {
		layout,
		alignment,
		headline,
		subtext,
		showHeadline,
		showSubtext,
		showNameField,
		namePlaceholder,
		emailPlaceholder,
		buttonText,
		headlineFontSize,
		headlineFontWeight,
		subtextFontSize,
		inputFontSize,
		buttonFontSize,
		buttonFontWeight,
		backgroundColor,
		headlineColor,
		subtextColor,
		inputBgColor,
		inputTextColor,
		inputBorderColor,
		buttonBgColor,
		buttonTextColor,
		buttonHoverBgColor,
		borderRadius,
		inputBorderRadius,
		paddingVertical,
		paddingHorizontal,
		fieldGap,
		maxWidth,
	} = attributes;

	const safeLayout = LAYOUT_VALUES.includes(layout) ? layout : 'stacked';
	const safeAlign = ALIGN_VALUES.includes(alignment) ? alignment : 'center';
	const isInline = safeLayout === 'inline';

	const wrapperClasses = [
		'bb-newsletter-optin',
		`bb-no-layout--${safeLayout}`,
		`bb-no-align--${safeAlign}`,
	].join(' ');

	const wrapperStyle = {
		'--bb-no-bg': backgroundColor || '#f8f9fa',
		'--bb-no-headline': headlineColor || '#1a1a1a',
		'--bb-no-subtext': subtextColor || '#555555',
		'--bb-no-input-bg': inputBgColor || '#ffffff',
		'--bb-no-input-text': inputTextColor || '#333333',
		'--bb-no-input-border': inputBorderColor || '#cccccc',
		'--bb-no-btn-bg': buttonBgColor || '#0461c4',
		'--bb-no-btn-text': buttonTextColor || '#ffffff',
		'--bb-no-btn-hover': buttonHoverBgColor || '#0461c4',
		'--bb-no-radius': `${borderRadius ?? 8}px`,
		'--bb-no-input-radius': `${inputBorderRadius ?? 6}px`,
		'--bb-no-pad-v': `${paddingVertical ?? 40}px`,
		'--bb-no-pad-h': `${paddingHorizontal ?? 40}px`,
		'--bb-no-gap': `${fieldGap ?? 12}px`,
		'--bb-no-max-width': `${maxWidth ?? 600}px`,
		'--bb-no-headline-fs': `${headlineFontSize ?? 24}px`,
		'--bb-no-headline-fw': headlineFontWeight || '700',
		'--bb-no-subtext-fs': `${subtextFontSize ?? 16}px`,
		'--bb-no-input-fs': `${inputFontSize ?? 15}px`,
		'--bb-no-btn-fs': `${buttonFontSize ?? 15}px`,
		'--bb-no-btn-fw': buttonFontWeight || '600',
	};

	const blockProps = useBlockProps({
		className: wrapperClasses,
		style: wrapperStyle,
	});

	const labelClass = isInline ? 'bb-no-label screen-reader-text' : 'bb-no-label';

	return (
		<>
			<BlockControls>
				<AlignmentToolbar
					value={safeAlign}
					onChange={(val) => setAttributes({ alignment: val || 'center' })}
				/>
			</BlockControls>

			<Settings attributes={attributes} setAttributes={setAttributes} />

			<div {...blockProps}>
				<div className='bb-no-inner'>
					{showHeadline && (
						<RichText
							tagName='div'
							className='bb-no-headline'
							value={headline || ''}
							onChange={(val) => setAttributes({ headline: val })}
							placeholder={__('Subscribe to our newsletter', 'b-blocks')}
							allowedFormats={['core/bold', 'core/italic']}
						/>
					)}

					{showSubtext && (
						<RichText
							tagName='div'
							className='bb-no-subtext'
							value={subtext || ''}
							onChange={(val) => setAttributes({ subtext: val })}
							placeholder={__('Get the latest posts delivered straight to your inbox.', 'b-blocks')}
							allowedFormats={['core/bold', 'core/italic', 'core/link']}
						/>
					)}

					<div className='bb-no-form'>
						<div className='bb-no-fields'>
							{showNameField && (
								<div className='bb-no-field bb-no-field--name'>
									<label className={labelClass}>
										{namePlaceholder || __('Your name', 'b-blocks')}
									</label>
									<input
										type='text'
										className='bb-no-input bb-no-input--name'
										placeholder={namePlaceholder || __('Your name', 'b-blocks')}
										readOnly
										tabIndex={-1}
									/>
								</div>
							)}

							<div className='bb-no-field bb-no-field--email'>
								<label className={labelClass}>
									{emailPlaceholder || __('Your email address', 'b-blocks')}
								</label>
								<input
									type='email'
									className='bb-no-input bb-no-input--email'
									placeholder={emailPlaceholder || __('Your email address', 'b-blocks')}
									readOnly
									tabIndex={-1}
								/>
							</div>

							<div className='bb-no-field bb-no-field--submit'>
								<button type='button' className='bb-no-button' tabIndex={-1}>
									<span className='bb-no-button__label'>
										{buttonText || __('Subscribe', 'b-blocks')}
									</span>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Edit;
