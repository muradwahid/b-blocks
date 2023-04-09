import { __ } from '@wordpress/i18n';
import { useState } from 'react';
import { InspectorControls, AlignmentToolbar, BlockControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, RangeControl, ToggleControl, __experimentalUnitControl as UnitControl, Dashicon, ToolbarGroup, ToolbarButton, Button, ButtonGroup, Tooltip } from '@wordpress/components';
import produce from 'immer';

// Settings Components
import Title from '../../../../Components/Title';
import BColor from '../../../../Components/BColor';
import Background from '../../../../Components/Background';
import SeparatorControl from '../../../../Components/SeparatorControl';
import BorderControl from '../../../../Components/BorderControl';
import { ChangeImageData } from '../../../../Components/ImageControl';
import { InlineDetailMediaUpload } from '../../../../Components/MediaControl';
import BDevice from '../../../../Components/BDevice';
import Typography from '../../../../Components/Typography';
import SpaceControl from '../../../../Components/SpaceControl';
import { gearIcon } from '../../../../Components/Helper/icons';
import { pxUnit, perUnit, emUnit } from '../../../../Components/Helper/options';

import { horizontalLineIcon, verticalLineIcon } from '../../utils/icons';

const Settings = ({ attributes, setAttributes, updateProduct, activeIndex, setActiveIndex }) => {
	const { products = [], columns, columnGap, rowGap, layout, textAlign, padding, imgMargin, nameTypo, nameMargin, isDesc, descTypo, descMargin, priceTypo, isSep } = attributes;

	const [device, setDevice] = useState('desktop');

	const addProduct = () => {
		setAttributes({
			products: [...products, {
				background: { color: '#0000' },
				img: { id: null, url: '', alt: '', title: '' },
				imgBorder: {},
				name: `Product ${products.length + 1} Name`,
				nameColor: '#333',
				desc: `This content area describes product ${products.length + 1} descriptions or details.`,
				descColor: '#333',
				price: '$99.99',
				priceColor: '#4527a4',
				separator: { width: '40%', height: '1px', color: '#bbb' }
			}]
		});
		setActiveIndex(products.length);
	}

	const duplicateProduct = e => {
		e.preventDefault();

		setAttributes({ products: [...products.slice(0, activeIndex), { ...products[activeIndex] }, ...products.slice(activeIndex)] });

		setActiveIndex(activeIndex + 1);
	}

	const removeProduct = e => {
		e.preventDefault();

		setAttributes({ products: [...products.slice(0, activeIndex), ...products.slice(activeIndex + 1)] });

		setActiveIndex(0 === activeIndex ? 0 : activeIndex - 1);
	}

	const { background = {}, img = {}, imgBorder = {}, nameColor = '', descColor = '', priceColor = '', separator = {} } = products[activeIndex] || {};

	return <>
		<InspectorControls>
			<PanelBody className='bPlPanelBody help' title={__('Help', 'b-blocks')} initialOpen={false}>
				{/* <div className='helpItem'>
					<a href='https://bblockswp.com/docs/price-list-block/' target='_blank' rel='noreferrer'><Dashicon icon='book' />{__('Read Documentation', 'b-blocks')}</a>
				</div> */}

				<div className='helpItem rateUs'>
					<a href='https://wordpress.org/support/plugin/b-blocks/reviews/#new-post' target='_blank' rel='noreferrer'>
						<span><Dashicon icon='star-filled' />{__('Would you please rate us?', 'b-blocks')}</span>
						<span>{__('We are new and we need your help to grow!🙏', 'b-blocks')}</span>
					</a>
				</div>
			</PanelBody>


			<PanelBody className='bPlPanelBody addRemoveItems editItem' title={__('Add or Remove Product', 'b-blocks')}>
				{null !== activeIndex && <>
					<h3 className='bplItemTitle'>{__(`Product No ${activeIndex + 1}:`, 'b-blocks')}</h3>

					<Background label={__('Background:', 'b-blocks')} value={background} onChange={val => updateProduct('background', val)} />

					<Title>{__('Image:', 'b-blocks')}</Title>
					<InlineDetailMediaUpload value={img} onChange={val => updateProduct('img', val)} placeholder={__('Enter Image URL', 'b-blocks')} />
					<ChangeImageData className='mt20' value={img} onChange={val => updateProduct('img', val)} />

					<BorderControl label={__('Image Border:', 'b-blocks')} value={imgBorder} onChange={val => updateProduct('imgBorder', val)} />

					<BColor label={__('Name Color:', 'b-blocks')} value={nameColor} onChange={val => updateProduct('nameColor', val)} defaultColor='#333' />

					<BColor label={__('Description Color:', 'b-blocks')} value={descColor} onChange={val => updateProduct('descColor', val)} defaultColor='#333' />

					<BColor label={__('Price Color:', 'b-blocks')} value={priceColor} onChange={val => updateProduct('priceColor', val)} defaultColor='#4527a4' />

					<SeparatorControl value={separator} onChange={val => updateProduct('separator', val)} defaults={{ width: '40%', height: '1px', color: '#bbb' }} />

					<PanelRow className='itemAction mt20 mb15'>
						{1 < products?.length && <Button className='removeItem' label={__('Remove', 'b-blocks')} onClick={removeProduct}><Dashicon icon='no' />{__('Remove', 'b-blocks')}</Button>}

						<Button className='duplicateItem' label={__('Duplicate', 'b-blocks')} onClick={duplicateProduct}>{gearIcon}{__('Duplicate', 'b-blocks')}</Button>
					</PanelRow>
				</>}

				<div className='addItem'>
					<Button label={__('Add New Product', 'b-blocks')} onClick={addProduct}><Dashicon icon='plus' />{__('Add New Product', 'b-blocks')}</Button>
				</div>
			</PanelBody>


			<PanelBody className='bPlPanelBody' title={__('Layout Settings', 'b-blocks')} initialOpen={false}>
				<PanelRow>
					<Title className='mb5'>{__('Layout:', 'b-blocks')}</Title>
					<ButtonGroup className='bPlBtnGroup'>
						<Tooltip text={__('Vertical', 'b-blocks')} position='top'>
							<Button icon={verticalLineIcon} isMedium isPrimary={'vertical' === layout} aria-pressed={'vertical' === layout} onClick={() => {
								setAttributes({
									layout: 'vertical',
									columns: { ...columns, ['desktop']: 3 },
									textAlign: 'center',
									padding: { ...padding, vertical: '50px', horizontal: '20px', styles: '50px 20px' },
									imgMargin: { ...imgMargin, right: '0px', bottom: '20px', styles: '0px 0px 20px 0px' }
								});
							}}></Button>
						</Tooltip>

						<Tooltip text={__('Horizontal', 'b-blocks')} position='top'>
							<Button icon={horizontalLineIcon} isMedium isPrimary={'horizontal' === layout} aria-pressed={'horizontal' === layout} onClick={() => {
								setAttributes({
									layout: 'horizontal',
									columns: { ...columns, ['desktop']: 2 },
									textAlign: 'left',
									padding: { ...padding, vertical: '20px', horizontal: '20px', styles: '20px 20px' },
									imgMargin: { ...imgMargin, right: '20px', bottom: '0px', styles: '0px 20px 0px 0px' }
								});
							}}></Button>
						</Tooltip>
					</ButtonGroup>
				</PanelRow>

				<PanelRow className='mt20'>
					<Title className='mb5'>{__('Columns:', 'b-blocks')}</Title>
					<BDevice device={device} onChange={val => setDevice(val)} />
				</PanelRow>
				<RangeControl value={columns[device]} onChange={val => { setAttributes({ columns: { ...columns, [device]: val } }) }} min={1} max={6} step={1} beforeIcon='grid-view' />

				<UnitControl className='mt20' label={__('Column Gap:', 'b-blocks')} labelPosition='left' value={columnGap} onChange={val => setAttributes({ columnGap: val })} units={[pxUnit(), perUnit(), emUnit()]} />

				<UnitControl className='mt20' label={__('Row Gap:', 'b-blocks')} labelPosition='left' value={rowGap} onChange={val => setAttributes({ rowGap: val })} units={[pxUnit(), perUnit(), emUnit()]} />
			</PanelBody>


			<PanelBody className='bPlPanelBody' title={__('Content Settings', 'b-blocks')} initialOpen={false}>
				<SpaceControl label={__('Padding:', 'b-blocks')} value={padding} onChange={val => setAttributes({ padding: val })} defaults={{ vertical: '50px', horizontal: '20px' }} />
			</PanelBody>


			<PanelBody className='bPlPanelBody' title={__('Image Settings', 'b-blocks')} initialOpen={false}>
				<SpaceControl label={__('Margin:', 'b-blocks')} value={imgMargin} onChange={val => setAttributes({ imgMargin: val })} defaults={{ side: 4, bottom: '20px' }} />
			</PanelBody>


			<PanelBody className='bPlPanelBody' title={__('Name Settings', 'b-blocks')} initialOpen={false}>
				<Typography value={nameTypo} onChange={val => setAttributes({ nameTypo: val })} defaults={{ fontSize: { desktop: 18, tablet: 17, mobile: 16 }, fontWeight: 600 }} produce={produce} />

				<SpaceControl className='mt20' label={__('Margin:', 'b-blocks')} value={nameMargin} onChange={val => setAttributes({ nameMargin: val })} defaults={{ side: 4, bottom: '10px' }} />
			</PanelBody>


			<PanelBody className='bPlPanelBody' title={__('Description Settings', 'b-blocks')} initialOpen={false}>
				<ToggleControl label={__('Show Description', 'b-blocks')} checked={isDesc} onChange={val => setAttributes({ isDesc: val })} />

				<Typography value={descTypo} onChange={val => setAttributes({ descTypo: val })} defaults={{ fontSize: { desktop: 15, tablet: 15, mobile: 15 }, fontStyle: 'italic' }} produce={produce} />

				<SpaceControl className='mt20' label={__('Margin:', 'b-blocks')} value={descMargin} onChange={val => setAttributes({ descMargin: val })} defaults={{ side: 4, bottom: '15px' }} />
			</PanelBody>


			<PanelBody className='bPlPanelBody' title={__('Price Settings', 'b-blocks')} initialOpen={false}>
				<Typography value={priceTypo} onChange={val => setAttributes({ priceTypo: val })} defaults={{ fontSize: { desktop: 24, tablet: 22, mobile: 20 }, fontStyle: 'italic' }} produce={produce} />
			</PanelBody>


			<PanelBody className='bPlPanelBody' title={__('Separator Settings', 'b-blocks')} initialOpen={false}>
				<ToggleControl label={__('Show Separator', 'b-blocks')} checked={isSep} onChange={val => setAttributes({ isSep: val })} />
			</PanelBody>
		</InspectorControls>


		<BlockControls>
			<ToolbarGroup className='bPlToolbar'>
				<ToolbarButton label={__('Add New Product', 'b-blocks')} onClick={addProduct}><Dashicon icon='plus' /></ToolbarButton>
			</ToolbarGroup>

			<AlignmentToolbar value={textAlign} onChange={val => setAttributes({ textAlign: val })} />
		</BlockControls>
	</>;
};
export default Settings;