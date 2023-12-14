import { __ } from '@wordpress/i18n';
import { useState, useEffect } from 'react';
import { RichText } from '@wordpress/block-editor';
import { produce } from 'immer';

import Settings from './Settings';
import Style from './Style';

const Edit = ({ className, attributes, setAttributes, clientId }) => {
	const { features = [], columns, isIcon, isTitle, isSep, isDesc } = attributes;

	useEffect(() => { clientId && setAttributes({ cId: clientId.substring(0, 10) }); }, [clientId]); // Set & Update clientId to cId

	const [activeIndex, setActiveIndex] = useState(0);

	const updateFeature = (type, val) => {
		const newFeatures = produce(features, draft => {
			draft[activeIndex][type] = val;
		});
		setAttributes({ features: newFeatures });
	}

	return <>
		<Settings attributes={attributes} setAttributes={setAttributes} updateFeature={updateFeature} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />

		<div className={className} id={`bBlocksFeatureBoxes-${clientId}`}>
			<Style attributes={attributes} clientId={clientId} />

			<div className={`bBlocksFeatureBoxes columns-${columns.desktop} columns-tablet-${columns.tablet} columns-mobile-${columns.mobile}`}>
				{features.map((item, index) => {
					const { isUpIcon, icon, upIcon, title, desc } = item;

					return <div key={index} onClick={() => setActiveIndex(index)} className={`bBlocksFeature ${index === activeIndex ? 'bBlocksNowEditing' : ''}`} id={`bBlocksFeature-${index}`}>
						{isIcon && <div className='featureIcon'>
							{isUpIcon ? <img className={upIcon?.id ? `wp-image-${upIcon?.id}` : null} src={upIcon?.url} alt={upIcon?.alt} /> : icon?.class && <i className={icon?.class}></i>}
						</div>}

						<div className='featureDetails'>
							{isTitle && <RichText className='featureTitle' tagName='h4' value={title} onChange={val => updateFeature('title', val)} placeholder={__('Feature title', 'b-blocks')} inlineToolbar />}

							{isSep && <span className='featureSeparator'></span>}

							{isDesc && <RichText className='featureDescription' tagName='p' value={desc} onChange={val => updateFeature('desc', val)} placeholder={__('Description of the feature', 'b-blocks')} inlineToolbar />}
						</div>
					</div>;
				})}
			</div>
		</div>
	</>
};
export default Edit;