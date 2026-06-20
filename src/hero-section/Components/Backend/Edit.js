import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText, BlockControls, AlignmentToolbar } from '@wordpress/block-editor';

import Settings from './Settings/Settings';

const MIN_HEIGHT_OPTIONS = ['100vh', '90vh', '75vh', '60vh', '50vh', 'auto'];
const ALIGN_OPTIONS = ['left', 'center', 'right'];
const VALIGN_OPTIONS = ['top', 'middle', 'bottom'];
const BG_TYPE_OPTIONS = ['color', 'gradient', 'image', 'video'];
const BG_POSITION_OPTIONS = ['center center', 'top center', 'bottom center', 'center left', 'center right', 'top left', 'top right', 'bottom left', 'bottom right'];
const BG_SIZE_OPTIONS = ['cover', 'contain', 'auto'];
const HEADING_TAGS = ['h1', 'h2', 'h3'];
const FONT_WEIGHTS_HEADING = ['400', '500', '600', '700', '800', '900'];
const FONT_WEIGHTS_BTN = ['400', '500', '600', '700'];
const SECONDARY_VARIANTS = ['outline', 'ghost', 'solid'];

const clamp = (val, min, max, fallback) => {
	const n = parseInt(val, 10);
	if (Number.isNaN(n)) return fallback;
	return Math.max(min, Math.min(max, n));
};

const pick = (val, list, fallback) => (list.includes(val) ? val : fallback);

