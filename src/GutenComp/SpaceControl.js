import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { PanelRow, __experimentalUnitControl as UnitControl, ButtonGroup, Button, Tooltip } from '@wordpress/components';

/**
 * @props label (optional): 'Space' (String)
 * @props space (required): {side, vertical, horizontal, top, right, bottom, left} (Object)
 * @props onChange (required): (Function)
 * @props defaults (optional): { side, vertical, horizontal, top, right, bottom, left } (Object)
 */

import './SpaceControl.scss';
import Title from './Title';
import options from '../Const/options';
import icons from '../Const/icons';
const { pxEmUnits } = options;

const SpaceControl = props => {
    const { label = __('Space:', 'b-blocks'), space, onChange, defaults = {} } = props;

    const defaultVal = { side: 2, vertical: '0px', horizontal: '0px', top: '0px', right: '0px', bottom: '0px', left: '0px' }

    useEffect(() => {
        const allStyles = 2 === space?.side ? `${space?.vertical || 0} ${space?.horizontal || 0}` : `${space?.top || 0} ${space?.right || 0} ${space?.bottom || 0} ${space?.left || 0}`;

        onChange({ ...space, ['styles']: allStyles.replace(/\s+/g, ' ').trim(), ['side']: space?.side || defaults?.side || 2 });
    }, [space?.side, space?.vertical, space?.horizontal, space?.top, space?.right, space?.bottom, space?.left]);

    const defVal = prop => defaults[prop] || defaultVal[prop];

    // Check if space property and value are equals to defaults || defaultVal
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

    return <div className='bBlocksSpaceControl'>
        <PanelRow className='mt-20p mb-5p'>
            <Title mt='0' mb='0'>{label}</Title>

            <ButtonGroup className={`bBlocksBtnGroup`}>
                <Tooltip text={__('Vertical, Horizontal', 'b-blocks')} position='top'>
                    <Button isMedium={true} isPrimary={2 === space?.side} aria-pressed={2 === space?.side} onClick={() => onChange({ ...space, ['side']: 2, ['vertical']: space?.top || '0px', ['horizontal']: space?.right || '0px' })}>
                        <span className='scrollIcon'>{icons.scroll}</span>
                        <span className='sideScrollIcon'>{icons.scroll}</span>
                    </Button>
                </Tooltip>
                <Tooltip text={__('Top, Right, Bottom, Left', 'b-blocks')} position='top'>
                    <Button isMedium={true} isPrimary={4 === space?.side || false} aria-pressed={4 === space?.side || false} onClick={() => onChange({ ...space, ['side']: 4, ['top']: space?.vertical || '0px', ['right']: space?.horizontal || '0px', ['bottom']: space?.vertical || '0px', ['left']: space?.horizontal || '0px' })}>
                        <span className='dashicon dashicons dashicons-arrow-up-alt'></span>
                        <span className='dashicon dashicons dashicons-arrow-right-alt'></span>
                        <span className='dashicon dashicons dashicons-arrow-down-alt'></span>
                        <span className='dashicon dashicons dashicons-arrow-left-alt'></span>
                    </Button>
                </Tooltip>
            </ButtonGroup>

            {!triCompare(space, defaults, defaultVal) && <Button icon='image-rotate' className='bBlocksResetVal' onClick={() => {
                const obj = { side: defVal('side'), vertical: defVal('vertical'), horizontal: defVal('horizontal'), top: defVal('top'), right: defVal('right'), bottom: defVal('bottom'), left: defVal('left') }
                onChange({ ...space, ...obj });
            }} />}
        </PanelRow>

        {2 === space?.side && <PanelRow className='twoColumn'>
            <UnitControl label={__('Top Bottom:', 'b-blocks')} labelPosition='top' value={space?.vertical || '0px'} onChange={val => onChange({ ...space, ['vertical']: val })} units={pxEmUnits} />

            <UnitControl label={__('Left Right:', 'b-blocks')} labelPosition='top' value={space?.horizontal || '0px'} onChange={val => onChange({ ...space, ['horizontal']: val })} units={pxEmUnits} />
        </PanelRow>}

        {4 === space?.side && <PanelRow className='fourColumn'>
            <UnitControl label={__('Top:', 'b-blocks')} labelPosition='top' value={space?.top || '0px'} onChange={val => onChange({ ...space, ['top']: val })} units={pxEmUnits} />

            <UnitControl label={__('Right:', 'b-blocks')} labelPosition='top' value={space?.right || '0px'} onChange={val => onChange({ ...space, ['right']: val })} units={pxEmUnits} />

            <UnitControl label={__('Bottom:', 'b-blocks')} labelPosition='top' value={space?.bottom || '0px'} onChange={val => onChange({ ...space, ['bottom']: val })} units={pxEmUnits} />

            <UnitControl label={__('Left:', 'b-blocks')} labelPosition='top' value={space?.left || '0px'} onChange={val => onChange({ ...space, ['left']: val })} units={pxEmUnits} />
        </PanelRow>}
    </div>;
};
export default SpaceControl;