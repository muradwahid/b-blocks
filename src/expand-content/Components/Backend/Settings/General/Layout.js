import { PanelBody, PanelRow, __experimentalUnitControl as UnitControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { BtnGroup, ColorControl, Label } from '../../../../../../../bpl-tools/Components';
import { buttonAlignment } from '../../../../utils/options';

const Layout = (props) => {
    const { attributes, updateObj } = props;
    const { layout, buttons } = attributes;
    return <PanelBody title={__('Layout', 'b-blocks')} initialOpen={true} className='bPlPanelBody'>

        <UnitControl label={__('Collapsed Preview Height (px)', 'b-blocks')} value={layout?.previewHeight} onChange={(val) => updateObj('layout', val, 'previewHeight')} help={__('How much of the content stays visible before the Show More button.', 'b-blocks')} />

        <UnitControl label={__('Fade Overlay Height (px)', 'b-blocks')} value={layout?.fadeHeight} onChange={(val) => updateObj('layout', val, 'fadeHeight')} help={__('Set to 0 to hide the fade overlay entirely.', 'b-blocks')} />

        <ColorControl label={__('Fade Color:', 'b-blocks')} value={layout?.fadeColor} onChange={(val) => updateObj('layout', val, 'fadeColor')} defaultColor='#ffffff' />

        <p className='components-base-control__help' style={{ marginTop: '-8px' }}>
            {__('Match your page background color so the fade blends seamlessly.', 'b-blocks')}
        </p>

        <PanelRow>
            <Label className=''>{__('Button Align', 'b-blocks')}</Label>
            <BtnGroup value={buttons.alignment} onChange={val => updateObj('buttons', val, 'alignment')} options={buttonAlignment} isIcon={true} size='default' />
        </PanelRow>

    </PanelBody>
};

export default Layout;