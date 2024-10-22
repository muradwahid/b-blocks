import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';

import { getBackgroundCSS, getBorderCSS, getColorsCSS, getIconCSS, getShadowCSS, getSpaceCSS, getTypoCSS } from '../../../../../bpl-tools/utils/getCSS';

import Settings from './Settings/Settings';
import { prefix } from '../../utils/data';

const Edit = props => {
	const { attributes: { infoBoxAlign, textAlign, width, background, padding, border, shadow, isIcon, icon, iconMargin, title, titleTypo, titleColor, titleMargin, isDesc, desc, descTypo, descColor, descMargin, isBtn, btn, btnLink, isLinkNewTab, btnTypo, btnColors, btnHovColors, btnPadding, btnBorder }, setAttributes, clientId } = props;

	const id = `${prefix}-${clientId}`;

	const mainSl = `#${id}`;
	const infoBoxSl = `${mainSl} .${prefix}`;

	return <>
		<Settings settings={props} />

		<div {...useBlockProps()} id={id}>
			<style dangerouslySetInnerHTML={{
				__html: `
				${getTypoCSS('', titleTypo)?.googleFontLink}
				${getTypoCSS('', descTypo)?.googleFontLink}
				${getTypoCSS('', btnTypo)?.googleFontLink}
				${getTypoCSS(`${infoBoxSl} .infoBoxTitle`, titleTypo)?.styles}
				${getTypoCSS(`${infoBoxSl} .infoBoxDescription`, descTypo)?.styles}
				${getTypoCSS(`${infoBoxSl} .infoBoxButton`, btnTypo)?.styles}

				${mainSl}{
					text-align: ${infoBoxAlign};
				}
				${infoBoxSl}{
					text-align: ${textAlign};
					width: ${['0px', '0%', '0em'].includes(width) ? 'auto' : width};
					${getBackgroundCSS(background)}
					padding: ${getSpaceCSS(padding)};
					${getBorderCSS(border)}
					box-shadow: ${getShadowCSS(shadow)};
				}
				${infoBoxSl} .infoBoxIcon{
					margin: ${getSpaceCSS(iconMargin)};
				}
				${infoBoxSl} .infoBoxIcon i{
					${getIconCSS(icon)}
				}
				${infoBoxSl} .infoBoxTitle{
					color: ${titleColor};
					margin: ${getSpaceCSS(titleMargin)};
				}
				${infoBoxSl} .infoBoxDescription{
					color: ${descColor};
					margin: ${getSpaceCSS(descMargin)};
				}
				${infoBoxSl} .infoBoxButton{
					${getColorsCSS(btnColors)}
					padding: ${getSpaceCSS(btnPadding)};
					${getBorderCSS(btnBorder)}
				}
				${infoBoxSl} .infoBoxButton:hover{
					${getColorsCSS(btnHovColors)}
				}
			`}} />

			<div className={prefix}>
				{isIcon && icon?.class && <div className='infoBoxIcon'><i className={icon?.class}></i></div>}

				<RichText className='infoBoxTitle' tagName='h3' value={title} onChange={val => setAttributes({ title: val })} placeholder={__('Info box title', 'b-blocks')} inlineToolbar />

				{isDesc && <RichText className='infoBoxDescription' tagName='p' value={desc} onChange={val => setAttributes({ desc: val })} placeholder={__('Info box description', 'b-blocks')} inlineToolbar />}

				{isBtn && <RichText className='infoBoxButton' tagName='a' value={btn} href={btnLink} target={isLinkNewTab ? '_blank' : ''} rel='noreferrer noopener' onChange={val => setAttributes({ btn: val })} placeholder={__('Click Me', 'b-blocks')} inlineToolbar />}
			</div>
		</div>
	</>;
};
export default Edit;