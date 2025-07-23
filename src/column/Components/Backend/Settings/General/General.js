import { PanelBody, PanelRow, RangeControl} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { Device, Label } from '../../../../../../../bpl-tools/Components';

const General = ({ attributes, updateColumnWidth, device, MINWIDTH, columns }) => {

    const { width } = attributes;

    const maxColWidth = 100 - (columns - 1) * MINWIDTH;

    return <>
        <PanelBody className='bPlPanelBody' title={__('Layout', 'b-blocks')}>
            <PanelRow>
                <Label className='mb5'>{__('Width (%):', 'b-blocks')}</Label>
                <Device />
            </PanelRow>
            <RangeControl
                value={width[device]}
                onChange={val => updateColumnWidth(device, val)}
                min={MINWIDTH}
                max={'desktop' === device ? maxColWidth : 100}
                step={0.01}
            // disabled={'desktop' === device && !nextClientId ? true : false}
            />
        </PanelBody>
    </>
};

export default General;