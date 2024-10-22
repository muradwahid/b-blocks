import { __ } from '@wordpress/i18n';
import { AlignmentToolbar, BlockControls, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, SelectControl, ToggleControl, Button, Dashicon, __experimentalUnitControl as UnitControl } from '@wordpress/components';
import { produce } from 'immer';

import { Label, Background, IconControl, InlineDetailMediaUpload, HelpPanel } from '../../../../../../bpl-tools/Components';
import { BorderControl, ShadowControl } from '../../../../../../bpl-tools/Components/Deprecated';
import { gearIcon } from '../../../../../../bpl-tools/utils/icons';
import { pxUnit, perUnit, emUnit } from '../../../../../../bpl-tools/utils/options';

import { pluginSlug, socialShareDocs } from '../../../../utils/data';
import { compareAndReturn } from '../../../utils/functions';
import { themes, networkTypes, socialNetworks, mobileNetworks, iconClassList, iconColorList, isUpIconList } from '../../../utils/options';

const Settings = ({ attributes, setAttributes, activeIndex, setActiveIndex }) => {
	const { socials, alignment, theme, background, size, padding, margin, border, shadow } = attributes;

	const addSocial = () => {
		setAttributes({
			socials: [...socials, {
				networkType: 'socialNetworks',
				network: 'facebook',
				isUpIcon: false,
				icon: { class: 'fab fa-facebook-f', color: '#1877f2' },
				upIcon: { id: null, url: '', alt: '', title: '' }
			}]
		});
		setActiveIndex(socials.length);
	}

	const updateSocial = (type, val) => {
		const newSocials = produce(socials, draft => {
			draft[activeIndex][type] = val;
		});

		setAttributes({ socials: newSocials });
	}

	const updateSocialByParams = (params) => {
		const newSocials = produce(socials, draft => {
			for (const param of params) {
				const type = param[0];
				const value = param[1];
				const otherType = param?.[2];

				if (otherType) {
					draft[activeIndex][type][otherType] = value;
				} else {
					draft[activeIndex][type] = value;
				}
			}
		});

		setAttributes({ socials: newSocials });
	}

	const updateAllSocial = (type, val, otherType = false) => {
		const newSocials = [...socials];

		newSocials.map((social, index) => {
			if (otherType) {
				newSocials[index][type][otherType] = val;
			} else {
				newSocials[index][type] = val;
			}
		});
		setAttributes({ socials: newSocials });
	}

	const duplicateSocial = e => {
		e.preventDefault();

		setAttributes({ socials: [...socials.slice(0, activeIndex), { ...socials[activeIndex] }, ...socials.slice(activeIndex)] });

		setActiveIndex(activeIndex + 1);
	}

	const removeSocial = e => {
		e.preventDefault();

		setAttributes({ socials: [...socials.slice(0, activeIndex), ...socials.slice(activeIndex + 1)] });

		setActiveIndex(0 === activeIndex ? 0 : activeIndex - 1);
	}

	const { networkType = '', network = '', isUpIcon = false, icon = {}, upIcon = {} } = socials[activeIndex] || {};

	return <>
		<InspectorControls>
			<HelpPanel slug={pluginSlug} docsLink={socialShareDocs} />


			<PanelBody className='bPlPanelBody addRemoveItems editItem' title={__('Add or Remove socials', 'b-blocks')}>
				{null !== activeIndex && <>
					<h3 className='bplItemTitle'>{__(`Social No ${activeIndex + 1}:`, 'b-blocks')}</h3>

					<PanelRow>
						<Label className=''>{__('Network Type:', 'b-blocks')}</Label>
						<SelectControl value={networkType} onChange={val => {
							const params = [
								['networkType', val],
								['network', 'mobileMessenger' === val ? 'sms' : 'facebook'],
								['isUpIcon', false],
								['icon', 'mobileMessenger' === val ? 'fas fa-sms' : 'fab fa-facebook-f', 'class'],
								['icon', 'mobileMessenger' === val ? '#000' : '#1877f2', 'color']
							];
							updateSocialByParams(params);
						}} options={networkTypes} />
					</PanelRow>

					<PanelRow>
						<Label className=''>{__('Network:', 'b-blocks')}</Label>
						<SelectControl value={network} onChange={val => {
							const params = [
								['network', val],
								['icon', compareAndReturn(val, iconClassList), 'class'],
								['icon', compareAndReturn(val, iconColorList), 'color'],
								['isUpIcon', compareAndReturn(val, isUpIconList)]
							];
							updateSocialByParams(params);
						}} options={'mobileMessenger' === networkType ? mobileNetworks : socialNetworks} />
					</PanelRow>

					<ToggleControl className='mt20' label={__('Upload Icon?', 'b-blocks')} checked={isUpIcon} onChange={val => updateSocial('isUpIcon', val)} />

					{isUpIcon ? <>
						<Label>{__('Icon:', 'b-blocks')}</Label>
						<InlineDetailMediaUpload className='mt10' value={upIcon} onChange={val => updateSocial('upIcon', val)} placeholder={__('Enter Icon URL', 'b-blocks')} />
					</> :
						<IconControl label={__('Icon:', 'b-blocks')} value={icon} onChange={val => updateSocial('icon', val)} defaults={{ class: 'fab fa-facebook-f', color: '#4527a4' }} isSize={false} />}

					<PanelRow className='itemAction mt20 mb15'>
						{1 < socials?.length && <Button className='removeItem' label={__('Remove', 'b-blocks')} onClick={removeSocial} ><Dashicon icon='no' />{__('Remove', 'b-blocks')}</Button>}

						<Button className='duplicateItem' label={__('Duplicate', 'b-blocks')} onClick={duplicateSocial} >{gearIcon}{__('Duplicate', 'b-blocks')}</Button>
					</PanelRow>
				</>}

				<div className='addItem'>
					<Button label={__('Add New Social', 'b-blocks')} onClick={addSocial}><Dashicon icon='plus' />{__('Add New Social', 'b-blocks')}</Button>
				</div>
			</PanelBody>


			<PanelBody className='bPlPanelBody' title={__('Social Icon Settings', 'b-blocks')} initialOpen={false}>
				<PanelRow>
					<Label className=''>{__('Theme:', 'b-blocks')}</Label>
					<SelectControl value={theme} onChange={val => {
						setAttributes({ theme: val });
						'default' === val && (
							setAttributes({
								background: { type: 'solid', color: '#0000' },
								border: { width: '0', color: '#0000' }
							}),
							updateAllSocial('icon', '#4527a4', 'color')
						);

						'theme1' === val && (
							setAttributes({
								background: { type: 'gradient', gradient: 'linear-gradient(135deg, #4527a4, #8344c5)' },
								border: { width: '0', color: '#0000' }
							}),
							updateAllSocial('icon', '#fff', 'color')
						);

						'theme2' === val && (
							setAttributes({
								background: { type: 'solid', color: '#0000' },
								border: { width: '2px', color: '#4527a4' }
							}),
							updateAllSocial('icon', '#4527a4', 'color')
						);
					}} options={themes} />
				</PanelRow>

				<Background label={__('Background:', 'b-blocks')} value={background} onChange={val => setAttributes({ background: val })} defaults={{ color: '#0000' }} />

				<UnitControl className='mt20' label={__('Size:', 'b-blocks')} labelPosition='left' value={size} onChange={val => setAttributes({ size: val })} units={[pxUnit(), perUnit(), emUnit()]} />

				<UnitControl className='mt20' label={__('Padding:', 'b-blocks')} labelPosition='left' value={padding} onChange={val => setAttributes({ padding: val })} units={[pxUnit(), perUnit(), emUnit()]} />

				<UnitControl className='mt20' label={__('Space Between:', 'b-blocks')} labelPosition='left' value={margin} onChange={val => setAttributes({ margin: val })} units={[pxUnit(), perUnit(), emUnit()]} />

				<BorderControl label={__('Border:', 'b-blocks')} value={border} onChange={val => setAttributes({ border: val })} defaults={{ radius: '50%' }} />

				<ShadowControl label={__('Shadow:', 'b-blocks')} value={shadow} onChange={val => setAttributes({ shadow: val })} />
			</PanelBody>
		</InspectorControls>


		<BlockControls>
			<AlignmentToolbar value={alignment} onChange={val => setAttributes({ alignment: val })} describedBy={__('Social Icons Alignment')} alignmentControls={[
				{ title: __('Social Icons in left', 'b-blocks'), align: 'left', icon: 'align-left' },
				{ title: __('Social Icons in center', 'b-blocks'), align: 'center', icon: 'align-center' },
				{ title: __('Social Icons in right', 'b-blocks'), align: 'right', icon: 'align-right' }
			]} />
		</BlockControls>
	</>;
};
export default Settings;