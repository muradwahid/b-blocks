import DocumentSource from './DocumentSource';
import ViewerControls from './ViewerControls';
import Flipbook from './Flipbook';
import Overlays from './Overlays';
import Toolbar from './Toolbar';
import Dimensions from './Dimensions';
import Lightbox from './Lightbox';
import Download from './Download';
import Access from './Access';
import Performance from './Performance';
import { isLocalUrl } from '../../../../utils/common';

const General = (props) => {
	const { document = {}, viewer = {} } = props.attributes;
	const { engine = 'default' } = viewer;
	const isPdf = /\.pdf$/i.test((document.url || '').split(/[?#]/)[0]);

	// Overlays need the Custom PDF viewer, which only opens PDFs from this site.
	const isLocal = isLocalUrl(document.url);

	return <>
		<DocumentSource {...props} isPdf={isPdf} />

		{/* Custom PDF opens only PDFs from this site; for others the Google viewer is used, which has none of these controls. */}
		{isPdf && ('flipbook' === engine || 'slider' === engine || ('custom' === engine && isLocal)) && <ViewerControls {...props} />}

		{isPdf && ('flipbook' === engine || 'slider' === engine) && <Flipbook {...props} />}

		{isPdf && isLocal && 'custom' === engine && <Overlays {...props} />}

		<Toolbar {...props} usesPdfJs={isPdf && isLocal && ('custom' === engine || 'default' === engine)} />

		<Dimensions {...props} />

		<Lightbox {...props} />

		<Download {...props} />

		<Access {...props} />

		<Performance {...props} />
	</>;
};
export default General;
