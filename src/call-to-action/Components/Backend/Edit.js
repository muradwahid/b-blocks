import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';

import { getBackgroundCSS, getColorsCSS, getShadowCSS, getTypoCSS } from '../../../../../bpl-tools/utils/getCSS';
import { sanitizeURL } from '../../../../../bpl-tools/utils/common';

import Settings from './Settings/Settings';
import { prefix } from '../../utils/data';

const getDevicePadding = (padding) => {
	if (!padding) return { desktop: '60px 40px', tablet: '48px 30px', mobile: '36px 20px' };
	return {
		desktop: padding.desktop || '60px 40px',
		tablet: padding.tablet || padding.desktop || '48px 30px',
		mobile: padding.mobile || padding.tablet || padding.desktop || '36px 20px'
	};
};

const Edit = props => {
	const { attributes, setAttributes, clientId } = props;
	const {
		layout, headingTag, textAlign, heading, subText,
		primaryLabel, primaryUrl, primaryTarget,
		showSecondary, secondaryLabel, secondaryUrl, secondaryTarget,
		background, headingTypography, subTypography, headingColor, subColor,
		primaryBtnColors, secondaryBtnColors, btnBorderRadius,
		padding, borderRadius, shadow
	} = attributes;

	const id = `block-${clientId}`;
	const mainSl = `#${id}`;
	const ctaSl = `${mainSl} .${prefix}`;

	const pads = getDevicePadding(padding);
	const HeadingTag = ['h2', 'h3', 'h4'].includes(headingTag) ? headingTag : 'h2';

	const primaryColors = primaryBtnColors || {};
	const secondaryColors = secondaryBtnColors || {};

	return <>
		<Settings attributes={attributes} setAttributes={setAttributes} />

		<div {...useBlockProps()}>
			<style dangerouslySetInnerHTML={{
				__html: `
				${getTypoCSS('', headingTypography)?.googleFontLink || ''}
				${getTypoCSS('', subTypography)?.googleFontLink || ''}
				${getTypoCSS(`${ctaSl} .ctaHeading`, headingTypography)?.styles || ''}
				${getTypoCSS(`${ctaSl} .ctaSubText`, subTypography)?.styles || ''}

				${ctaSl}{
					${getBackgroundCSS(background)}
					padding: ${pads.desktop};
					border-radius: ${borderRadius || '0px'};
					box-shadow: ${getShadowCSS(shadow)};
					text-align: ${textAlign};
				}
				${ctaSl} .ctaHeading{
					color: ${headingColor || '#fff'};
					margin: 0 0 12px 0;
				}
				${ctaSl} .ctaSubText{
					color: ${subColor || '#fff'};
					margin: 0 0 24px 0;
				}
				${ctaSl} .ctaButton{
					border-radius: ${btnBorderRadius || '6px'};
				}
				${ctaSl} .ctaButtonPrimary{
					${getColorsCSS({ color: primaryColors.color, bg: primaryColors.bg })}
				}
				${ctaSl} .ctaButtonPrimary:hover,
				${ctaSl} .ctaButtonPrimary:focus-visible{
					${getColorsCSS({ color: primaryColors.hoverColor, bg: primaryColors.hoverBg })}
				}
				${ctaSl} .ctaButtonSecondary{
					${getColorsCSS({ color: secondaryColors.color, bg: secondaryColors.bg })}
					border: 2px solid ${secondaryColors.color || '#fff'};
				}
				${ctaSl} .ctaButtonSecondary:hover,
				${ctaSl} .ctaButtonSecondary:focus-visible{
					${getColorsCSS({ color: secondaryColors.hoverColor, bg: secondaryColors.hoverBg })}
				}
				@media only screen and (max-width: 1024px) {
					${ctaSl}{
						padding: ${pads.tablet};
					}
				}
				@media only screen and (max-width: 640px) {
					${ctaSl}{
						padding: ${pads.mobile};
					}
				}
			`}} />

			<div className={`${prefix} ctaLayout-${layout || 'centered'}`}>
				<div className='ctaContent'>
					<RichText
						className='ctaHeading'
						tagName={HeadingTag}
						value={heading}
						onChange={val => setAttributes({ heading: val })}
						placeholder={__('Add headline…', 'b-blocks')}
						allowedFormats={['core/bold', 'core/italic']}
						inlineToolbar
					/>

					<RichText
						className='ctaSubText'
						tagName='p'
						value={subText}
						onChange={val => setAttributes({ subText: val })}
						placeholder={__('Add supporting text…', 'b-blocks')}
						inlineToolbar
					/>
				</div>

				<div className='ctaActions'>
					<a
						className='ctaButton ctaButtonPrimary'
						href={sanitizeURL(primaryUrl || '#')}
						target={primaryTarget ? '_blank' : undefined}
						rel={primaryTarget ? 'noopener noreferrer' : undefined}
						onClick={e => e.preventDefault()}
					>
						{primaryLabel || __('Get Started', 'b-blocks')}
					</a>

					{showSecondary && <a
						className='ctaButton ctaButtonSecondary'
						href={sanitizeURL(secondaryUrl || '#')}
						target={secondaryTarget ? '_blank' : undefined}
						rel={secondaryTarget ? 'noopener noreferrer' : undefined}
						onClick={e => e.preventDefault()}
					>
						{secondaryLabel || __('Learn More', 'b-blocks')}
					</a>}
				</div>
			</div>
		</div>
	</>;
};
export default Edit;
