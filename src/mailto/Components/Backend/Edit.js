import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';

import { getBorderCSS, getColorsCSS, getSpaceCSS, getTypoCSS } from '../../../../../bpl-tools/utils/getCSS';

import Settings from './Settings/Settings';
import { prefix } from '../../utils/data';

const Edit = props => {
	const { attributes: { mailtoAlign, btn, btnTypo, btnColors, btnHovColors, btnPadding, btnBorder, icon, iconPosition }, setAttributes, clientId } = props;

	const id = `block-${clientId}`;
	const mailtoSl = `#${id} .${prefix}`;

	return <>
		<Settings settings={props} />

		<div {...useBlockProps()}>
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

			<div className={prefix}>
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