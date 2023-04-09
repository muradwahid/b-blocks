import { useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import { RichText } from '@wordpress/block-editor';
import { Tooltip } from '@wordpress/components';

import { tabController } from '../../../../Components/Helper/functions';

import Settings from './Settings';
import Style from './Style';

const Edit = props => {
	const { className, attributes, setAttributes, clientId, isSelected } = props;
	const { message, icon, isDismiss } = attributes;

	useEffect(() => { clientId && setAttributes({ cId: clientId.substring(0, 10) }); }, [clientId]); // Set & Update clientId to cId

	useEffect(() => tabController(), [isSelected]);

	return <>
		<Settings attributes={attributes} setAttributes={setAttributes} />

		<div className={className} id={`bBlocksAlert-${clientId}`}>
			<Style attributes={attributes} clientId={clientId} />

			<div className='bBlocksAlert'>
				<div className='alert'>
					{icon?.class && <i className={`alertIcon ${icon?.class}`}></i>}

					<RichText className='alertMessage' tagName='span' value={message} onChange={val => setAttributes({ message: val })} placeholder={__('Alert Message', 'b-blocks')} inlineToolbar />

					{isDismiss && <Tooltip text='Hide will only work in frontend' position='top center'>
						<i className='alertClose fa fa-times-circle'></i>
					</Tooltip>}
				</div>
			</div>
		</div>
	</>;
};
export default Edit;