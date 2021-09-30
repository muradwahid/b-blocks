import { __ } from '@wordpress/i18n';
import { useState, useEffect, createContext } from '@wordpress/element';
import { RichText } from '@wordpress/block-editor';
import { Spinner, Button, __experimentalInputControl as InputControl } from '@wordpress/components';
import { isBlobURL } from '@wordpress/blob';

import Settings from './settings';

export const IndexContext = createContext();

// Variables
import Title from '../../Components/Title';
import IconControl from '../../Components/IconControl';
import { ImagePlaceholder } from '../../Components/ImageControl';

const Edit = props => {
    const { className, attributes: { members = [], columns, columnGap, rowGap, layout, textAlign, padding, photoWidth, photoMargin, nameTypo, nameMargin, isTitle, titleTypo, titleMargin, isSep, sepMargin, isBio, bioTypo, bioMargin, isSocial, socialIconMargin }, setAttributes, clientId, isSelected } = props;

    // useEffect
    useEffect(() => { clientId && setAttributes({ cId: clientId }); }, [clientId]);
    const [activeIndex, setActiveIndex] = useState(0);

    const [selectedSocial, setSelectedSocial] = useState(null);
    useEffect(() => {
        if (!isSelected) {
            setSelectedSocial(null);
        }
    }, [isSelected]);

    const updateMember = (index, type, val, otherIndex = false, otherType = false) => {
        const newMember = [...members];

        if (false !== otherIndex && otherType) {
            newMember[index][type][otherIndex][otherType] = val;
            setAttributes({ members: newMember });
        } else {
            newMember[index][type] = val;
            setAttributes({ members: newMember });
        }
        setActiveIndex(index);
    }

    return <>
        <IndexContext.Provider value={setActiveIndex}>
            <Settings settings={props} />
        </IndexContext.Provider>


        <div className={className} id={`bBlocksTeamMembers-${clientId}`}>
            <style dangerouslySetInnerHTML={{
                __html: `
                @import url(${nameTypo?.googleFontLink});
                @import url(${titleTypo?.googleFontLink});
                @import url(${bioTypo?.googleFontLink});

                #bBlocksTeamMembers-${clientId} .bBlocksTeamMembers{
                    grid-gap: ${rowGap} ${columnGap};
                }
                #bBlocksTeamMembers-${clientId} .bBlocksTeamMembers .bBlocksMember{
                    text-align: ${textAlign};
                    padding: ${padding?.styles || '50px 20px'};
                }
                #bBlocksTeamMembers-${clientId} .bBlocksTeamMembers .bBlocksMember .memberPhoto{
                    width: ${photoWidth};
                    margin: ${'horizontal' === layout ? '0 20px 0 0' : `${photoMargin?.styles || '0 0 20px 0'}`};
                }
                #bBlocksTeamMembers-${clientId} .bBlocksTeamMembers .bBlocksMember .memberDetails .memberName{
                    ${nameTypo?.styles || 'font-size: 20px; font-weight: 600;'}
                    margin: ${nameMargin?.styles || '0 0 10px 0'};
                }
                #bBlocksTeamMembers-${clientId} .bBlocksTeamMembers .bBlocksMember .memberDetails .memberTitle{
                    ${titleTypo?.styles || 'font-size: 16px;'}
                    margin: ${titleMargin?.styles || '0 0 10px 0'};
                }
                #bBlocksTeamMembers-${clientId} .bBlocksTeamMembers .bBlocksMember .memberDetails .memberSeparator{
                    margin: ${sepMargin?.styles || '0 0 15px 0'};
                }
                #bBlocksTeamMembers-${clientId} .bBlocksTeamMembers .bBlocksMember .memberDetails .memberBio{
                    ${bioTypo?.styles || 'font-size: 15px;'}
                    margin: ${bioMargin?.styles || '0 0 15px 0'};
                }
                #bBlocksTeamMembers-${clientId} .bBlocksTeamMembers .bBlocksMember .memberDetails .memberSocial .icon{
                    margin: ${socialIconMargin?.styles || '10px 10px'};
                }
            `}} />

            <div className={`bBlocksTeamMembers ${layout || 'vertical'} columns-${columns.desktop} columns-tablet-${columns.tablet} columns-mobile-${columns.mobile}`}>
                {members.map((item, index) => {
                    const { background, border, shadow, photo, photoBorder, name, nameColor, title, titleColor, separator, bio, bioColor, social = [], socialIconColors } = item;

                    return <div key={index} onClick={() => setActiveIndex(index)} className={`bBlocksMember ${index === activeIndex ? 'bBlocksNowEditing' : ''}`} id={`bBlocksMember-${index}`}>
                        <style dangerouslySetInnerHTML={{
                            __html: `
                            #bBlocksTeamMembers-${clientId} #bBlocksMember-${index}{
                                ${background?.styles || 'background-color: #0000;'}
                                ${border?.styles || 'border-radius: 3px;'}
                                box-shadow: ${shadow?.styles || 'none'};
                            }
                            #bBlocksTeamMembers-${clientId} #bBlocksMember-${index} .memberPhoto{
                                ${photoBorder?.styles || 'border-radius: 50%;'}
                            }
                            #bBlocksTeamMembers-${clientId} #bBlocksMember-${index} .memberDetails .memberName{
                                color: ${nameColor};
                            }
                            #bBlocksTeamMembers-${clientId} #bBlocksMember-${index} .memberDetails .memberTitle{
                                color: ${titleColor};
                            }
                            #bBlocksTeamMembers-${clientId} #bBlocksMember-${index} .memberSeparator{
                                ${separator?.styles || 'width: 20%; border-top: 3px solid #777;'}
                            }
                            #bBlocksTeamMembers-${clientId} #bBlocksMember-${index} .memberDetails .memberBio{
                                color: ${bioColor};
                            }
                            #bBlocksTeamMembers-${clientId} #bBlocksMember-${index} .memberDetails .memberSocial{
                                justify-content: ${'center' === textAlign ? 'center' : 'right' === textAlign ? 'flex-end' : 'flex-start'}
                            }
                            #bBlocksTeamMembers-${clientId} #bBlocksMember-${index} .memberDetails .memberSocial li a{
                                ${socialIconColors?.styles || 'color: #fff; background: #4527a4;'}
                            }
                            #bBlocksTeamMembers-${clientId} #bBlocksMember-${index} .memberDetails .memberSocial li.isSelected{
                                border: 2px solid ${socialIconColors?.bg};
                            }
                            #bBlocksTeamMembers-${clientId} #bBlocksMember-${index} .memberDetails .memberSocial li.memberSocialAdd button i{
                                color: ${socialIconColors?.bg};
                            }
                        `}} />

                        {photo?.url ? <>
                            <img className={`memberPhoto ${photo?.id ? `wp-image-${photo?.id}` : null}`} src={photo?.url} alt={photo?.alt} />
                            {isBlobURL(photo?.url) && <Spinner />}
                        </> : <ImagePlaceholder label={__(' Member Photo:', 'b-blocks')} img={photo} onChange={val => updateMember(index, 'photo', val)} />}

                        <div className='memberDetails'>
                            <RichText className='memberName' tagName='h4' value={name} onChange={val => updateMember(index, 'name', val)} placeholder={__('Member name', 'b-blocks')} />

                            {isTitle && <RichText className='memberTitle' tagName='p' value={title} onChange={val => updateMember(index, 'title', val)} placeholder={__('Member designation/title', 'b-blocks')} />}

                            {isSep && <span className='memberSeparator'></span>}

                            {isBio && <RichText className='memberBio' tagName='p' value={bio} onChange={val => updateMember(index, 'bio', val)} placeholder={__('Biography of the member', 'b-blocks')} />}

                            {isSocial && <ul className='memberSocial'>
                                {social?.map((socialItem, socialIndex) => {
                                    const { icon } = socialItem;

                                    return <li key={socialIndex} onClick={() => setSelectedSocial(socialIndex)} className={`icon icon-${index}-${socialIndex} ${isSelected && index === activeIndex && socialIndex === selectedSocial ? 'isSelected' : null}`}>
                                        <a href={'#'}><i className={icon?.class}></i></a>
                                    </li>;
                                })}

                                {isSelected && index === activeIndex && <li className='memberSocialAdd'>
                                    <Button showTooltip={true} tooltipPosition='top enter' label={__('Add Social Link', 'b-blocks')} onClick={() => {
                                        updateMember(index, 'social', [...social, {
                                            link: '#', icon: { class: 'fa fa-facebook' }
                                        }]);
                                        setSelectedSocial(social.length);
                                    }}><i className='fa fa-plus'></i></Button>
                                </li>}
                            </ul>}

                            {null !== selectedSocial && index === activeIndex && <div className='memberSocialForm'>
                                <Title mt='0'>{__('Link:', 'b-blocks')}</Title>
                                <InputControl value={social[selectedSocial]?.link} onChange={val => updateMember(index, 'social', val, selectedSocial, 'link')} />

                                <IconControl icon={social[selectedSocial]?.icon} onChange={val => updateMember(index, 'social', val, selectedSocial, 'icon')} defaults={{ class: 'fa fa-facebook', fontSize: 22 }} onlyIcon={true} />

                                <a className='memberSocialRemove' onClick={e => {
                                    e.preventDefault();
                                    updateMember(index, 'social', [...social.slice(0, selectedSocial), ...social.slice(selectedSocial + 1)]);
                                    setSelectedSocial(null);
                                }}><i className='fa fa-times'></i>{__('Remove this link', 'b-blocks')}</a>
                            </div>}
                        </div>
                    </div>;
                })}
            </div>
        </div>
    </>
};
export default Edit;