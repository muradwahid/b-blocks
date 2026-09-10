import { __ } from '@wordpress/i18n';
import { PanelBody } from '@wordpress/components';

import { Background, ColorControl, Typography } from '../../../../../../../bpl-tools/Components';

const Header = ({ attributes, updateObj }) => {
	const { headerStyle = {}, options = {} } = attributes;

	if (!options.header) return null;

	return <PanelBody className='bPlPanelBody' title={__('Header', 'b-blocks')} initialOpen={false}>
		<Background label={__('Background', 'b-blocks')} value={headerStyle.background} onChange={(val) => updateObj('headerStyle', val, 'background')} />

		<ColorControl className='mt10' label={__('Filename Color', 'b-blocks')} value={headerStyle.filenameColor} onChange={(val) => updateObj('headerStyle', val, 'filenameColor')} />

		<Typography className='mt10' label={__('Filename Typography', 'b-blocks')} value={headerStyle.filenameTypo} onChange={(val) => updateObj('headerStyle', val, 'filenameTypo')} defaults={{ fontSize: { desktop: 12 } }} />

		{options.showLanguage && <>
			<ColorControl className='mt10' label={__('Badge Color', 'b-blocks')} value={headerStyle.badgeColor} onChange={(val) => updateObj('headerStyle', val, 'badgeColor')} />

			<Background className='mt10' label={__('Badge Background', 'b-blocks')} value={headerStyle.badgeBackground} onChange={(val) => updateObj('headerStyle', val, 'badgeBackground')} />
		</>}
	</PanelBody>;
};

export default Header;
