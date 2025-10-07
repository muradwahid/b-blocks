import { sanitizeURL } from '../../../../bpl-tools/utils/common';
import { prefix } from './data';

export const btnProps = (attributes, security = 'none', securityPass, isPremium, isBackend = false) => {
	const { actionType = 'link', url, tooltip, tooltipPos = 'top', target, attrs = { rel: 'noreferrer', referrerpolicy: 'no-referrer' }, isDownload, downloadFileName = '', animationType, animationDuration, addID } = attributes;

	const hrefProps = (url && (securityPass || 'none' === security)) ? { href: sanitizeURL(url) } : {};
	const downloadProps = (isDownload) ? { download: isPremium ? downloadFileName : '' } : {};
	const proAttrs = isPremium ? attrs : {};
	const linkProps = 'popup' === actionType || isBackend ? {} : { ...hrefProps, target, ...proAttrs, ...downloadProps };
	const tooltipProps = { tooltip, 'tooltip-pos': isPremium ? tooltipPos : 'top' }
	const animationProps = {
		'data-aos': animationType,
		// 'data-aos-offset': 100,
		// 'data-aos-delay': 50,
		'data-aos-duration': animationDuration * 1000,
		// 'data-aos-easing':'ease-in-out',
		// 'data-aos-mirror':false,
		// 'data-aos-once':false,
		// 'data-aos-anchor-placement':'bottom-bottom'
	}

	return {
		className: isBackend ? `${prefix} btnEditor` : prefix,
		...linkProps,
		...tooltipProps,
		...animationProps,
		id: addID
	}
}