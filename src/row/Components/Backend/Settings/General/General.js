import { PanelBody, PanelRow, SelectControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { Label } from '../../../../../../../bpl-tools/Components';
import { emUnit, pxUnit, vhUnit } from '../../../../../../../bpl-tools/utils/options';

const heightTypes = [
    { label: __('Auto', 'b-blocks'), value: 'auto' },
    { label: __('Window Height (100%)', 'b-blocks'), value: 'window' },
    { label: __('Custom', 'b-blocks'), value: 'custom' }
];
const positions = axis => ([
    { label: 'x' === axis ? __('Left', 'b-blocks') : __('Top', 'b-blocks'), value: 'flex-start' },
    { label: __('Center', 'b-blocks'), value: 'center' },
    { label: 'x' === axis ? __('Right', 'b-blocks') : __('Bottom', 'b-blocks'), value: 'flex-end' }
]);
const General = (props) => {
    const { attributes, setAttributes } = props;
    const { columnGap, heightType, height, columnPositionY, columnPositionX } = attributes;
    return <>
        <PanelBody className='bPlPanelBody' title={__('Layout', 'b-blocks')}>
            <UnitControl label={__('Column Gap:', 'b-blocks')} labelPosition='left' value={columnGap} onChange={val => setAttributes({ columnGap: val })} units={[pxUnit()]} />

            <PanelRow className='mt20'>
                <Label className=''>{__('Height:', 'b-blocks')}</Label>
                <SelectControl value={heightType} onChange={val => {
                    setAttributes({ heightType: val, height: 'window' === val ? '100vh' : 'auto' === val ? 'auto' : 'initial' })
                }} options={heightTypes} />
            </PanelRow>

            {'custom' === heightType && <UnitControl className='mt10' label={__('Min Height:', 'b-blocks')} labelPosition='left' value={height} onChange={val => setAttributes({ height: val })} units={[pxUnit(), emUnit(), vhUnit()]} />}

            <PanelRow className='mt20'>
                <Label className=''>{__('Columns Vertical Position:', 'b-blocks')}</Label>
                <SelectControl value={columnPositionY} onChange={val => setAttributes({ columnPositionY: val })} options={positions('y')} />
            </PanelRow>

            <PanelRow className='mt10'>
                <Label className=''>{__('Columns Horizontal Position:', 'b-blocks')}</Label>
                <SelectControl value={columnPositionX} onChange={val => setAttributes({ columnPositionX: val })} options={positions('x')} />
            </PanelRow>
        </PanelBody>
    </>
};

export default General;