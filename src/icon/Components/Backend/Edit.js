import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

import Settings from './Settings/Settings';

const Edit = (props) => {
	const { attributes } = props;
	const {
		iconClass,
		iconSize,
		iconColor,
		iconBgColor,
		bgShape,
		bgSize,
		bgPadding,
		borderColor,
		borderWidth,
		borderRadius,
		linkUrl,
		ariaLabel,
		alignment,
		maxWidth,
		hoverColor,
		hoverBgColor,
		rotate,
		shadow,
	} = attributes;

	const safeAlignment = ['left', 'center', 'right'].includes(alignment) ? alignment : 'center';
	const safeShape = ['none', 'circle', 'square', 'rounded'].includes(bgShape) ? bgShape : 'none';
	const safeRotate = [0, 45, 90, 135, 180].includes(parseInt(rotate, 10)) ? parseInt(rotate, 10) : 0;
	const hasBg = safeShape !== 'none';
	const hasHover = !!(hoverColor || hoverBgColor);

	const clamp = (val, min, max, fallback) => {
		const n = parseInt(val, 10);
		if (Number.isNaN(n)) return fallback;
		return Math.max(min, Math.min(max, n));
	};

	const resolvedRadius = safeShape === 'circle'
		? '50%'
		: safeShape === 'rounded'
			? `${clamp(borderRadius, 0, 50, 50)}%`
			: '0';

	const shadowMap = {
		none: 'none',
		small: '0 1px 3px rgba(0,0,0,0.12)',
		medium: '0 4px 12px rgba(0,0,0,0.15)',
		large: '0 10px 24px rgba(0,0,0,0.20)',
	};
	const safeShadow = ['none', 'small', 'medium', 'large'].includes(shadow) ? shadow : 'none';
	const mw = clamp(maxWidth, 0, 1000, 0);

	const wrapperStyle = {
		'--bb-icon-size': `${clamp(iconSize, 12, 200, 48)}px`,
		'--bb-icon-color': (iconColor || '').toString().trim() || 'inherit',
		'--bb-icon-rotate': `${safeRotate}deg`,
		'--bb-icon-bg': (iconBgColor || '').toString().trim() || 'transparent',
		'--bb-icon-bg-size': `${clamp(bgSize, 24, 300, 80)}px`,
		'--bb-icon-bg-padding': `${clamp(bgPadding, 0, 80, 16)}px`,
		'--bb-icon-bg-radius': resolvedRadius,
		'--bb-icon-border-width': `${clamp(borderWidth, 0, 8, 0)}px`,
		'--bb-icon-border-color': (borderColor || '').toString().trim() || 'transparent',
		'--bb-icon-shadow': shadowMap[safeShadow],
	};
	if (hoverColor) wrapperStyle['--bb-icon-hover-color'] = hoverColor;
	if (hoverBgColor) wrapperStyle['--bb-icon-hover-bg'] = hoverBgColor;
	if (mw > 0) wrapperStyle['--bb-icon-max-width'] = `${mw}px`;

	const wrapperClasses = [
		'bb-icon-block',
		`bb-icon-align--${safeAlignment}`,
		hasBg ? `bb-icon--shape-${safeShape}` : '',
		hasBg ? 'has-icon-bg' : '',
		hasHover ? 'has-hover' : '',
		mw > 0 ? 'has-max-width' : '',
	].filter(Boolean).join(' ');

	const blockProps = useBlockProps({
		className: wrapperClasses,
		style: wrapperStyle,
	});

	const resolvedIcon = (iconClass || '').toString().trim() || 'fa-solid fa-star';
	const isLinked = !!(linkUrl || '').toString().trim();
	const linkTitle = (ariaLabel || '').toString().trim() || __('Icon link', 'b-blocks');

	const iconNode = <i className={resolvedIcon} aria-hidden='true' />;

	return (
		<>
			<Settings {...props} />

			<div {...blockProps}>
				{isLinked ? (
					<span className='bb-icon-link' title={linkTitle}>
						<span className='bb-icon-inner'>{iconNode}</span>
					</span>
				) : (
					<span className='bb-icon-inner'>{iconNode}</span>
				)}
			</div>
		</>
	);
};

export default Edit;
