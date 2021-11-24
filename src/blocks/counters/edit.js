import { useState, useEffect, createContext } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { RichText } from '@wordpress/block-editor';

import Settings from './settings';

export const IndexContext = createContext();

const Edit = props => {
    const { className, attributes: { counters = [], columns, columnGap, rowGap, duration, background, padding, textAlign, counterWidth, counterHeight, isIcon, iconSize, iconPosition, numberTypo, isLabel, labelTypo, counterPadding, counterBorder, counterShadow }, setAttributes, clientId } = props;

    useEffect(() => { clientId && setAttributes({ cId: clientId }); }, [clientId]); // Set & Update clientId to cId

    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const counter = document.querySelectorAll(`.bBlocksCounters .counterNumber .number`);


        counter?.forEach(count => {
            const startNumber = parseInt(count.dataset.countStart);
            const endNumber = parseInt(count.dataset.countEnd);

            const start = Date.now(); // Remember start time
            const timer = setInterval(() => {
                const timePassed = Date.now() - start; // How much time passed from the start?

                if (timePassed >= duration) {
                    clearInterval(timer); // Finish the animation after duration
                    return;
                }

                count.innerText = parseInt((timePassed / (duration / (endNumber - startNumber))) + startNumber);
            }, 20);

            setTimeout(() => {
                count.innerText = endNumber
            }, duration);
        });
    }, [counters, duration]);

    const updateCounter = (index, type, val, otherType = false) => {
        const newCounters = [...counters];

        if (otherType) {
            newCounters[index][type][otherType] = val;
            setAttributes({ counters: newCounters });
        } else {
            newCounters[index][type] = val;
            setAttributes({ counters: newCounters });
        }
        setActiveIndex(index);
    }

    return <>
        <IndexContext.Provider value={setActiveIndex}>
            <Settings attributes={props.attributes} setAttributes={setAttributes} clientId={clientId} />
        </IndexContext.Provider>


        <div className={className} id={`bBlocksCounters-${clientId}`}>
            <style dangerouslySetInnerHTML={{
                __html: `
                @import url(${numberTypo?.googleFontLink || ''});
                @import url(${labelTypo?.googleFontLink || ''});
                
                #bBlocksCounters-${clientId} .bBlocksCounters{
                    grid-gap: ${rowGap} ${columnGap};
                    ${background?.styles || `background-color: #0000;`}
                    padding: ${padding?.styles || '20px 0px'};
                }
                #bBlocksCounters-${clientId} .bBlocksCounters .bBlocksCounter{
                    text-align: ${textAlign};
                    width: ${'0px' === counterWidth || '0%' === counterWidth || '0em' === counterWidth ? '250px' : counterWidth};
                    height: ${'0px' === counterHeight || '0%' === counterHeight || '0em' === counterHeight ? '250px' : counterHeight};
                    padding: ${counterPadding?.styles || '20px 20px'};
                    ${counterBorder?.styles || 'border-radius: 50%;'}
                    box-shadow: ${counterShadow?.styles || 'none'};
                }
                #bBlocksCounters-${clientId} .bBlocksCounters .bBlocksCounter .counterIcon i, #bBlocksCounters-${clientId} .bBlocksCounters .bBlocksCounter .counterIconLabel i{
                    font-size: ${iconSize || 50}px
                }
                #bBlocksCounters-${clientId} .bBlocksCounters .bBlocksCounter .counterNumber{
                    ${numberTypo?.styles || 'font-size: 48px'}
                }
                #bBlocksCounters-${clientId} .bBlocksCounters .bBlocksCounter .counterLabel{
                    ${labelTypo?.styles || 'font-size: 22px;'}
                }
            `.replace(/\s+/g, ' ')
            }} />
            <style>
                {counters?.map((item, index) => `
                    #bBlocksCounters-${clientId} #bBlocksCounter-${index} .bBlocksCounter{
                        ${item.background?.styles || `background-color: #4527a4;`}
                    }
                    #bBlocksCounters-${clientId} #bBlocksCounter-${index} .counterIcon i, #bBlocksCounters-${clientId} #bBlocksCounter-${index} .counterIconLabel i{
                        ${item.icon?.styles || 'color: #fff;'}
                    }
                    #bBlocksCounters-${clientId} #bBlocksCounter-${index} .counterNumber{
                        color: ${item.number.color};
                    }
                    #bBlocksCounters-${clientId} #bBlocksCounter-${index} .counterLabel{
                        color: ${item.label.color};
                    }
                `.replace(/\s+/g, ' '))}
            </style>

            <div className={`bBlocksCounters columns-${columns.desktop} columns-tablet-${columns.tablet} columns-mobile-${columns.mobile}`}>
                {counters?.map((item, index) => {
                    const { icon, number, label } = item;

                    const iconEl = icon?.class && <i className={icon?.class}></i>;
                    const labelEl = isLabel && <RichText className='counterLabel' tagName='p' value={label.text} onChange={val => updateCounter(index, 'label', val, 'text')} placeholder={__('Label', 'counters-block')} inlineToolbar />

                    return <div key={index} onClick={() => setActiveIndex(index)} className={`${index === activeIndex ? 'nowEditing' : ''}`} id={`bBlocksCounter-${index}`}>
                        <div className='bBlocksCounter'>
                            {isIcon && 'top' === iconPosition && <div className='counterIcon'>{iconEl}</div>}

                            <div className='counterNumber'>
                                <span className='prefix'>{number.prefix}</span>
                                <span className='number' data-count-start={number.start} data-count-end={number.end}>{number.start}</span>
                                <span className='suffix'>{number.suffix}</span>
                            </div>

                            {'label' === iconPosition ? <div className='counterIconLabel'>{iconEl}{labelEl}</div> : labelEl}
                        </div>
                    </div>;
                })}
            </div>
        </div>
    </>;
};
export default Edit;