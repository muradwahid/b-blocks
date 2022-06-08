import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { select, dispatch } from '@wordpress/data';
import { AlignmentToolbar, BlockControls, InspectorControls } from '@wordpress/block-editor';
import { Dashicon, PanelBody, PanelRow, RangeControl, SelectControl, ToggleControl, __experimentalUnitControl as UnitControl } from '@wordpress/components';

// Settings Components
import Title from '../../../../Components/Title';
import Background from '../../../../Components/Background';
import Typography from '../../../../Components/Typography';
import BDevice from '../../../../Components/BDevice';
import SpaceControl from '../../../../Components/SpaceControl';
import BorderControl from '../../../../Components/BorderControl';
import ShadowControl from '../../../../Components/ShadowControl';

import options from '../../Const/options';
import servicePattern from '../../img/service-pattern.png';
const { pxUnit, perUnit, emUnit } = options;
const layouts = [
	{ label: __('Default', 'services-section'), value: 'default' },
	{ label: __('Layout 1', 'services-section'), value: 'layout1' }
];
const linkPosition = [
	{ label: __('Service Element', 'services-section'), value: 'service' },
	{ label: __('Title', 'services-section'), value: 'title' },
	{ label: __('Button', 'services-section'), value: 'button' },
];

const Settings = ({ attributes, setAttributes, clientId }) => {
	const { background, padding, border } = attributes;

	const [device, setDevice] = useState('desktop');

	// Play with child data
	const innerBlocks = select('core/block-editor').getBlocksByClientId(clientId)[0]?.innerBlocks;
	const childAttributes = innerBlocks && innerBlocks[0]?.attributes;
	const [isIcon, setIsIcon] = useState(childAttributes?.isIcon);
	const [isTitle, setIsTitle] = useState(childAttributes?.isTitle);
	const [isDesc, setIsDesc] = useState(childAttributes?.isDesc);
	const [linkIn, setLinkIn] = useState(childAttributes?.linkIn);

	const setChildAttributes = args => innerBlocks.forEach(block => {
		dispatch('core/block-editor').updateBlockAttributes(block.clientId, args);
	});

	return <>
		<InspectorControls>
			<PanelBody className='bPlPanelBody help' title={__('Help', 'b-blocks')}>
				<div className='helpItem'>
					<a href='https://bblockswp.com/docs/services-section-block/' target='_blank' rel='noreferrer'><Dashicon icon='book' size={23} />{__('Read Documentation', 'b-blocks')}</a>
				</div>

				<div className='helpItem rateUs'>
					<a href='https://wordpress.org/support/plugin/b-blocks/reviews/#new-post' target='_blank' rel='noreferrer'>
						<span><Dashicon icon='star-filled' size={23} />{__('Would you please rate us?', 'b-blocks')}</span>
						<span>{__('We are new and we need your help to grow!🙏', 'b-blocks')}</span>
					</a>
				</div>
			</PanelBody>


			<PanelBody className='bPlPanelBody' title={__('Row Style', 'b-blocks')}>
				<Title />
				<Background label={__('Background:', 'b-blocks')} background={background} onChange={val => setAttributes({ background: val })} defaults={{ color: '#0000' }} />

				<SpaceControl className='mt20' label={__('Padding:', 'b-blocks')} space={padding} onChange={val => setAttributes({ padding: val })} defaults={{ vertical: '15px', horizontal: '20px' }} />

				<BorderControl label={__('Border', 'b-blocks')} border={border} onChange={val => setAttributes({ border: val })} />
			</PanelBody>
		</InspectorControls>


		<BlockControls>
			{/* <AlignmentToolbar value={textAlign} onChange={val => setAttributes({ textAlign: val })} /> */}
		</BlockControls>
	</>;
};
export default Settings;