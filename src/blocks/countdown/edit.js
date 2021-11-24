import { useEffect, useState, useRef } from '@wordpress/element';

import Settings from './settings';
import Box from './box';

const Edit = props => {
    const { className, attributes: { destDate, boxIsInline, boxPosition, isLabels, isDays, daysLabel, isHours, hoursLabel, isMinutes, minutesLabel, isSeconds, secondsLabel, width, background, padding, shadow, alignment, boxBG, boxWidth, boxHeight, boxSpace, boxBorder, boxShadow, digitTypo, digitColor, labelTypo, labelColor, isSep, sepType, sepSize, sepColor }, setAttributes, clientId } = props;

    useEffect(() => { clientId && setAttributes({ cId: clientId }); }, [clientId]); // Set & Update clientId to cId

    // Functions
    const parseEmtStr = (val, def) => undefined === val ? def : val;

    const [seconds, setSeconds] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds(seconds => seconds + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const dest = new Date(destDate).getTime(); // Convert Destination Date in time (milliseconds)
    const daysRef = useRef(null);
    const hoursRef = useRef(null);
    const minutesRef = useRef(null);
    const secondsRef = useRef(null);
    useEffect(() => {
        const now = new Date().getTime(); // Convert Current Date in time (milliseconds)
        const diff = dest > now ? (dest - now) / 1000 : 0; // Different time in seconds

        const days = Math.floor(diff / (24 * 60 * 60));
        const hours = Math.floor((diff % (24 * 60 * 60)) / (60 * 60));
        const minutes = Math.floor((diff % (60 * 60)) / 60);
        const seconds = Math.floor(diff % 60);

        daysRef.current.innerHTML = (1 === days.toString().length ? ('0' + days).slice(-2) : days);
        hoursRef.current.innerHTML = ('0' + hours).slice(-2);
        minutesRef.current.innerHTML = ('0' + minutes).slice(-2);
        secondsRef.current.innerHTML = ('0' + seconds).slice(-2);
    }, [dest, seconds, daysRef.current, hoursRef.current, minutesRef.current, secondsRef.current]);


    // Classes
    const boxClass = `${boxIsInline ? 'inline' : ''}`;

    return <>
        <Settings settings={props} />

        <div className={className} id={`bBlocksCountdown-${clientId}`}>
            <style dangerouslySetInnerHTML={{
                __html: `
                @import url(${digitTypo?.googleFontLink || ''});
                @import url(${labelTypo?.googleFontLink || ''});

                #bBlocksCountdown-${clientId}{
                    align-items: ${alignment};
                    justify-content: ${alignment};
                }
                #bBlocksCountdown-${clientId} .countdownItems{
                    width: ${'0px' === width || '0%' === width || '0em' === width ? 'auto' : width};
                    ${background?.styles || 'background-color: #0000;'}
                    padding: ${padding?.styles || '10px 15px'};
                    box-shadow: ${shadow?.styles || 'none'};
                    justify-content: ${boxPosition};
                }
                #bBlocksCountdown-${clientId} .countdownItems .countdownItem{
                    ${boxBG?.styles || `background-image: linear-gradient(135deg, #4527a4, #8344c5);`}
                    width: ${boxWidth};
                    height: ${boxHeight};
                    margin-left: calc(${boxSpace} / 2);
                    margin-right: calc(${boxSpace} / 2);
                    ${parseEmtStr(boxBorder?.styles, 'border-radius: 5%;')}
                    box-shadow: ${boxShadow?.styles || 'none'};
                }
                @media (max-width: 575px){ #bBlocksCountdown-${clientId} .countdownItems .countdownItem{
                    margin-top: calc(${boxSpace} / 2);
                    margin-bottom: calc(${boxSpace} / 2);
                } }

                #bBlocksCountdown-${clientId} .countdownItems .separator::before{
                    content: '${sepType}';
                    font-size: ${sepSize}px;
                    color: ${sepColor};
                }
                #bBlocksCountdown-${clientId} .countdownItems .countdownItem .digit{
                    color: ${digitColor};
                    ${parseEmtStr(digitTypo?.styles, 'font-size: 48px;')}
                }
                #bBlocksCountdown-${clientId} .countdownItems .countdownItem .label{
                    color: ${labelColor};
                    ${parseEmtStr(labelTypo?.styles, 'font-size: 18px;')}
                }
            `}} />

            <div className='countdownItems'>
                <Box ref={daysRef} is={isDays} boxClass={`countdownDays ${boxClass}`} isLabels={isLabels} label={daysLabel} onChange={val => setAttributes({ daysLabel: val })} />
                {isSep && isDays && (isHours || isMinutes || isSeconds) && <span className='separator'></span>}

                <Box ref={hoursRef} is={isHours} boxClass={`countdownHours ${boxClass}`} isLabels={isLabels} label={hoursLabel} onChange={val => setAttributes({ hoursLabel: val })} />
                {isSep && isHours && (isMinutes || isSeconds) && <span className='separator'></span>}

                <Box ref={minutesRef} is={isMinutes} boxClass={`countdownMinutes ${boxClass}`} isLabels={isLabels} label={minutesLabel} onChange={val => setAttributes({ minutesLabel: val })} />
                {isSep && isMinutes && isSeconds && <span className='separator'></span>}

                <Box ref={secondsRef} is={isSeconds} boxClass={`countdownSeconds ${boxClass}`} isLabels={isLabels} label={secondsLabel} onChange={val => setAttributes({ secondsLabel: val })} />
            </div>
        </div>
    </>;
};
export default Edit;