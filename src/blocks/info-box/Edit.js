import { __ } from '@wordpress/i18n';
import { useEffect } from 'react';
import { RichText } from '@wordpress/block-editor';

// Components
import { getBackgroundCSS, getBorderCSS, getColorsCSS, getIconCSS, getShadowCSS, getSpaceCSS, getTypoCSS } from '../../../../Components/utils/getCSS';

import Settings from './Settings';

const Edit = props => {
	const { className, attributes: { infoBoxAlign, textAlign, width, background, padding, border, shadow, isIcon, icon, iconMargin, title, titleTypo, titleColor, titleMargin, isDesc, desc, descTypo, descColor, descMargin, isBtn, btn, btnLink, isLinkNewTab, btnTypo, btnColors, btnHovColors, btnPadding, btnBorder }, setAttributes, clientId } = props;

	useEffect(() => { clientId && setAttributes({ cId: clientId.substring(0, 10) }); }, [clientId]); // Set & Update clientId to cId

	const mainSl = `#bBlocksInfoBox-${clientId}`;
	const infoBoxSl = `${mainSl} .bBlocksInfoBox`;

	return <>
		<Settings settings={props} />

		<div className={className} id={`bBlocksInfoBox-${clientId}`}>
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

			<div className='bBlocksInfoBox'>
				{isIcon && icon?.class && <div className='infoBoxIcon'><i className={icon?.class}></i></div>}

				<RichText className='infoBoxTitle' tagName='h3' value={title} onChange={val => setAttributes({ title: val })} placeholder={__('Info box title', 'b-blocks')} inlineToolbar />

				{isDesc && <RichText className='infoBoxDescription' tagName='p' value={desc} onChange={val => setAttributes({ desc: val })} placeholder={__('Info box description', 'b-blocks')} inlineToolbar />}

				{isBtn && <RichText className='infoBoxButton' tagName='a' value={btn} href={btnLink} target={isLinkNewTab ? '_blank' : ''} rel='noreferrer noopener' onChange={val => setAttributes({ btn: val })} placeholder={__('Click Me', 'b-blocks')} inlineToolbar />}
			</div>
		</div>
	</>;
};
export default Edit;