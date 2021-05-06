import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { } from '@wordpress/block-editor';

import Edit from './edit';
import Box from './box';

// Import Sass
import './editor.scss';

// Icon
import icons from '../../Const/icons';

// Custom Attributes
const attributes = {
    cId: { type: 'string' },
    destDate: { type: 'string' },

    isDays: { type: 'boolean', default: true },
    daysLabel: { type: 'string', default: 'Days' },

    isHours: { type: 'boolean', default: true },
    hoursLabel: { type: 'string', default: 'Hours' },

    isMinutes: { type: 'boolean', default: true },
    minutesLabel: { type: 'string', default: 'Minutes' },

    isSeconds: { type: 'boolean', default: true },
    secondsLabel: { type: 'string', default: 'Seconds' },

    digitFontSize: { type: 'number', default: 48 },
    digitColor: { type: 'string', default: '#fff' },

    isLabels: { type: 'boolean', default: true },
    labelFontSize: { type: 'number', default: 14 },
    labelColor: { type: 'string', default: '#fff' },

    itemInline: { type: 'boolean', default: false },
    itemPos: { type: 'string', default: 'center' },
    itemTextAlign: { type: 'string', default: 'center' },
    itemWidth: { type: 'number', default: 170 },
    itemHeight: { type: 'number', default: 120 },
    itemPTB: { type: 'number', default: 0 },
    itemPLR: { type: 'number', default: 0 },
    itemSpace: { type: 'number', default: 30 },
    itemBGColor: { type: 'string', default: '#4527a4' },

    borderWidth: { type: 'number', default: 1 },
    borderStyle: { type: 'string', default: 'solid' },
    borderColor: { type: 'string', default: '#00000000' },
    borderRadius: { type: 'number', default: 5 },
    radiusType: { type: 'string', default: '%' },

    shadowColor: { type: 'string', default: '#000' },
    shadowHOffset: { type: 'number', default: 0 },
    shadowVOffset: { type: 'number', default: 0 },
    shadowBlur: { type: 'number', default: 0 },
    shadowSpreed: { type: 'number', default: 0 },
}

registerBlockType('b-blocks/countdown', {
    // Build In attributes
    title: __('Countdown', 'b-blocks'),
    description: __('Timer for an event', 'b-blocks'),
    icon: icons.countdown,
    category: 'bBlocks',
    keywords: [__('countdown timer', 'b-blocks'), __('timer', 'b-blocks'), __('set timer', 'b-blocks')],
    supports: {
        align: ['center', 'wide', 'full']
    },

    styles: [],

    // Custom Attributes
    attributes,

    // Build In Functions
    edit: Edit,

    save: props => {
        const { cId, destDate, isDays, daysLabel, isHours, hoursLabel, isMinutes, minutesLabel, isSeconds, secondsLabel, digitFontSize, digitColor, isLabels, labelFontSize, labelColor, itemInline, itemPos, itemTextAlign, itemWidth, itemHeight, itemPTB, itemPLR, itemSpace, itemBGColor, borderWidth, borderStyle, borderColor, borderRadius, radiusType, shadowColor, shadowHOffset, shadowVOffset, shadowBlur, shadowSpreed } = props.attributes;

        // Styles
        const boxStyles = { width: `${itemWidth}px`, height: `${itemHeight}px`, backgroundColor: itemBGColor, border: `${borderWidth}px ${borderStyle} ${borderColor}`, boxShadow: `${shadowColor} ${shadowHOffset}px ${shadowVOffset}px ${shadowBlur}px ${shadowSpreed}px` };

        const boxClasses = `countdownItem ${itemInline ? 'inline' : ''} text-${itemTextAlign} ptb-${itemPTB} plr-${itemPLR} mx-${Math.floor(itemSpace / 2)} mmy-${Math.floor(itemSpace / 2)} radius-${borderRadius}-${'%' === radiusType ? 'per' : radiusType}`;

        const digitStyles = { color: digitColor };
        const digitClasses = `holder fontSize-${digitFontSize}`;

        const labelStyles = { color: labelColor };
        const labelClasses = `label fontSize-${labelFontSize}`;

        return (
            <div id={`bBlocksCountdown-${cId}`} data-date={`{ "destDate": "${destDate}"}`} >
                <div className='countdownItems' style={{ justifyContent: itemPos, alignItems: itemPos }}>
                    <Box is={isDays} boxClasses={`countdownDays ${boxClasses}`} boxStyles={boxStyles} digitClasses={digitClasses} digitStyles={digitStyles} isLabels={isLabels} label={daysLabel} labelClasses={labelClasses} labelStyles={labelStyles} />

                    <Box is={isHours} boxClasses={`countdownHours ${boxClasses}`} boxStyles={boxStyles} digitClasses={digitClasses} digitStyles={digitStyles} isLabels={isLabels} label={hoursLabel} labelClasses={labelClasses} labelStyles={labelStyles} />

                    <Box is={isMinutes} boxClasses={`countdownMinutes ${boxClasses}`} boxStyles={boxStyles} digitClasses={digitClasses} digitStyles={digitStyles} isLabels={isLabels} label={minutesLabel} labelClasses={labelClasses} labelStyles={labelStyles} />

                    <Box is={isSeconds} boxClasses={`countdownSeconds ${boxClasses}`} boxStyles={boxStyles} digitClasses={digitClasses} digitStyles={digitStyles} isLabels={isLabels} label={secondsLabel} labelClasses={labelClasses} labelStyles={labelStyles} />
                </div>
            </div>
        );
    },

    example: {
        attributes: {
            'preview': true
        },
    },
});