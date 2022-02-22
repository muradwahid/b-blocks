import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { RichText } from '@wordpress/block-editor';

import Settings from './settings';

const Edit = props => {
	const { className, attributes: { textAlign, title, titleTypo, titleColor, titleMargin, isSep, separator, sepMargin, isDesc, desc, descTypo, descColor, descMargin }, setAttributes, clientId } = props;

	useEffect(() => { clientId && setAttributes({ cId: clientId }); }, [clientId]); // Set & Update clientId to cId

	return <>
		<Settings settings={props} />

		<div className={className} id={`bBlocksSectionHeading-${clientId}`}>
			<style dangerouslySetInnerHTML={{
				__html: `
				${titleTypo?.googleFontLink ? `@import url(${titleTypo?.googleFontLink})` : ''}
				${descTypo?.googleFontLink ? `@import url(${descTypo?.googleFontLink})` : ''}

				#bBlocksSectionHeading-${clientId} .bBlocksSectionHeading{
					text-align: ${textAlign};
				}
				#bBlocksSectionHeading-${clientId} .bBlocksSectionHeading .sectionHeadingTitle{
					${titleTypo?.styles || 'font-size: 25px; font-weight: 600;'}
					color: ${titleColor};
					margin: ${titleMargin?.styles || '0px 0px 10px 0px'};
				}
				#bBlocksSectionHeading-${clientId} .bBlocksSectionHeading .sectionHeadingSeparator{
					${separator?.styles || 'width: 150px; border-top: 3px solid #8344c5;'}
					margin: ${sepMargin?.styles || '0px 0px 5px 0px'};
				}
				#bBlocksSectionHeading-${clientId} .bBlocksSectionHeading .sectionHeadingDescription{
					${descTypo?.styles || 'font-size: 15px;'}
					color: ${descColor};
					margin: ${descMargin?.styles || '0px 0px 15px 0px'};
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