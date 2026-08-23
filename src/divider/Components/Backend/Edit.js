import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText, AlignmentToolbar, BlockControls } from '@wordpress/block-editor';
import { withSelect } from '@wordpress/data';

import { updateAttributes } from '../../../../../bpl-tools/utils/functions';
import Style from '../Common/Style';
import Divider from '../Frontend/Divider';
import Settings from './Settings/Settings';

const ALIGN_VALUES = ['left', 'center', 'right'];

const Edit = (props) => {
	const { attributes, setAttributes, clientId, device } = props;
	const { type = 'line', layout = {}, text = {} } = attributes;

	const isPremium = bBlocksPremiumChecker;
	const updateObj = updateAttributes(attributes, setAttributes);

	const safeAlign = ALIGN_VALUES.includes(layout.alignment) ? layout.alignment : 'center';

	const textSlot = 'text' === type ? (
		<RichText
			tagName='span'
			className='b-blocks-divider-text'
			value={text.content || ''}
			onChange={(val) => updateObj('text', val, 'content')}
			placeholder={__('OR', 'b-blocks')}
			allowedFormats={[]}
		/>
	) : null;

	return <>
		<BlockControls>
			<AlignmentToolbar
				value={safeAlign}
				onChange={(val) => updateObj('layout', val || 'center', 'alignment')}
			/>
		</BlockControls>

		<Settings {...{ attributes, setAttributes, updateObj, isPremium, device }} />

		<div {...useBlockProps()}>
			<div>
				<Style attributes={attributes} id={`block-${clientId}`} isBackend={true} />

				<Divider attributes={attributes} textSlot={textSlot} />
			</div>
		</div>
	</>;
};

export default withSelect((select) => {
	const { getDeviceType } = select('core/editor');

	return {
		device: getDeviceType()?.toLowerCase(),
	};
})(Edit);