const Edit = (props) => {
	const { attributes, setAttributes } = props;
	const {
		minHeight,
		contentAlign,
		verticalAlign,
		contentMaxWidth,
		paddingTop,
		paddingBottom,
		bgType,
		bgColor,
		bgGradientFrom,
		bgGradientTo,
		bgGradientAngle,
		bgImageUrl,
		bgImagePosition,
		bgImageSize,
		bgVideoPosterUrl,
		overlayColor,
		overlayOpacity,
		showEyebrow,
		eyebrowText,
		eyebrowColor,
		eyebrowBgColor,
		eyebrowFontSize,
		eyebrowFontWeight,
		eyebrowLetterSpacing,
		headingText,
		headingTag,
		headingFontSize,
		headingFontWeight,
		headingColor,
		headingLineHeight,
		showSubHeading,
		subHeadingText,
		subHeadingFontSize,
		subHeadingColor,
		subHeadingMaxWidth,
		showPrimaryBtn,
		primaryBtnText,
		primaryBtnBgColor,
		primaryBtnTextColor,
		primaryBtnBorderRadius,
		primaryBtnPaddingV,
		primaryBtnPaddingH,
		primaryBtnFontSize,
		primaryBtnFontWeight,
		showSecondaryBtn,
		secondaryBtnText,
		secondaryBtnVariant,
		secondaryBtnColor,
		secondaryBtnTextColor,
		secondaryBtnBorderRadius,
		secondaryBtnPaddingV,
		secondaryBtnPaddingH,
		secondaryBtnFontSize,
		secondaryBtnFontWeight,
		btnGap,
	} = attributes;

	const safeMinHeight = pick(minHeight, MIN_HEIGHT_OPTIONS, '60vh');
	const safeContentAlign = pick(contentAlign, ALIGN_OPTIONS, 'center');
	const safeVerticalAlign = pick(verticalAlign, VALIGN_OPTIONS, 'middle');
	const safeBgType = pick(bgType, BG_TYPE_OPTIONS, 'color');
	const safeHeadingTag = pick(headingTag, HEADING_TAGS, 'h1');
	const safeHeadingWeight = pick(headingFontWeight, FONT_WEIGHTS_HEADING, '700');
	const safeEyebrowWeight = pick(eyebrowFontWeight, ['400', '500', '600', '700', '800'], '600');
	const safePrimaryWeight = pick(primaryBtnFontWeight, FONT_WEIGHTS_BTN, '600');
	const safeSecondaryWeight = pick(secondaryBtnFontWeight, FONT_WEIGHTS_BTN, '600');
	const safeSecondaryVariant = pick(secondaryBtnVariant, SECONDARY_VARIANTS, 'outline');
	const safeBgImagePosition = pick(bgImagePosition, BG_POSITION_OPTIONS, 'center center');
	const safeBgImageSize = pick(bgImageSize, BG_SIZE_OPTIONS, 'cover');

	const cMaxWidth = clamp(contentMaxWidth, 320, 1400, 800);
	const pTop = clamp(paddingTop, 0, 320, 96);
	const pBottom = clamp(paddingBottom, 0, 320, 96);
	const oOpacity = clamp(overlayOpacity, 0, 100, 40);
	const eFontSize = clamp(eyebrowFontSize, 10, 32, 13);
	const eLetterSpacing = clamp(eyebrowLetterSpacing, 0, 10, 2);
	const hFontSize = clamp(headingFontSize, 20, 96, 56);
	const hLineHeight = clamp(headingLineHeight, 80, 200, 120);
	const sFontSize = clamp(subHeadingFontSize, 12, 36, 18);
	const sMaxWidth = clamp(subHeadingMaxWidth, 200, 1200, 600);
	const pbRadius = clamp(primaryBtnBorderRadius, 0, 50, 6);
	const pbPadV = clamp(primaryBtnPaddingV, 4, 40, 14);
	const pbPadH = clamp(primaryBtnPaddingH, 8, 80, 28);
	const pbFontSize = clamp(primaryBtnFontSize, 12, 28, 16);
	const sbRadius = clamp(secondaryBtnBorderRadius, 0, 50, 6);
	const sbPadV = clamp(secondaryBtnPaddingV, 4, 40, 14);
	const sbPadH = clamp(secondaryBtnPaddingH, 8, 80, 28);
	const sbFontSize = clamp(secondaryBtnFontSize, 12, 28, 16);
	const gap = clamp(btnGap, 4, 64, 16);

	const showOverlay = oOpacity > 0 && (safeBgType === 'image' || safeBgType === 'gradient' || safeBgType === 'video');

	// Build the gradient string used as the canvas preview when bgType=gradient.
	const gradientCss = `linear-gradient(${clamp(bgGradientAngle, 0, 360, 135)}deg, ${bgGradientFrom || '#1a1a2e'} 0%, ${bgGradientTo || '#16213e'} 100%)`;

	let bgStyle = {};
	if (safeBgType === 'color') {
		bgStyle = { background: bgColor || '#1a1a2e' };
	} else if (safeBgType === 'gradient') {
		bgStyle = { background: gradientCss };
	} else if (safeBgType === 'image' && bgImageUrl) {
		bgStyle = {
			backgroundImage: `url(${bgImageUrl})`,
			backgroundPosition: safeBgImagePosition,
			backgroundSize: safeBgImageSize,
			backgroundRepeat: 'no-repeat',
		};
	} else if (safeBgType === 'video') {
		// Editor canvas shows the poster image (or fallback color) — no
		// playing video in the canvas to keep the editor still.
		bgStyle = {
			background: bgColor || '#1a1a2e',
		};
		if (bgVideoPosterUrl) {
			bgStyle = {
				backgroundImage: `url(${bgVideoPosterUrl})`,
				backgroundPosition: 'center center',
				backgroundSize: 'cover',
				backgroundRepeat: 'no-repeat',
			};
		}
	}

	const wrapperClasses = [
		'bb-hs',
		`bb-hs-bg--${safeBgType}`,
		`bb-hs-align--${safeContentAlign}`,
		`bb-hs-valign--${safeVerticalAlign}`,
	].filter(Boolean).join(' ');

	const wrapperStyle = {
		position: 'relative',
		display: 'flex',
		width: '100%',
		minHeight: safeMinHeight === 'auto' ? 'auto' : safeMinHeight,
		paddingTop: `${pTop}px`,
		paddingBottom: `${pBottom}px`,
		overflow: 'hidden',
		alignItems: safeVerticalAlign === 'top' ? 'flex-start' : (safeVerticalAlign === 'bottom' ? 'flex-end' : 'center'),
	};

	const overlayStyle = {
		position: 'absolute',
		inset: 0,
		zIndex: 1,
		background: overlayColor || '#000000',
		opacity: oOpacity / 100,
		pointerEvents: 'none',
	};

	const containerStyle = {
		position: 'relative',
		zIndex: 2,
		width: '100%',
		maxWidth: `${cMaxWidth}px`,
		marginLeft: 'auto',
		marginRight: 'auto',
		paddingLeft: 24,
		paddingRight: 24,
		display: 'flex',
		flexDirection: 'column',
		gap: 20,
		textAlign: safeContentAlign,
		alignItems: safeContentAlign === 'left' ? 'flex-start' : (safeContentAlign === 'right' ? 'flex-end' : 'center'),
	};

	const eyebrowStyle = {
		display: 'inline-block',
		color: eyebrowColor || '#ffffff',
		background: eyebrowBgColor || 'rgba(255,255,255,0.14)',
		fontSize: `${eFontSize}px`,
		fontWeight: safeEyebrowWeight,
		letterSpacing: `${eLetterSpacing}px`,
		textTransform: 'uppercase',
		padding: '6px 14px',
		borderRadius: 999,
		lineHeight: 1.4,
	};

	const headlineStyle = {
		margin: 0,
		color: headingColor || '#ffffff',
		fontSize: `${hFontSize}px`,
		fontWeight: safeHeadingWeight,
		lineHeight: hLineHeight / 100,
	};

	const subHeadlineStyle = {
		margin: 0,
		color: subHeadingColor || 'rgba(255,255,255,0.85)',
		fontSize: `${sFontSize}px`,
		lineHeight: 1.55,
		maxWidth: `${sMaxWidth}px`,
		...(safeContentAlign === 'center' ? { marginLeft: 'auto', marginRight: 'auto' } : {}),
	};

	const actionsStyle = {
		display: 'flex',
		flexWrap: 'wrap',
		gap: `${gap}px`,
		marginTop: 8,
		justifyContent: safeContentAlign === 'center' ? 'center' : (safeContentAlign === 'right' ? 'flex-end' : 'flex-start'),
	};

	const primaryBtnStyle = {
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center',
		background: primaryBtnBgColor || '#ffffff',
		color: primaryBtnTextColor || '#1a1a2e',
		borderRadius: `${pbRadius}px`,
		padding: `${pbPadV}px ${pbPadH}px`,
		fontSize: `${pbFontSize}px`,
		fontWeight: safePrimaryWeight,
		textDecoration: 'none',
		border: 'none',
		cursor: 'pointer',
		lineHeight: 1.2,
	};

	const secondaryBgFor = (variant) => {
		if (variant === 'solid') return secondaryBtnColor || '#ffffff';
		return 'transparent';
	};
	const secondaryBorderFor = (variant) => {
		if (variant === 'outline') return `2px solid ${secondaryBtnColor || '#ffffff'}`;
		return 'none';
	};

	const secondaryBtnStyle = {
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center',
		background: secondaryBgFor(safeSecondaryVariant),
		color: secondaryBtnTextColor || '#ffffff',
		borderRadius: `${sbRadius}px`,
		padding: `${sbPadV}px ${sbPadH}px`,
		fontSize: `${sbFontSize}px`,
		fontWeight: safeSecondaryWeight,
		textDecoration: 'none',
		border: secondaryBorderFor(safeSecondaryVariant),
		cursor: 'pointer',
		lineHeight: 1.2,
	};

	const blockProps = useBlockProps({
		className: wrapperClasses,
		style: wrapperStyle,
	});

	const HeadingTag = safeHeadingTag;

	return (
		<>
			<Settings attributes={attributes} setAttributes={setAttributes} />

			<BlockControls>
				<AlignmentToolbar
					value={safeContentAlign}
					onChange={(val) => setAttributes({ contentAlign: pick(val, ALIGN_OPTIONS, 'center') })}
				/>
			</BlockControls>

			<section {...blockProps}>
				<div className='bb-hs-bg' aria-hidden='true' style={bgStyle} />

				{showOverlay && (
					<div className='bb-hs-overlay' aria-hidden='true' style={overlayStyle} />
				)}

				<div className='bb-hs-container' style={containerStyle}>
					{showEyebrow && (
						<RichText
							tagName='span'
							className='bb-hs-eyebrow'
							style={eyebrowStyle}
							value={eyebrowText}
							onChange={(val) => setAttributes({ eyebrowText: val })}
							placeholder={__('Eyebrow label', 'b-blocks')}
							allowedFormats={['core/bold', 'core/italic']}
							inlineToolbar
						/>
					)}

					<RichText
						tagName={HeadingTag}
						className='bb-hs-headline'
						style={headlineStyle}
						value={headingText}
						onChange={(val) => setAttributes({ headingText: val })}
						placeholder={__('Add a powerful headline…', 'b-blocks')}
						allowedFormats={['core/bold', 'core/italic']}
						inlineToolbar
					/>

					{showSubHeading && (
						<RichText
							tagName='p'
							className='bb-hs-subheadline'
							style={subHeadlineStyle}
							value={subHeadingText}
							onChange={(val) => setAttributes({ subHeadingText: val })}
							placeholder={__('Add supporting copy…', 'b-blocks')}
							allowedFormats={['core/bold', 'core/italic', 'core/link']}
							inlineToolbar
						/>
					)}

					{(showPrimaryBtn || showSecondaryBtn) && (
						<div className='bb-hs-actions' style={actionsStyle}>
							{showPrimaryBtn && (
								<RichText
									tagName='a'
									className='bb-hs-cta bb-hs-cta--primary'
									style={primaryBtnStyle}
									value={primaryBtnText}
									onChange={(val) => setAttributes({ primaryBtnText: val })}
									placeholder={__('Primary CTA', 'b-blocks')}
									allowedFormats={[]}
									withoutInteractiveFormatting
									onClick={(e) => e.preventDefault()}
								/>
							)}

							{showSecondaryBtn && (
								<RichText
									tagName='a'
									className={`bb-hs-cta bb-hs-cta--secondary bb-hs-cta--${safeSecondaryVariant}`}
									style={secondaryBtnStyle}
									value={secondaryBtnText}
									onChange={(val) => setAttributes({ secondaryBtnText: val })}
									placeholder={__('Secondary CTA', 'b-blocks')}
									allowedFormats={[]}
									withoutInteractiveFormatting
									onClick={(e) => e.preventDefault()}
								/>
							)}
						</div>
					)}
				</div>
			</section>
		</>
	);
};

export default Edit;
