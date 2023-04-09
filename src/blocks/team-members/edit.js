import { __ } from '@wordpress/i18n';
import { useState, useEffect } from 'react';
import { RichText } from '@wordpress/block-editor';
import { Spinner, Button, __experimentalInputControl as InputControl } from '@wordpress/components';
import { isBlobURL } from '@wordpress/blob';
import produce from 'immer';

// Settings Components
import Title from '../../../../Components/Title';
import IconControl from '../../../../Components/IconControl';
import { ImagePlaceholder } from '../../../../Components/ImageControl';

import Settings from './Settings';
import Style from './Style';

const Edit = props => {
	const { className, attributes, setAttributes, clientId, isSelected } = props;
	const { members = [], columns, layout, isTitle, isSep, isBio, isSocial } = attributes;

	useEffect(() => { clientId && setAttributes({ cId: clientId.substring(0, 10) }); }, [clientId]); // Set & Update clientId to cId

	const [activeIndex, setActiveIndex] = useState(0);
	const [selectedSocial, setSelectedSocial] = useState(null);

	useEffect(() => { setActiveIndex(!isSelected || !members.length ? null : 0); }, [isSelected]); // Set default activeIndex
	useEffect(() => { !isSelected && setSelectedSocial(null); }, [isSelected]); // Selected Social

	const updateMember = (index, type, val, childIndex = false, childType = false) => {
		const newMembers = produce(members, draft => {
			if (false !== childIndex && childType) {
				draft[index][type][childIndex][childType] = val;
			} else {
				draft[index][type] = val;
			}
		});
		setAttributes({ members: newMembers });

		setActiveIndex(index);
	}

	return <>
		<Settings attributes={attributes} setAttributes={setAttributes} updateMember={updateMember} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />

		<div className={className} id={`bBlocksTeamMembers-${clientId}`}>
			<Style attributes={attributes} clientId={clientId} />

			<div className={`bBlocksTeamMembers ${layout || 'vertical'} columns-${columns.desktop} columns-tablet-${columns.tablet} columns-mobile-${columns.mobile}`}>
				{members.map((item, index) => {
					const { photo, name, title, bio, social = [] } = item;

					return <div key={index} onClick={() => setActiveIndex(index)} className={`bBlocksMember ${index === activeIndex ? 'bBlocksNowEditing' : ''}`} id={`bBlocksMember-${index}`}>
						{photo?.url ? <>
							<img className={`memberPhoto ${photo?.id ? `wp-image-${photo?.id}` : null}`} src={photo?.url} alt={photo?.alt} />
							{isBlobURL(photo?.url) && <Spinner />}
						</> : <ImagePlaceholder label={__(' Member Photo:', 'b-blocks')} value={photo} onChange={val => updateMember(index, 'photo', val)} />}

						<div className='memberDetails'>
							<RichText className='memberName' tagName='h4' value={name} onChange={val => updateMember(index, 'name', val)} placeholder={__('Member name', 'b-blocks')} inlineToolbar />

							{isTitle && <RichText className='memberTitle' tagName='p' value={title} onChange={val => updateMember(index, 'title', val)} placeholder={__('Member designation/title', 'b-blocks')} inlineToolbar />}

							{isSep && <span className='memberSeparator'></span>}

							{isBio && <RichText className='memberBio' tagName='p' value={bio} onChange={val => updateMember(index, 'bio', val)} placeholder={__('Biography of the member', 'b-blocks')} inlineToolbar />}

							{isSocial && <ul className='memberSocial'>
								{social?.map((socialItem, socialIndex) => {
									const { icon } = socialItem;

									return <li key={socialIndex} onClick={() => setSelectedSocial(socialIndex)} className={`icon icon-${index}-${socialIndex} ${isSelected && index === activeIndex && socialIndex === selectedSocial ? 'isSelected' : null}`}>
										<a href={'#'}><i className={icon?.class}></i></a>
									</li>;
								})}
							</ul>}

							{(null !== selectedSocial && index === activeIndex) && <div className='socialAction memberSocialForm'>
								<Title className='mb5'>{__('Link:', 'b-blocks')}</Title>
								<InputControl value={social[selectedSocial]?.link} onChange={val => updateMember(index, 'social', val, selectedSocial, 'link')} />

								<IconControl value={social[selectedSocial]?.icon} onChange={val => updateMember(index, 'social', val, selectedSocial, 'icon')} defaults={{ class: 'fab fa-facebook-f', fontSize: 22 }} isSize={false} isColor={false} />

								<a className='memberSocialRemove mt15' onClick={e => {
									e.preventDefault();
									updateMember(index, 'social', [...social.slice(0, selectedSocial), ...social.slice(selectedSocial + 1)]);
									setSelectedSocial(null);
								}}><i className='fa fa-times'></i>{__('Remove this link', 'b-blocks')}</a>
							</div>}

							{(isSelected && isSocial && index === activeIndex) && <div className='socialAction memberSocialAdd mt20'>
								<Button showTooltip={true} tooltipPosition='top enter' label={__('Add Social Link', 'b-blocks')} onClick={() => {
									updateMember(index, 'social', [...social, {
										link: '#', icon: { class: 'fab fa-facebook-f' }
									}]);
									setSelectedSocial(social.length);
								}}><i className='fa fa-plus'></i> Add new social</Button>
							</div>}
						</div>
					</div>;
				})}
			</div>

			{!members.length && <h3 className='addItemFirst'>{__('Please add a member first!', 'b-blocks')}</h3>}
		</div>
	</>
};
export default Edit;