import { __ } from '@wordpress/i18n';
import { useState, useContext } from '@wordpress/element';
import { InspectorControls, AlignmentToolbar, BlockControls } from '@wordpress/block-editor';
import { PanelBody, PanelRow, RangeControl, ToggleControl, __experimentalUnitControl as UnitControl, Dashicon, ToolbarGroup, ToolbarButton, Button, ButtonGroup, Tooltip } from '@wordpress/components';
import produce from 'immer';

// Settings Components
import Title from '../../../../Components/Title';
import BColor from '../../../../Components/BColor';
import Background from '../../../../Components/Background';
import SeparatorControl from '../../../../Components/SeparatorControl';
import BorderControl from '../../../../Components/BorderControl';
import { ImageHolderControl, ChangeImageData } from '../../../../Components/ImageControl';
import BDevice from '../../../../Components/BDevice';
import Typography from '../../../../Components/Typography';
import SpaceControl from '../../../../Components/SpaceControl';
import { gearIcon } from '../../../../Components/Helper/icons';
import { pxUnit, perUnit, emUnit } from '../../../../Components/Helper/options';

import { IndexContext } from './edit';
import icons from '../../utils/icons';

const Settings = ({ settings }) => {
	const { attributes: { products = [], columns, columnGap, rowGap, layout, textAlign, padding, imgMargin, nameTypo, nameMargin, isDesc, descTypo, descMargin, priceTypo, isSep }, setAttributes } = settings;

	const setActiveIndex = useContext(IndexContext);
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

	const updateProduct = (index, type, val) => {
		const newProduct = [...products];
		newProduct[index][type] = val;
		setAttributes({ products: newProduct });
		setActiveIndex(index);
	}

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


			<PanelBody className='bPlPanelBody addRemoveItems' title={__('Add or Remove Product', 'b-blocks')}>
				{products.map((item, index) => {
					const { background, img, imgBorder, nameColor, descColor, priceColor, separator } = item;

					return <PanelBody key={index} className='bPlPanelBody editItem' title={__(`Product No ${index + 1}:`, 'b-blocks')} initialOpen={0 !== index ? false : true}>
						<Background label={__('Background:', 'b-blocks')} value={background} onChange={val => updateProduct(index, 'background', val)} />

						<ImageHolderControl className='mt20' label={__('Image:', 'b-blocks')} value={img} onChange={val => updateProduct(index, 'img', val)} />
						<ChangeImageData className='mt20' value={img} onChange={val => updateProduct(index, 'img', val)} />

						<BorderControl label={__('Image Border:', 'b-blocks')} value={imgBorder} onChange={val => updateProduct(index, 'imgBorder', val)} />

						<BColor label={__('Name Color:', 'b-blocks')} value={nameColor} onChange={val => updateProduct(index, 'nameColor', val)} defaultColor='#333' />

						<BColor label={__('Description Color:', 'b-blocks')} value={descColor} onChange={val => updateProduct(index, 'descColor', val)} defaultColor='#333' />

						<BColor label={__('Price Color:', 'b-blocks')} value={priceColor} onChange={val => updateProduct(index, 'priceColor', val)} defaultColor='#4527a4' />

						<SeparatorControl value={separator} onChange={val => updateProduct(index, 'separator', val)} defaults={{ width: '40%', height: '1px', color: '#bbb' }} />

						<PanelRow className='itemAction mt20'>
							<Button className='removeItem' label={__('Remove', 'b-blocks')} onClick={e => {
								e.preventDefault();
								setAttributes({ products: [...products.slice(0, index), ...products.slice(index + 1)] });
							}}><Dashicon icon='no' />{__('Remove', 'b-blocks')}</Button>

							<Button className='duplicateItem' label={__('Duplicate', 'b-blocks')} onClick={e => {
								e.preventDefault();
								setAttributes({ products: [...products, { ...products[index] }] });
							}}>{gearIcon}{__('Duplicate', 'b-blocks')}</Button>
						</PanelRow>
					</PanelBody>
				})}

				<div className='addItem'>
					<Button label={__('Add New Product', 'b-blocks')} onClick={addProduct}><Dashicon icon='plus' />{__('Add New Product', 'b-blocks')}</Button>
				</div>
			</PanelBody>


			<PanelBody className='bPlPanelBody' title={__('Layout Settings', 'b-blocks')} initialOpen={false}>
				<PanelRow>
					<Title className='mb5'>{__('Layout:', 'b-blocks')}</Title>
					<ButtonGroup className='bPlBtnGroup'>
						<Tooltip text={__('Vertical', 'b-blocks')} position='top'>
							<Button icon={icons.verticalLine} isMedium isPrimary={'vertical' === layout} aria-pressed={'vertical' === layout} onClick={() => {
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
							<Button icon={icons.horizontalLine} isMedium isPrimary={'horizontal' === layout} aria-pressed={'horizontal' === layout} onClick={() => {
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