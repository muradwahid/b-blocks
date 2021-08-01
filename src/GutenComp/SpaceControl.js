import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { PanelRow, __experimentalUnitControl as UnitControl, ButtonGroup, Button, Tooltip } from '@wordpress/components';

/**
 * @props className (optional): 'mt-20p mb-5p' (String)
 * @props label (optional): 'Space' (String)
 * @props space (required): {side, vertical, horizontal, top, right, bottom, left} (Object)
 * @props onChange (required): (Function)
 * @props defaults (optional): { side, vertical, horizontal, top, right, bottom, left } (Object)
 */

import './SpaceControl.scss';
import Title from './Title';
import options from '../Const/options';
import icons from '../Const/icons';
const { pxUnit, perUnit, emUnit, remUnit } = options;

const SpaceControl = props => {
    const { className, label = __('Space:', 'b-blocks'), space, onChange, defaults = {} } = props;

    const defaultVal = { side: 2, vertical: '0px', horizontal: '0px', top: '0px', right: '0px', bottom: '0px', left: '0px' }

    const getDefault = property => defaults?.[property] || defaultVal[property];

    const getValue = property => space?.[property] || getDefault(property);
    const setValue = (property, val) => onChange({ ...space, [property]: val });

    const getIntVal = property => parseInt(getValue(property)?.replace(/([a-z])+/g, ''));

    useEffect(() => {
        const allStyles = 2 === space?.side ? `${getValue('vertical')} ${getValue('horizontal')}` : `${getValue('top')} ${getValue('right')} ${getValue('bottom')} ${getValue('left')}`;

        const initialObj = { side: getValue('side'), vertical: getValue('vertical'), horizontal: getValue('horizontal'), top: getValue('top'), right: getValue('right'), bottom: getValue('bottom'), left: getValue('left') }

        onChange({ ...space, ...initialObj, ['styles']: allStyles.replace(/\s+/g, ' ').trim() });
    }, [space?.side, space?.vertical, space?.horizontal, space?.top, space?.right, space?.bottom, space?.left]);

    // Check if space property and value are equals to defaults or defaultVal
    const isObject = object => object != null && typeof object === 'object';
    const triCompare = (main, defaults, defaultVal) => {
        const mainAllKeys = Object.keys(main || {});
        const mainKeys = mainAllKeys.filter(arr => arr !== 'styles');

        const equalSpecific = (main, defaults) => {
            const mainKeys = Object.keys(main);

            for (const key of mainKeys) {
                const mainVal = main[key];
                const defaultVal = defaults[key];
                const areObjects = isObject(mainVal) && isObject(defaultVal);

                if (areObjects && !equalSpecific(mainVal, defaultVal) || !areObjects && mainVal !== defaultVal) {
                    return false;
                }
            }

            return true;
        }

        for (const key of mainKeys) {
            const mainSingle = main[key];
            const defaultsSingle = defaults[key];
            const defaultValSingle = defaultVal[key];

            const areObjects1 = isObject(mainSingle) && isObject(defaultsSingle);
            const areObjects2 = isObject(mainSingle) && isObject(defaultValSingle);

            if (!defaultsSingle) {
                if (areObjects2 && !equalSpecific(mainSingle, defaultValSingle) || !areObjects2 && mainSingle !== defaultValSingle) {
                    return false;
                }
            } else {
                if (areObjects1 && !equalSpecific(mainSingle, defaultsSingle) || !areObjects1 && mainSingle !== defaultsSingle) {
                    return false;
                }
            }
        }

        return true;
    }

    return <div className={`bBlocksSpaceControl ${className}`}>
        <PanelRow>
            <Title mt='0' mb='0'>{label}</Title>

            <ButtonGroup className={`bBlocksBtnGroup`}>
                <Tooltip text={__('Vertical, Horizontal', 'b-blocks')} position='top'>
                    <Button isMedium={true} isPrimary={2 === getValue('side')} aria-pressed={2 === getValue('side')} onClick={() => onChange({ ...space, ['side']: 2, ['vertical']: `${(getIntVal('top') + getIntVal('bottom')) / 2}px`, ['horizontal']: `${(getIntVal('left') + getIntVal('right')) / 2}px` })}>
                        <span className='scrollIcon'>{icons.scroll}</span>
                        <span className='sideScrollIcon'>{icons.scroll}</span>
                    </Button>
                </Tooltip>
                <Tooltip text={__('Top, Right, Bottom, Left', 'b-blocks')} position='top'>
                    <Button isMedium={true} isPrimary={4 === getValue('side')} aria-pressed={4 === getValue('side')} onClick={() => onChange({ ...space, ['side']: 4, ['top']: getValue('vertical'), ['right']: getValue('horizontal'), ['bottom']: getValue('vertical'), ['left']: getValue('horizontal') })}>
                        <span className='dashicon dashicons dashicons-arrow-up-alt'></span>
                        <span className='dashicon dashicons dashicons-arrow-right-alt'></span>
                        <span className='dashicon dashicons dashicons-arrow-down-alt'></span>
                        <span className='dashicon dashicons dashicons-arrow-left-alt'></span>
                    </Button>
                </Tooltip>
            </ButtonGroup>

            {!triCompare(space, defaults, defaultVal) && <Button icon='image-rotate' className='bBlocksResetVal' onClick={() => {
                const obj = { side: getDefault('side'), vertical: getDefault('vertical'), horizontal: getDefault('horizontal'), top: getDefault('top'), right: getDefault('right'), bottom: getDefault('bottom'), left: getDefault('left') }
                onChange({ ...space, ...obj });
            }} />}
        </PanelRow>

        {2 === getValue('side') && <PanelRow className='twoColumn'>
            <UnitControl label={__('Top Bottom:', 'b-blocks')} labelPosition='top' value={getValue('vertical')} onChange={val => setValue('vertical', val)} units={[pxUnit, perUnit, emUnit, remUnit]} />

            <UnitControl label={__('Left Right:', 'b-blocks')} labelPosition='top' value={getValue('horizontal')} onChange={val => setValue('horizontal', val)} units={[pxUnit, perUnit, emUnit, remUnit]} />
        </PanelRow>}

        {4 === getValue('side') && <PanelRow className='fourColumn'>
            <UnitControl label={__('Top:', 'b-blocks')} labelPosition='top' value={getValue('top')} onChange={val => setValue('top', val)} units={[pxUnit, perUnit, emUnit, remUnit]} />

            <UnitControl label={__('Right:', 'b-blocks')} labelPosition='top' value={getValue('right')} onChange={val => setValue('right', val)} units={[pxUnit, perUnit, emUnit, remUnit]} />

            <UnitControl label={__('Bottom:', 'b-blocks')} labelPosition='top' value={getValue('bottom')} onChange={val => setValue('bottom', val)} units={[pxUnit, perUnit, emUnit, remUnit]} />

            <UnitControl label={__('Left:', 'b-blocks')} labelPosition='top' value={getValue('left')} onChange={val => setValue('left', val)} units={[pxUnit, perUnit, emUnit, remUnit]} />
        </PanelRow>}
    </div>;
};
export default SpaceControl;