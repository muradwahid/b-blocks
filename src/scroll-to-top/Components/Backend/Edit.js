import { useBlockProps } from '@wordpress/block-editor';

import Settings from './Settings/Settings';
import Style from '../Common/Style';
import { updateAttributes } from '../../../../../bpl-tools/utils/functions';
import ScrollToTop from '../Common/ScrollToTop';
import { useRef } from 'react';

const Edit = props => {
	const { attributes, setAttributes, clientId } = props;

	const updateObj = updateAttributes(attributes, setAttributes);

	const iframeRef = useRef(null);

	const doc = iframeRef.current?.ownerDocument;
	const win = doc?.defaultView;

	return <>
		<Settings {...{ attributes, setAttributes, updateObj }} />

		<div {...useBlockProps({ref: iframeRef})}>
			<Style attributes={attributes} id={`block-${clientId}`} />
			<div>
				<ScrollToTop attributes={attributes} doc={doc} win={win} isBackend={true} />
			</div>
		</div>
	</>;
}
export default Edit;