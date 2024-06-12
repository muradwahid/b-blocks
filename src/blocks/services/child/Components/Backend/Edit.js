import { useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import { RichText } from '@wordpress/block-editor';

import Settings from './Settings/Settings';
import Style from '../Common/Style';
import Service from '../Common/Service';

const Edit = props => {
	const { className, attributes, setAttributes, clientId } = props;
	const { isTitle, title, isDesc, desc } = attributes;

	useEffect(() => { clientId && setAttributes({ cId: clientId.substring(0, 10) }); }, [clientId]); // Set & Update clientId to cId

	return <>
		<Settings attributes={props.attributes} setAttributes={setAttributes} />

		<div className={className} id={`bBlocksService-${clientId}`}>
			<Style attributes={attributes} clientId={clientId} />

			<Service attributes={attributes} isBackend={true} custom={{ setAttributes }}>
				{isTitle && <RichText className='title' tagName='h3' value={title} onChange={val => setAttributes({ title: val })} placeholder={__('Service Title', 'b-blocks')} inlineToolbar />}

				{isDesc && <RichText className='description' tagName='p' value={desc} onChange={val => setAttributes({ desc: val })} placeholder={__('Service Description', 'b-blocks')} inlineToolbar />}
			</Service>
		</div>
	</>;
};
export default Edit;