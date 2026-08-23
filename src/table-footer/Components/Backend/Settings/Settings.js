import { InspectorControls} from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { useDispatch } from '@wordpress/data';
import { Button } from '../../../../../../bpl-tools/Components';
import { __ } from '@wordpress/i18n';

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
		</InspectorControls>
	</>;
};
export default Settings;