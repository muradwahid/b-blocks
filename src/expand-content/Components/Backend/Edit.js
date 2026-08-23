import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

import Settings from './Settings/Settings';
import { updateAttributes } from '../../../../../bpl-tools/utils/functions';
import Style from '../Common/Style';

const TEMPLATE = [
	['core/heading', { level: 3, placeholder: __('Section heading...', 'b-blocks') }],
	['core/paragraph', { placeholder: __('Add the content that should always be visible here, then keep writing — anything past the preview height will be hidden behind a Show More button on the frontend.', 'b-blocks') }]
];

const Edit = ({ attributes, setAttributes, clientId }) => {
	const { buttons } = attributes;

	const [editorExpanded, setEditorExpanded] = useState(false);

	const id = `block-${clientId}`;

	const updateObj = updateAttributes(attributes, setAttributes);

	return <>
		<Settings attributes={attributes} setAttributes={setAttributes} updateObj={updateObj} />

		<div {...useBlockProps()}>
			{/* <style dangerouslySetInnerHTML={{ __html: css }} /> */}
			<Style attributes={attributes} id={id} isBackend={true} />
			<div>

				<div className='b-blocks-expand-content-wrapper'>
					<div className={`b-blocks-expand-content-innerBlocks ${editorExpanded ? '' : 'is-clamped'}`}>
						<InnerBlocks template={TEMPLATE} templateLock={false} />
					</div>

					<div className='b-blocks-expand-content-toggle-button-container'>

						<button type='button' className={`b-blocks-expand-content-toggle-button ${editorExpanded ? 'is-showLess' : 'is-showMore'}`} aria-disabled='true' tabIndex={-1} onClick={() => setEditorExpanded((v) => !v)}>
							{editorExpanded ? buttons.showLess : buttons.showMore}
						</button>

					</div>

				</div>

			</div>
		</div>
	</>;
};

export default Edit;