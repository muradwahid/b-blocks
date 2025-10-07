import { __ } from '@word press/i18n';
import { __experimentalInputControl as InputControl, __experimentalNumberControl as NumberControl, PanelBody, SelectControl, ToggleControl } from '@wordpress/components';

import { BtnGroup } from '../../../../../../../bpl-tools/Components';
import { embedAlignOptions, typeOptions } from '../../../../utils/options';

const General = ({ attributes, updateObj }) => {
    const { facebook } = attributes;
    return <PanelBody className='bPlPanelBody' title={__('Embed', 'b-blocks')} initialOpen={true}>

        <SelectControl label={__('Type', 'b-blocks')} labelPosition='edge' value={facebook.type} onChange={(value) => updateObj('facebook', value, 'type')} options={typeOptions} />

        <InputControl className='mt10' label={__('URL', 'b-blocks')} labelPosition='edge' value={facebook.url[facebook.type]} onChange={(value) => updateObj('facebook', value, 'url', facebook.type)} />

        <ToggleControl className='mt10' label={__('Full Post', 'b-blocks')} checked={facebook.fullPost} onChange={(value) => updateObj('facebook', value, 'fullPost')} />

        {facebook.type === 'video' && <>
            <ToggleControl className='mt10' label={__('Show Caption', 'b-blocks')} checked={facebook.caption} onChange={(value) => updateObj('facebook', value, 'caption')} />

            <ToggleControl className='mt10' label={__('Full Screen', 'b-blocks')} checked={facebook.fullScreen} onChange={(value) => updateObj('facebook', value, 'fullScreen')} />

            <ToggleControl className='mt10' label={__('Auto Play', 'b-blocks')} checked={facebook.autoPlay} onChange={(value) => updateObj('facebook', value, 'autoPlay')} />

        </>}

        <NumberControl className='mt10' label={__('Width', 'b-blocks')} labelPosition='edge' value={facebook.width} onChange={(value) => updateObj('facebook', value, 'width')} min={1} max={1200} step={5} />

        <BtnGroup className='mt10' value={facebook.alignment} isIcon={true} label={__('Alignment', 'b-blocks')} options={embedAlignOptions} onChange={value => updateObj('facebook', value, 'alignment')} />
    </PanelBody>
};

export default General;
