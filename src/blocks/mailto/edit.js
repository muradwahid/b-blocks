import { __ } from '@wordpress/i18n';
import { useEffect } from 'react';
import { RichText } from '@wordpress/block-editor';

// Settings Components
import { getBorderCSS, getColorsCSS, getSpaceCSS, getTypoCSS } from '../../../../Components/utils/getCSS';

import Settings from './Settings';

const Edit = props => {
	const { className, attributes: { mailtoAlign, btn, btnTypo, btnColors, btnHovColors, btnPadding, btnBorder, icon, iconPosition }, setAttributes, clientId } = props;

	useEffect(() => { clientId && setAttributes({ cId: clientId.substring(0, 10) }); }, [clientId]); // Set & Update clientId to cId

	const mailtoSl = `#bBlocksMailto-${clientId} .bBlocksMailto`;

	return <>
		<Settings settings={props} />

		<div className={className} id={`bBlocksMailto-${clientId}`}>
			<style dangerouslySetInnerHTML={{
				__html: `
				${getTypoCSS('', btnTypo)?.googleFontLink}
				${getTypoCSS(`${mailtoSl} a.mailtoButton`, btnTypo)?.styles}

				${mailtoSl}{
					text-align: ${mailtoAlign};
				}
				${mailtoSl} a.mailtoButton{
					${getColorsCSS(btnColors)}
					padding: ${getSpaceCSS(btnPadding)};
					${getBorderCSS(btnBorder)}
					box-shadow: 0px 5px 20px 0px ${btnColors?.bg};
				}
				${mailtoSl} a.mailtoButton:hover{
					${getColorsCSS(btnHovColors)}
					box-shadow: 0px 5px 20px 0px ${btnHovColors?.bg};
				}
			`}} />

			<div className='bBlocksMailto'>
				<a href='#' className='mailtoui mailtoButton'>
					{'left' === iconPosition && icon?.class && <i className={icon?.class}></i>}

					<RichText tagName='span' value={btn} onChange={val => setAttributes({ btn: val })} placeholder={__('Send E-mail', 'b-blocks')} inlineToolbar />

					{'right' === iconPosition && icon?.class && <i className={icon?.class}></i>}
				</a>
			</div>
		</div>
	</>;
};
export default Edit;