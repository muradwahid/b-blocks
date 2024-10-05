import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';

import Settings from './Settings/Settings';
import Style from '../Common/Style';
import Service from '../Common/Service';
import { childPrefix } from '../../../services/utils/data';

const Edit = props => {
	const { attributes, setAttributes, clientId } = props;
	const { isTitle, title, isDesc, desc } = attributes;

	const id = `${childPrefix}-${clientId}`;

	return <>
		<Settings attributes={props.attributes} setAttributes={setAttributes} />

		<div {...useBlockProps} id={id}>
			<Style attributes={attributes} id={id} />

			<Service attributes={attributes} isBackend={true} custom={{ setAttributes }}>
				{isTitle && <RichText className='title' tagName='h3' value={title} onChange={val => setAttributes({ title: val })} placeholder={__('Service Title', 'b-blocks')} inlineToolbar />}

				{isDesc && <RichText className='description' tagName='p' value={desc} onChange={val => setAttributes({ desc: val })} placeholder={__('Service Description', 'b-blocks')} inlineToolbar />}
			</Service>
		</div>
	</>;
};
export default Edit;