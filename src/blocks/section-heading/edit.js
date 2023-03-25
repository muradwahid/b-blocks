import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { RichText } from '@wordpress/block-editor';

// Components
import { getSeparatorCSS, getSpaceCSS, getTypoCSS } from '../../../../Components/Helper/getCSS';

import Settings from './settings';

const Edit = props => {
	const { className, attributes: { textAlign, title, titleTypo, titleColor, titleMargin, isSep, separator, sepMargin, isDesc, desc, descTypo, descColor, descMargin }, setAttributes, clientId } = props;

	useEffect(() => { clientId && setAttributes({ cId: clientId.substring(0, 10) }); }, [clientId]); // Set & Update clientId to cId

	const sectionHeadingSl = `#bBlocksSectionHeading-${clientId} .bBlocksSectionHeading`;

	return <>
		<Settings settings={props} />

		<div className={className} id={`bBlocksSectionHeading-${clientId}`}>
			<style dangerouslySetInnerHTML={{
				__html: `
				${getTypoCSS(`${sectionHeadingSl} .sectionHeadingTitle`, titleTypo)}
				${getTypoCSS(`${sectionHeadingSl} .sectionHeadingDescription`, descTypo)}

				${sectionHeadingSl}{
					text-align: ${textAlign};
				}
				${sectionHeadingSl} .sectionHeadingTitle{
					color: ${titleColor};
					margin: ${getSpaceCSS(titleMargin)};
				}
				${sectionHeadingSl} .sectionHeadingSeparator{
					${getSeparatorCSS(separator)}
					margin: ${getSpaceCSS(sepMargin)};
				}
				${sectionHeadingSl} .sectionHeadingDescription{
					color: ${descColor};
					margin: ${getSpaceCSS(descMargin)};
				}
			`}} />

			<div className='bBlocksSectionHeading'>
				<RichText className='sectionHeadingTitle' tagName='h2' value={title} onChange={val => setAttributes({ title: val })} placeholder={__('Section heading title', 'b-blocks')} inlineToolbar />

				{isSep && <span className='sectionHeadingSeparator'></span>}

				{isDesc && <RichText className='sectionHeadingDescription' tagName='p' value={desc} onChange={val => setAttributes({ desc: val })} placeholder={__('Section heading description', 'b-blocks')} inlineToolbar />}
			</div>
		</div>
	</>;
};
export default Edit;