import { useState, useEffect, createContext } from '@wordpress/element';

import Settings from './settings';

export const IndexContext = createContext();

const Edit = props => {
    const { className, attributes: { boxes, columns, columnGap, rowGap, boxHeight, textAlign, boxPadding, isIcon, iconMargin, titleTypo, titleMargin, isDesc, descTypo, isBtn, btnTypo, btnPadding }, setAttributes, clientId } = props;

    // useEffect
    useEffect(() => {
        clientId && setAttributes({ cId: clientId });
    }, [clientId]);
    const [activeIndex, setActiveIndex] = useState(0);

    return <>
        <IndexContext.Provider value={setActiveIndex}>
            <Settings settings={props} />
        </IndexContext.Provider>

        <div className={className} id={`bBlocksFlipBoxes-${clientId}`}>
            <style dangerouslySetInnerHTML={{
                __html: `
                @import url(${titleTypo?.googleFontLink});
                @import url(${descTypo?.googleFontLink});
                @import url(${btnTypo?.googleFontLink});

                #bBlocksFlipBoxes-${clientId} .bBlocksFlipBoxes{ grid-gap: ${rowGap} ${columnGap}; }
                #bBlocksFlipBoxes-${clientId} .bBlocksFlipBox{ height: ${boxHeight}; }
                #bBlocksFlipBoxes-${clientId} .bBlocksFlipBox .box{
                    text-align: ${textAlign};
                    padding: ${boxPadding?.styles || '30px 25px'};
                }
                #bBlocksFlipBoxes-${clientId} .bBlocksFlipBox .flipIcon{ margin: ${iconMargin?.styles || '0 0 20px 0'}; }
                #bBlocksFlipBoxes-${clientId} .bBlocksFlipBox .flipTitle{
                    ${titleTypo?.styles || 'font-size: 25px;'}
                    margin: ${titleMargin?.styles || '0 0 20px 0'};
                }
                #bBlocksFlipBoxes-${clientId} .bBlocksFlipBox .flipDescription{ ${descTypo?.styles || 'font-size: 16px;'} }
                #bBlocksFlipBoxes-${clientId} .bBlocksFlipBox .flipBtn{
                    ${btnTypo?.styles || 'font-size: 16px;'}
                    padding: ${btnPadding?.styles || '15px 25px'};
                }
            `}} />

            <div className={`bBlocksFlipBoxes columns-${columns.desktop} columns-tablet-${columns.tablet} columns-mobile-${columns.mobile}`}>
                {boxes.map((item, index) => {
                    const { frontBG, backBG, border, shadow, frontIcon, backIcon, frontTitle, backTitle, titleColor, desc, descColor, btn, btnLink, btnBorder, btnColors, btnHovColors } = item;

                    return <div key={index} className={`bBlocksFlipBox ${index === activeIndex ? 'bBlocksNowEditing' : ''}`} id={`bBlocksFlipBox-${index}`}>
                        <style dangerouslySetInnerHTML={{
                            __html: `
                            #bBlocksFlipBoxes-${clientId} #bBlocksFlipBox-${index} .box{
                                ${border?.styles || ''}
                                box-shadow: ${shadow?.styles || 'none'};
                            }
                            #bBlocksFlipBoxes-${clientId} #bBlocksFlipBox-${index} .box.front{
                                ${frontBG?.styles || `background-color: #000000b3;`}
                            }
                            #bBlocksFlipBoxes-${clientId} #bBlocksFlipBox-${index} .box.back{
                                ${backBG?.styles || `background-color: #000000b3;`}
                            }
                            #bBlocksFlipBoxes-${clientId} #bBlocksFlipBox-${index} .flipIcon.frontIcon{
                                ${frontIcon?.styles || 'font-size: 70px; color: #fff;'}
                            }
                            #bBlocksFlipBoxes-${clientId} #bBlocksFlipBox-${index} .flipIcon.backIcon{
                                ${backIcon?.styles || 'font-size: 70px; color: #fff;'}
                            }
                            #bBlocksFlipBoxes-${clientId} #bBlocksFlipBox-${index} .flipTitle{
                                color: ${titleColor};
                            }
                            #bBlocksFlipBoxes-${clientId} #bBlocksFlipBox-${index} .flipDescription{
                                color: ${descColor};
                            }
                            #bBlocksFlipBoxes-${clientId} #bBlocksFlipBox-${index} .flipBtn{
                                ${btnColors?.styles || 'color: #fff; background: #ff4500;'}
                                ${btnBorder?.styles || 'border-radius: 3px;'}
                            }
                            #bBlocksFlipBoxes-${clientId} #bBlocksFlipBox-${index} .flipBtn:hover{
                                ${btnHovColors?.styles || 'color: #fff; background: #ff7500;'}
                            }
                        `}} />

                        <div className='box front'>
                            <div className='frontContent'>
                                {isIcon && frontIcon?.class && <i className={`flipIcon frontIcon ${frontIcon?.class}`}></i>}

                                {frontTitle && <h3 className='flipTitle flipFrontTitle'>{frontTitle}</h3>}

                                {isDesc && desc && <p className='flipDescription'>{desc}</p>}
                            </div>
                        </div>

                        <div className='box back'>
                            <div className='backContent'>
                                {isIcon && backIcon?.class && <i className={`flipIcon backIcon ${backIcon?.class}`}></i>}

                                {backTitle && <h3 className='flipTitle flipBackTitle'>{backTitle}</h3>}

                                {isBtn && btn && <a href={btnLink} className='flipBtn' target='_blank' rel='noreferrer noopener'>{btn}</a>}
                            </div>
                        </div>
                    </div>;
                })}
            </div>
        </div>
    </>
};
export default Edit;