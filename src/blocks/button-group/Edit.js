import { useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import { RichText } from '@wordpress/block-editor';

import Settings from './Settings';
import Style from './Style';

const Edit = props => {
	const { className, attributes, setAttributes, clientId } = props;
	const { btnType, btnOne, btnOneLink, btnTwo, btnTwoLink, isSep, sepType, sepText, sepIcon } = attributes;

	useEffect(() => { clientId && setAttributes({ cId: clientId.substring(0, 10) }); }, [clientId]); // Set & Update clientId to cId

	return <>
		<Settings attributes={attributes} setAttributes={setAttributes} />

		<div className={className} id={`bBlocksButtonGroup-${clientId}`}>
			<Style attributes={attributes} clientId={clientId} />

			<div className='bBlocksButtonGroup'>
				<div className='bBlocksBtn firstBtn'>
					<RichText className={`btnOne btn-${btnType}`} tagName='a' href={btnOneLink} value={btnOne} onChange={val => setAttributes({ btnOne: val })} placeholder={__('First Button', 'b-blocks')} inlineToolbar />

					{isSep && <div className='btnSeparator'>
						{'text' === sepType ? <span>{sepText}</span> : 'icon' === sepType && sepIcon?.class ? <i className={sepIcon?.class}></i> : ''}
					</div>}
				</div>

				<div className='bBlocksBtn secondBtn'>
					<RichText className={`btnTwo btn-${btnType}`} tagName='a' href={btnTwoLink} value={btnTwo} onChange={val => setAttributes({ btnTwo: val })} placeholder={__('Second Button', 'b-blocks')} inlineToolbar />
				</div>
			</div>
		</div>
	</>;
};
export default Edit;