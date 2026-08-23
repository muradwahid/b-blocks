import { InspectorControls } from '@wordpress/block-editor';
import Style from './Style/Style';
import { PanelBody } from '@wordpress/components';
import { Button } from '../../../../../../bpl-tools/Components';
import { __ } from '@wordpress/i18n';
import { useDispatch } from '@wordpress/data';

const Settings = (props) => {

	const { parentClientId } = props;
	const { selectBlock } = useDispatch('core/block-editor');

	return <>
		<InspectorControls>

			<PanelBody initialOpen={true} >
				<Button
					onClick={() => selectBlock(parentClientId)}
				>
					{__('Open Parent Settings', 'b-blocks')}
				</Button>
			</PanelBody>

			<Style {...props} />

		</InspectorControls>
	</>;
};
export default Settings;