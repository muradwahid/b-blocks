import { __ } from '@wordpress/i18n';
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { withSelect } from '@wordpress/data';

import { updateAttributes } from '../../../../../bpl-tools/utils/functions';
import Style from '../Common/Style';
import Settings from './Settings/Settings';
import { sanitizeHtml } from '../../../utils/sanitizeHtml';

const Edit = (props) => {
	const { attributes, setAttributes, clientId, innerBlocks } = props;
	const { trigger = {}, drawer = {}, options = {} } = attributes;

	const isPremium = typeof bBlocksPremiumChecker !== 'undefined' ? bBlocksPremiumChecker : false;
	const updateObj = updateAttributes(attributes, setAttributes);
	const blockProps = useBlockProps({ id: `block-${clientId}` });

	return <>
		<Settings {...{ ...props, updateObj, isPremium }} />

		<div {...blockProps}>
			<Style attributes={attributes} id={`block-${clientId}`} isBackend={true} />

			<button type='button' className='b-blocks-off-canvas-trigger' aria-disabled='true' tabIndex={-1}>
				{trigger.showIcon !== false && trigger.icon && trigger.iconPosition !== 'right' && <span className='b-blocks-off-canvas-icon' aria-hidden='true' dangerouslySetInnerHTML={{ __html: sanitizeHtml( trigger.icon ) }} />}
				{trigger.label && <span className='b-blocks-off-canvas-trigger-label'>{trigger.label}</span>}
				{trigger.showIcon !== false && trigger.icon && trigger.iconPosition === 'right' && <span className='b-blocks-off-canvas-icon' aria-hidden='true' dangerouslySetInnerHTML={{ __html: sanitizeHtml( trigger.icon ) }} />}
			</button>

			<div className='b-blocks-off-canvas-editor-preview-wrap' data-side={drawer.side}>
				<div className='b-blocks-off-canvas-editor-preview-header'>
					<span className='b-blocks-off-canvas-editor-preview-label'>{__('Drawer content (editor preview)', 'b-blocks')}</span>
					<span className='b-blocks-off-canvas-editor-preview-hint'>{__('Hidden until the trigger is clicked on the frontend.', 'b-blocks')}</span>
				</div>
				<div className='b-blocks-off-canvas-editor-preview'>
					<button type='button' className='b-blocks-off-canvas-editor-close' aria-label={options.closeLabel} tabIndex={-1}>
						<span aria-hidden='true'>&times;</span>
					</button>
					<div className='b-blocks-off-canvas-editor-content bBlocksOffCanvasInnerBlocksContent'>
						<InnerBlocks renderAppender={() => !innerBlocks?.length ? <InnerBlocks.ButtonBlockAppender /> : <InnerBlocks.DefaultBlockAppender />} />
					</div>
				</div>
			</div>
		</div>
	</>;
};

export default withSelect((select, { clientId }) => {
	const { getDeviceType } = select('core/editor');
	const { getBlocks } = select('core/block-editor');

	return {
		device: getDeviceType()?.toLowerCase(),
		innerBlocks: getBlocks(clientId)
	};
})(Edit);