import { __ } from '@wordpress/i18n';
import { useState, useEffect, createContext } from '@wordpress/element';
import { RichText } from '@wordpress/block-editor';

// Settings Components
import { getBackgroundCSS, getIconCSS, getSeparatorCSS, getSpaceCSS, getTypoCSS } from '../../../../Components/Helper/getCSS';

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

	const mainSl = `#bBlocksFeatureBoxes-${clientId}`;
	const featureBoxesSl = `${mainSl} .bBlocksFeatureBoxes`;
	const gFeatureSl = `${featureBoxesSl} .bBlocksFeature`;

	return <>
		<IndexContext.Provider value={setActiveIndex}>
			<Settings settings={props} />
		</IndexContext.Provider>

		<div className={className} id={`bBlocksFeatureBoxes-${clientId}`}>
			<style dangerouslySetInnerHTML={{
				__html: `
				${getTypoCSS(`${gFeatureSl} .featureTitle`, titleTypo)}
				${getTypoCSS(`${gFeatureSl} .featureDescription`, descTypo)}

				${featureBoxesSl}{
					grid-gap: ${rowGap} ${columnGap};
				}
				${gFeatureSl}{
					text-align: ${textAlign};
					padding: ${getSpaceCSS(padding)};
				}
				${gFeatureSl} .featureIcon{
					margin: ${getSpaceCSS(iconMargin)};
				}
				${gFeatureSl} .featureTitle{
					margin: ${getSpaceCSS(titleMargin)};
				}
				${gFeatureSl} .featureSeparator{
					margin: ${getSpaceCSS(sepMargin)};
				}
			`}} />

			<div className={`bBlocksFeatureBoxes columns-${columns.desktop} columns-tablet-${columns.tablet} columns-mobile-${columns.mobile}`}>
				{features.map((item, index) => {
					const { background, isUpIcon, icon, upIcon, iconWidth, title, titleColor, separator, desc, descColor } = item;

					const featureSl = `${mainSl} #bBlocksFeature-${index}`;

					return <div key={index} onClick={() => setActiveIndex(index)} className={`bBlocksFeature ${index === activeIndex ? 'bBlocksNowEditing' : ''}`} id={`bBlocksFeature-${index}`}>
						<style dangerouslySetInnerHTML={{
							__html: `
							${featureSl}{
								${getBackgroundCSS(background)}
							}
							${featureSl} .featureIcon i{
								${getIconCSS(icon)}
							}
							${featureSl} .featureIcon img{
								width: ${iconWidth};
							}
							${featureSl} .featureTitle{
								color: ${titleColor};
							}
							${featureSl} .featureSeparator{
								${getSeparatorCSS(separator)}
							}
							${featureSl} .featureDescription{
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