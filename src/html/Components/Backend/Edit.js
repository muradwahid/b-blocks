import { useBlockProps } from '@wordpress/block-editor';
import { useMemo } from 'react';

import BsCodeSlash from '../../utils/icons';
import { canUnfilteredHtml, sanitizePreview } from '../../utils/functions';
import Style from '../Common/Style';
import Settings from './Settings/Settings';
import { useRunJs } from '../hooks/useRunJs';

const Edit = props => {
	const { attributes, setAttributes, clientId } = props;
	const { htmlCode } = attributes;

	// render.php never runs for the editor, so the capability check that
	// protects the frontend has to be repeated here. Without it, markup saved
	// by a Contributor executes in the session of whoever opens the post next.
	const trusted = canUnfilteredHtml();
	const preview = useMemo(() => (trusted ? htmlCode : sanitizePreview(htmlCode)), [htmlCode, trusted]);

	const htmlRef = useRunJs(preview, 1000, trusted);

	return <>
			<Settings {...{ attributes, setAttributes }} />

			<div {...useBlockProps()} id={`html-block-${clientId}`}>
				<Style attributes={attributes} id={`html-block-${clientId}`} isBackend={true} />
				{htmlCode ? (
					<div ref={htmlRef} dangerouslySetInnerHTML={{ __html: preview }}></div>
				) : (
					<div>
							<div><div className="html-placeholder">
								<BsCodeSlash />
							</div></div>
					</div>
				)}
			</div>
		</> 
}
export default Edit;
