import { __ } from '@wordpress/i18n';
import { PanelBody } from '@wordpress/components';

import { Background, ColorControl } from '../../../../../../../bpl-tools/Components';

const ConnectorsStyle = ({ attributes, updateObj }) => {
	const { connector } = attributes;
	const { line, arrow } = connector;

	return <PanelBody className='bPlPanelBody' initialOpen={true} title={__('Connectors', 'b-blocks')}>
		{line.show && <Background
			label={line.progress ? __('Track Color:', 'b-blocks') : __('Line Color:', 'b-blocks')}
			value={line.bg}
			onChange={(value) => updateObj('connector', value, 'line', 'bg')}
			isImage={false}
		/>}

		{line.show && line.progress && <Background
			label={__('Progress Color:', 'b-blocks')}
			value={line.activeBg}
			onChange={(value) => updateObj('connector', value, 'line', 'activeBg')}
			isImage={false}
		/>}

		{arrow.show && <ColorControl label={__('Arrow Color', 'b-blocks')} value={arrow.color} onChange={(value) => updateObj('connector', value, 'arrow', 'color')} />}

		{arrow.show && <p className='description'>
			{__('Leave the arrow color empty to keep it matching the card background.', 'b-blocks')}
		</p>}

	</PanelBody>;
};
export default ConnectorsStyle;
