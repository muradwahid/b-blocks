import { __ } from '@wordpress/i18n';
import { InspectorControls, AlignmentToolbar, BlockControls } from '@wordpress/block-editor';
import { PanelRow, PanelBody, TextControl, SelectControl } from '@wordpress/components';

// Variables
import Title from '../../Components/Title';
import ColorsControl from '../../Components/ColorsControl';
import IconControl from '../../Components/IconControl';
import BorderControl from '../../Components/BorderControl';
import Typography from '../../Components/Typography';
import BtnGroup from '../../Components/BtnGroup';
import SpaceControl from '../../Components/SpaceControl';
const mailtoStyles = [
    { label: 'Default', value: 'default' },
    { label: 'Style 1', value: 'style1' },
    { label: 'Style 2', value: 'style2' },
    { label: 'Style 3', value: 'style3' }
];

const Settings = ({ settings }) => {
    const { attributes: { mailtoAlign, receiverMail, style, btnTypo, btnColors, btnHovColors, btnPadding, btnBorder, icon, iconPosition }, setAttributes } = settings;

    return <>
        <InspectorControls>
            <PanelBody className='bBlocksPanelBody' title={__('Mail Settings', 'b-blocks')}>
                <Title mt='0' mb='0'>{__('E-mail Address:', 'b-blocks')}</Title>
                <TextControl value={receiverMail} onChange={val => setAttributes({ receiverMail: val })} placeholder={__('Email Address', 'b-blocks')} />

                <PanelRow className='mt-20p'>
                    <Title mt='0' mb='0'>{__('Style:', 'b-blocks')}</Title>
                    <SelectControl value={style} onChange={val => {
                        setAttributes({ style: val });

                        'default' === val && setAttributes({
                            btnColors: { color: '#fff', bg: '#4527a4', styles: 'color: #fff; background: #4527a4;' },
                            btnHovColors: { color: '#fff', bg: '#8344c5', styles: 'color: #fff; background: #8344c5;' },
                            iconPosition: 'left'
                        });
                        'style1' === val && setAttributes({
                            btnColors: { color: '#fff', bg: '#4527a4', styles: 'color: #fff; background: #4527a4;' },
                            btnHovColors: { color: '#fff', bg: '#8344c5', styles: 'color: #fff; background: #8344c5;' },
                            iconPosition: 'right'
                        });
                        'style2' === val && setAttributes({
                            btnColors: { color: '#fff', bg: '#57d0ff', styles: 'color: #fff; background: #57d0ff;' },
                            btnHovColors: { color: '#fff', bg: '#50e38b', styles: 'color: #fff; background: #50e38b;' },
                            iconPosition: 'left'
                        });
                        'style3' === val && setAttributes({
                            btnColors: { color: '#fff', bg: '#57d0ff', styles: 'color: #fff; background: #57d0ff;' },
                            btnHovColors: { color: '#fff', bg: '#50e38b', styles: 'color: #fff; background: #50e38b;' },
                            iconPosition: 'right'
                        });
                    }} options={mailtoStyles} />
                </PanelRow>
            </PanelBody>

            <PanelBody className='bBlocksPanelBody' title={__('Button Settings', 'b-blocks')} initialOpen={false}>
                <Typography typography={btnTypo} onChange={val => setAttributes({ btnTypo: val })} defaults={{ fontSize: 22, fontWeight: 600 }} />

                <ColorsControl colors={btnColors} onChange={val => setAttributes({ btnColors: val })} defaults={{ color: '#fff', bg: '#4527a4' }} />

                <ColorsControl label={__('Hover Colors:', 'b-blocks')} colors={btnHovColors} onChange={val => setAttributes({ btnHovColors: val })} defaults={{ color: '#fff', bg: '#8344c5' }} />

                <SpaceControl className='mt-20p' label={__('Padding:', 'b-blocks')} space={btnPadding} onChange={val => setAttributes({ btnPadding: val })} defaults={{ vertical: '18px', horizontal: '45px' }} />

                <BorderControl label={__('Border:', 'b-blocks')} border={btnBorder} onChange={val => setAttributes({ btnBorder: val })} defaults={{ radius: '50px' }} />
            </PanelBody>

            <PanelBody className='bBlocksPanelBody' title={__('Icon Settings', 'b-blocks')} initialOpen={false}>
                <IconControl icon={icon} onChange={val => setAttributes({ icon: val })} defaults={{ class: 'fa fa-paper-plane' }} onlyIcon={true} />

                <PanelRow className='mt-20p'>
                    <Title mt='0'>{__('Position:', 'b-blocks')}</Title>
                    <BtnGroup myValue={iconPosition} setState={val => setAttributes({ iconPosition: val })} options={[
                        { label: 'Left', value: 'left', icon: 'LEFT' },
                        { label: 'Right', value: 'right', icon: 'RIGHT' }
                    ]} />
                </PanelRow>
            </PanelBody>
        </InspectorControls>


        <BlockControls>
            <AlignmentToolbar value={mailtoAlign} onChange={val => setAttributes({ mailtoAlign: val })} describedBy={__('Mail Button Alignment')} alignmentControls={[
                { title: __('Mail Button in left', 'b-blocks'), align: 'left', icon: 'align-left' },
                { title: __('Mail Button in center', 'b-blocks'), align: 'center', icon: 'align-center' },
                { title: __('Mail Button in right', 'b-blocks'), align: 'right', icon: 'align-right' }
            ]} />
        </BlockControls>
    </>;
};

export default Settings;