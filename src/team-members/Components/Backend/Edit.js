import { __ } from '@wordpress/i18n';
import { useState, useEffect } from 'react';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import { Spinner, Button, __experimentalInputControl as InputControl } from '@wordpress/components';
import { isBlobURL } from '@wordpress/blob';
import { produce } from 'immer';

import { Label, IconControl } from '../../../../../bpl-tools/Components';
import { ImagePlaceholder } from '../../../../../bpl-tools/Components/Deprecated';

import Settings from './Settings/Settings';
import Style from '../Common/Style';
import { prefix } from '../../utils/data';

const Edit = props => {
	const { attributes, setAttributes, clientId, isSelected } = props;
	const { members = [], columns, layout, isTitle, isSep, isBio, isSocial } = attributes;
	const { desktop, tablet, mobile } = columns || {};

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

	const id = `${prefix}-${clientId}`;

	return <>
		<Settings attributes={attributes} setAttributes={setAttributes} updateMember={updateMember} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />

		<div {...useBlockProps()} id={id}>
			<Style attributes={attributes} id={id} />

			<div className={`${prefix} ${layout || 'vertical'} columns-${desktop} columns-tablet-${tablet} columns-mobile-${mobile}`}>
				{members.map((item, index) => {
					const { photo, name, title, bio, social = [] } = item;

					return <div key={index} onClick={() => setActiveIndex(index)} className={`teamMember ${index === activeIndex ? 'bPlNowEditing' : ''}`} id={`teamMember-${index}`}>
						{photo?.url ? <>
							<img className={`memberPhoto ${photo?.id ? `wp-image-${photo?.id}` : null}`} src={photo?.url} alt={photo?.alt} />
							{isBlobURL(photo?.url) && <Spinner />}
						</> : <ImagePlaceholder label={__(' Member Photo:', 'b-blocks')} value={photo} onChange={val => updateMember(index, 'photo', val)} />}

						<div className='memberDetails'>
							<RichText className='memberName' tagName='h4' value={name} onChange={val => updateMember(index, 'name', val)} placeholder={__('Member name', 'b-blocks')} inlineToolbar />

							{isTitle && <RichText className='memberTitle' tagName='p' value={title} onChange={val => updateMember(index, 'title', val)} placeholder={__('Member designation/title', 'b-blocks')} inlineToolbar />}

							{isSep && <span className='memberSeparator' />}

							{isBio && <RichText className='memberBio' tagName='p' value={bio} onChange={val => updateMember(index, 'bio', val)} placeholder={__('Biography of the member', 'b-blocks')} inlineToolbar />}

							{isSocial && <ul className='memberSocial'>
								{social?.map((socialItem, socialIndex) => {
									const { icon } = socialItem;

									return <li key={socialIndex} onClick={() => setSelectedSocial(socialIndex)} className={`icon icon-${index}-${socialIndex} ${isSelected && index === activeIndex && socialIndex === selectedSocial ? 'isSelected' : null}`}>
										<a href={'#'}><i className={icon?.class} /></a>
									</li>;
								})}
							</ul>}

							{(null !== selectedSocial && index === activeIndex) && <div className='socialAction memberSocialForm'>
								<Label className='mb5'>{__('Link:', 'b-blocks')}</Label>
								<InputControl value={social[selectedSocial]?.link} onChange={val => updateMember(index, 'social', val, selectedSocial, 'link')} />

								<IconControl value={social[selectedSocial]?.icon} onChange={val => updateMember(index, 'social', val, selectedSocial, 'icon')} defaults={{ class: 'fab fa-facebook-f', fontSize: 22 }} isSize={false} isColor={false} />

								<a className='memberSocialRemove mt15' onClick={e => {
									e.preventDefault();
									updateMember(index, 'social', [...social.slice(0, selectedSocial), ...social.slice(selectedSocial + 1)]);
									setSelectedSocial(null);
								}}><i className='fa fa-times' />{__('Remove this link', 'b-blocks')}</a>
							</div>}

							{(isSelected && isSocial && index === activeIndex) && <div className='socialAction memberSocialAdd mt20'>
								<Button showTooltip={true} tooltipPosition='top enter' label={__('Add Social Link', 'b-blocks')} onClick={() => {
									updateMember(index, 'social', [...social, {
										link: '#', icon: { class: 'fab fa-facebook-f' }
									}]);
									setSelectedSocial(social.length);
								}}><i className='fa fa-plus' /> Add new social</Button>
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