import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

import Settings from './Settings/Settings';
import Style from '../Common/Style';
import { prefix } from '../../utils/data';

const Edit = props => {
	const { attributes, setAttributes, clientId } = props;
	const { layout, columns } = attributes;

	const id = `${prefix}-${clientId}`;

	return <>
		<Settings attributes={attributes} setAttributes={setAttributes} clientId={clientId} />

		<div {...useBlockProps()} id={id}>
			<Style attributes={attributes} id={id} isBackend={true} />

			<div className={`${prefix} ${layout} columns-${columns.desktop} columns-tablet-${columns.tablet} columns-mobile-${columns.mobile}`}>
				<InnerBlocks allowedBlocks={['b-blocks/service']} template={[['b-blocks/service'], ['b-blocks/service'], ['b-blocks/service']]} />
			</div>
		</div>
	</>;
};
export default Edit;