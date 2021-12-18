import { useEffect, useRef } from '@wordpress/element';

const $ = jQuery;

import Settings from './settings';

const Edit = props => {
    const { className, attributes: { loop, animateIn, inEffect, inSequence, outEffect, outSequence, textAlign, background, content, typography, color, padding, border }, setAttributes, clientId } = props;

    useEffect(() => { clientId && setAttributes({ cId: clientId }); }, [clientId]); // Set & Update clientId to cId

    const animateTextRef = useRef(null);

    useEffect(() => {
        $(`#bBlocksAnimatedText-${clientId} .content`).textillate({
            loop,
            minDisplayTime: 2000, // each text before it is replaced
            initialDelay: 0,
            autoStart: true,
            inEffects: [], // Custom set of 'in' effects
            outEffects: ['hinge'], // Custom set of 'out' effects

            in: {
                effect: inEffect,
                delayScale: 1.5,
                delay: 50,
                sync: 'sync' === inSequence, // sequence of char/word
                shuffle: 'shuffle' === inSequence, // (doesn't make sense with sync = true)
                reverse: 'reverse' === inSequence // (doesn't make sense with sync = true)
            },

            out: {
                effect: outEffect,
                delayScale: 1.5,
                delay: 50,
                sync: 'sync' === outSequence,
                shuffle: 'shuffle' === outSequence,
                reverse: 'reverse' === outSequence
            },

            type: animateIn // Animate in type (available types: 'char' and 'word')
        });
    }, [loop, animateIn, inEffect, inSequence, outEffect, outSequence, content]);

    return <>
        <Settings attributes={props.attributes} setAttributes={setAttributes} clientId={clientId} />

        <div className={className} id={`bBlocksAnimatedText-${clientId}`}>
            <style dangerouslySetInnerHTML={{
                __html: `
                @import url(${typography?.googleFontLink || ''});

                #bBlocksAnimatedText-${clientId} .bBlocksAnimatedText{
                    text-align: ${textAlign};
                    ${background?.styles ?? 'background-color: #0000;'}
                    padding: ${padding?.styles ?? '15px 15px'};
                    ${border?.styles ?? 'border-radius: 5px;'}
                }
                #bBlocksAnimatedText-${clientId} .bBlocksAnimatedText .content{
                    ${typography?.styles || 'font-size: 22px;'}
                    color: ${color};
                }
            `}} />

            <div className='bBlocksAnimatedText'>
                <p className='content' ref={animateTextRef}>{content}</p>
            </div>
        </div>
    </>;
};
export default Edit;