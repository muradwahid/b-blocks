import { __ } from '@wordpress/i18n';
import { useBlockProps, AlignmentToolbar, BlockControls } from '@wordpress/block-editor';
import { withSelect } from '@wordpress/data';

import { updateAttributes } from '../../../../../bpl-tools/utils/functions';
import Style from '../Common/Style';
import StatCards from '../Frontend/StatCards';
import Settings from './Settings/Settings';

const ALIGN_VALUES = ['left', 'center', 'right'];

const Edit = (props) => {
	const { attributes, setAttributes, clientId, device } = props;
	const { layout = {} } = attributes;

	const isPremium = bBlocksPremiumChecker;
	const updateObj = updateAttributes(attributes, setAttributes);

	const safeAlign = ALIGN_VALUES.includes(layout.align) ? layout.align : 'center';

	return <>
		<BlockControls>
			<AlignmentToolbar
				value={safeAlign}
				onChange={(val) => updateObj('layout', val || 'center', 'align')}
				alignmentControls={[
					{ icon: 'editor-alignleft', title: __('Align left', 'b-blocks'), align: 'left' },
					{ icon: 'editor-aligncenter', title: __('Align center', 'b-blocks'), align: 'center' },
					{ icon: 'editor-alignright', title: __('Align right', 'b-blocks'), align: 'right' },
				]}
			/>
		</BlockControls>

		<Settings {...{ attributes, setAttributes, updateObj, isPremium, device }} />

		<div {...useBlockProps()}>
			<div>
				<Style attributes={attributes} id={`block-${clientId}`} isBackend={true} />

				<StatCards attributes={attributes} />
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
