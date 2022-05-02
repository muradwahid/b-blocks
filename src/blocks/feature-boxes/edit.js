import { __ } from '@wordpress/i18n';
import { useState, useEffect, createContext } from '@wordpress/element';
import { RichText } from '@wordpress/block-editor';

import Settings from './settings';

export const IndexContext = createContext();

const Edit = props => {
	const { className, attributes: { features = [], columns, columnGap, rowGap, textAlign, padding, isIcon, iconMargin, isTitle, titleTypo, titleMargin, isSep, sepMargin, isDesc, descTypo }, setAttributes, clientId } = props;

	useEffect(() => { clientId && setAttributes({ cId: clientId.substring(0, 10) }); }, [clientId]); // Set & Update clientId to cId

	const [activeIndex, setActiveIndex] = useState(0);

	const updateFeature = (index, type, val) => {
		const newFeature = [...features];
		newFeature[index][type] = val;
		setAttributes({ features: newFeature });
		setActiveIndex(index);
	}

	return <>
		<IndexContext.Provider value={setActiveIndex}>
			<Settings settings={props} />
		</IndexContext.Provider>

		<div className={className} id={`bBlocksFeatureBoxes-${clientId}`}>
			<style dangerouslySetInnerHTML={{
				__html: `
				${titleTypo?.googleFontLink ? `@import url(${titleTypo?.googleFontLink});` : ''}
				${descTypo?.googleFontLink ? `@import url(${descTypo?.googleFontLink});` : ''}

				#bBlocksFeatureBoxes-${clientId} .bBlocksFeatureBoxes{
					grid-gap: ${rowGap} ${columnGap};
				}
				#bBlocksFeatureBoxes-${clientId} .bBlocksFeatureBoxes .bBlocksFeature{
					text-align: ${textAlign};
					padding: ${padding?.styles || '50px 20px'};
				}
				#bBlocksFeatureBoxes-${clientId} .bBlocksFeatureBoxes .bBlocksFeature .featureIcon{
					margin: ${iconMargin?.styles || '0 0 20px 0'};
				}
				#bBlocksFeatureBoxes-${clientId} .bBlocksFeatureBoxes .bBlocksFeature .featureTitle{
					${titleTypo?.styles || 'font-size: 20px; font-weight: 600;'}
					margin: ${titleMargin?.styles || '0 0 10px 0'};
				}
				#bBlocksFeatureBoxes-${clientId} .bBlocksFeatureBoxes .bBlocksFeature .featureSeparator{
					margin: ${sepMargin?.styles || '0 0 10px 0'};
				}
				#bBlocksFeatureBoxes-${clientId} .bBlocksFeatureBoxes .bBlocksFeature .featureDescription{
					${descTypo?.styles || 'font-size: 15px;'}
				}
			`}} />

			<div className={`bBlocksFeatureBoxes columns-${columns.desktop} columns-tablet-${columns.tablet} columns-mobile-${columns.mobile}`}>
				{features.map((item, index) => {
					const { background, isUpIcon, icon, upIcon, iconWidth, title, titleColor, separator, desc, descColor } = item;

					return <div key={index} onClick={() => setActiveIndex(index)} className={`bBlocksFeature ${index === activeIndex ? 'bBlocksNowEditing' : ''}`} id={`bBlocksFeature-${index}`}>
						<style dangerouslySetInnerHTML={{
							__html: `
							#bBlocksFeatureBoxes-${clientId} #bBlocksFeature-${index}{
								${background?.styles || `background-color: #0000;`}
							}
							#bBlocksFeatureBoxes-${clientId} #bBlocksFeature-${index} .featureIcon i{
								${icon?.styles || 'font-size: 120px;'}
							}
							#bBlocksFeatureBoxes-${clientId} #bBlocksFeature-${index} .featureIcon img{
								width: ${iconWidth};
							}
							#bBlocksFeatureBoxes-${clientId} #bBlocksFeature-${index} .featureTitle{
								color: ${titleColor};
							}
							#bBlocksFeatureBoxes-${clientId} #bBlocksFeature-${index} .featureSeparator{
								${separator?.styles || 'width: 20%; border-top: 1px solid #bbb;'}
							}
							#bBlocksFeatureBoxes-${clientId} #bBlocksFeature-${index} .featureDescription{
								color: ${descColor};
							}
						`}} />

						{isIcon && <div className='featureIcon'>
							{isUpIcon ? <img className={upIcon?.id ? `wp-image-${upIcon?.id}` : null} src={upIcon?.url} alt={upIcon?.alt} /> : icon?.class && <i className={icon?.class}></i>}
						</div>}

						<div className='featureDetails'>
							{isTitle && <RichText className='featureTitle' tagName='h4' value={title} onChange={val => updateFeature(index, 'title', val)} placeholder={__('Feature title', 'b-blocks')} inlineToolbar />}

							{isSep && <span className='featureSeparator'></span>}

							{isDesc && <RichText className='featureDescription' tagName='p' value={desc} onChange={val => updateFeature(index, 'desc', val)} placeholder={__('Description of the feature', 'b-blocks')} inlineToolbar />}
						</div>
					</div>;
				})}
			</div>
		</div>
	</>
};
export default Edit;