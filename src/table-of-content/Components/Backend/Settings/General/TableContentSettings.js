import { __ } from '@wordpress/i18n';
import { PanelBody, PanelRow, SelectControl, TextControl } from '@wordpress/components';
import { produce } from 'immer';

import { Label, SelectTokenField } from '../../../../../../../bpl-tools/Components';
import { bullets } from '../../../../utils/commonOptions';
import { htmlTags, markups } from '../../../../utils/options';
import IconPicker from '../../Panel/IconPicker/IconPicker';

const TableContentSettings = ({ attributes, setAttributes }) => {
    const { title, theme, markup, tagName } = attributes;

    const updateTitle = (key, value) => {
        const newTitle = produce(title, draft => {
            draft[key] = value;
        });
        setAttributes({ title: newTitle });
    }
    const tagOptions = [{ label: 'H1', value: 'h1' }, { label: 'H2', value: 'h2' }, { label: 'H3', value: 'h3' }, { label: 'H4', value: 'h4' }, { label: 'H5', value: 'h5' }, { label: 'H6', value: 'h6' }]

    return <PanelBody className='bPlPanelBody' title={__('Table of Contents', 'b-blocks')} initialOpen={true}>
        <TextControl label={__('Title', 'b-blocks')} value={title.text} onChange={(value) => updateTitle('text', value)} />

        <PanelRow className='mt20'>
            <Label className=''>{__('Title Tag', 'b-blocks')}</Label>
            <SelectControl value={title.tag} onChange={(value) => setAttributes({ title: { ...title, tag: value } })} options={htmlTags} />
        </PanelRow>

        <Label>{__('Anchors By Tags', 'b-blocks')}</Label>
        <SelectTokenField options={tagOptions} value={tagName} onChange={(value) => setAttributes({ tagName: value })} />

        {/* <PanelRow className='mt20'>
        <Label className=''>Theme</Label>
        <SelectControl value={theme} onChange={(value) => setAttributes({ theme: value })} options={themes} />
      </PanelRow> */}

        {'default' === theme && <>
            <PanelRow className='mt20'>
                <Label className=''>Markup view</Label>
                <SelectControl value={markup.view} options={markups} onChange={(value) => setAttributes({ markup: { ...markup, view: value, icon: value === 'disc' && 'fa-solid fa-circle' } })} />
            </PanelRow>

            {markup.view === 'disc' && (
                <IconPicker icons={bullets} label={'Icon'} renderFunction={(value) => setAttributes({ markup: { ...markup, icon: value, view: value === 'decimal' ? 'decimal' : 'disc', }, })} value={markup.icon} default={'decimal'} />
            )}
        </>}
    </PanelBody>
};

export default TableContentSettings;
