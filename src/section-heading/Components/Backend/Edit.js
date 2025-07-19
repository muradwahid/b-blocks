import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';

// Components
import { getSeparatorCSS, getSpaceCSS, getTypoCSS, isValidCSS } from '../../../../../bpl-tools/utils/getCSS';

import Settings from './Settings/Settings';
import { prefix } from '../../utils/data';

const Edit = props => {
	const { attributes, setAttributes, clientId } = props;
	const { textAlign, title, titleTypo, titleColor, titleMargin, isSep, separator, sepMargin, isDesc, desc, descTypo, descColor, descMargin } = attributes;

	const id = `block-${clientId}`;

	const headingSl = `#${id} .${prefix}`;
	const titleSl = `${headingSl} .sectionHeadingTitle`;
	const descSl = `${headingSl} .sectionHeadingDescription`;

	return <>
		<Settings attributes={attributes} setAttributes={setAttributes} />

		<div {...useBlockProps()}>
			<style dangerouslySetInnerHTML={{
				__html: `
				${getTypoCSS('', titleTypo)?.googleFontLink}
				${getTypoCSS('', descTypo)?.googleFontLink}
				${getTypoCSS(titleSl, titleTypo)?.styles}
				${getTypoCSS(descSl, descTypo)?.styles}

				${headingSl}{
					${isValidCSS('text-align', textAlign)}
				}
				${titleSl}{
					${isValidCSS('color', titleColor)}
					margin: ${getSpaceCSS(titleMargin)};
				}
				${headingSl} .sectionHeadingSeparator{
					${getSeparatorCSS(separator)}
					margin: ${getSpaceCSS(sepMargin)};
				}
				${descSl}{
					${isValidCSS('color', descColor)}
					margin: ${getSpaceCSS(descMargin)};
				}
			`}} />

			<div className={prefix}>
				<RichText className='sectionHeadingTitle' tagName='h2' value={title} onChange={val => setAttributes({ title: val })} placeholder={__('Section heading title', 'b-blocks')} inlineToolbar />

				{isSep && <span className='sectionHeadingSeparator'></span>}

				{isDesc && <RichText className='sectionHeadingDescription' tagName='p' value={desc} onChange={val => setAttributes({ desc: val })} placeholder={__('Section heading description', 'b-blocks')} inlineToolbar />}
			</div>
		</div>
	</>;
};
export default Edit;