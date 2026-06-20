import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

import Settings from './Settings/Settings';

/**
 * Resolve the effective desktop pixel value for a responsive object,
 * falling back through desktop → tablet → mobile → default.
 */
const resolveFont = (responsive, fallback) => {
	const r = responsive || {};
	const desk = (r.desktop || '').toString().trim();
	if (desk) return desk;
	const tab = (r.tablet || '').toString().trim();
	if (tab) return tab;
	const mob = (r.mobile || '').toString().trim();
	if (mob) return mob;
	return fallback;
};

const ALLOWED_TAGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'];
const ALLOWED_ALIGNS = ['left', 'center', 'right'];
const ALLOWED_WEIGHTS = ['300', '400', '500', '600', '700', '800', '900'];

const Edit = (props) => {
	const { attributes, setAttributes } = props;
	const {
		prefix,
		suffix,
		words = [],
		headingTag,
		textAlign,
		fontSize = {},
		fontWeight,
		lineHeight,
		prefixColor,
		animatedColor,
		cursorColor,
		backgroundColor,
		padding = {},
		showCursor,
		cursorChar,
	} = attributes;

	const safeTag = ALLOWED_TAGS.includes(headingTag) ? headingTag : 'h2';
	const safeAlign = ALLOWED_ALIGNS.includes(textAlign) ? textAlign : 'center';
	const safeWeight = ALLOWED_WEIGHTS.includes((fontWeight || '').toString()) ? fontWeight : '700';

	const fontSizeDesktop = resolveFont(fontSize, '42px');
	const fontSizeTablet = (fontSize?.tablet || '').toString().trim() || fontSizeDesktop;
	const fontSizeMobile = (fontSize?.mobile || '').toString().trim() || fontSizeTablet;

	const safeAnimated = (animatedColor || '').toString().trim() || '#146EF5';
	const safeCursor = (cursorColor || '').toString().trim() || safeAnimated;
	const safePrefixColor = (prefixColor || '').toString().trim() || 'inherit';
	const safeBg = (backgroundColor || '').toString().trim() || 'transparent';

	const safeLineHeight = (lineHeight || '').toString().trim() || '1.2';

	const padTop = (padding?.top || '').toString().trim() || '20px';
	const padRight = (padding?.right || '').toString().trim() || '0px';
	const padBottom = (padding?.bottom || '').toString().trim() || '20px';
	const padLeft = (padding?.left || '').toString().trim() || '0px';

	const wrapperStyle = {
		'--bb-th-prefix-color': safePrefixColor,
		'--bb-th-animated-color': safeAnimated,
		'--bb-th-cursor-color': safeCursor,
		'--bb-th-bg': safeBg,
		'--bb-th-font-size-desktop': fontSizeDesktop,
		'--bb-th-font-size-tablet': fontSizeTablet,
		'--bb-th-font-size-mobile': fontSizeMobile,
		'--bb-th-font-weight': safeWeight,
		'--bb-th-line-height': safeLineHeight,
		'--bb-th-pad-top': padTop,
		'--bb-th-pad-right': padRight,
		'--bb-th-pad-bottom': padBottom,
		'--bb-th-pad-left': padLeft,
		'--bb-th-text-align': safeAlign,
	};

	const wrapperClasses = [
		'bb-th-block',
		`bb-th-align--${safeAlign}`,
		showCursor ? 'has-cursor' : 'no-cursor',
	].filter(Boolean).join(' ');

	const blockProps = useBlockProps({
		className: wrapperClasses,
		style: wrapperStyle,
	});

	// Editor preview: render the heading with prefix + first non-empty
	// word + suffix. No animation in the editor (animations during
	// editing are distracting and would re-run on every keystroke).
	const firstWord = (Array.isArray(words) ? words : [])
		.map((w) => (w && typeof w.text === 'string' ? w.text : ''))
		.find((t) => t.trim() !== '') || __('your value prop', 'b-blocks');

	const cursorPreview = showCursor
		? (cursorChar && cursorChar.toString().trim() ? cursorChar.toString().charAt(0) : '|')
		: '';

	const HeadingTag = safeTag;

	return (
		<>
			<Settings
				attributes={attributes}
				setAttributes={setAttributes}
			/>

			<div {...blockProps}>
				<HeadingTag className='bb-th'>
					{prefix ? <span className='bb-th-prefix'>{prefix}</span> : null}
					<span className='bb-th-animated' style={{ color: safeAnimated }}>
						{firstWord}
						{showCursor && (
							<span className='typed-cursor' style={{ color: safeCursor }}>
								{cursorPreview}
							</span>
						)}
					</span>
					{suffix ? <span className='bb-th-suffix'>{suffix}</span> : null}
					<span
						className='bb-th-hint'
						aria-hidden='true'
						title={__('On the published page, the highlighted word rotates through the full list.', 'b-blocks')}
					>
						{__('↻ Animated', 'b-blocks')}
					</span>
				</HeadingTag>
			</div>
		</>
	);
};

export default Edit;
