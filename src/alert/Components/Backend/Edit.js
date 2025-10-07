import { useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import { Tooltip } from '@wordpress/components';

import { tabController } from '../../../../../bpl-tools/utils/functions';

import Settings from './Settings/Settings';
import Style from '../Common/Style';
import { prefix } from '../../utils/data';

const Edit = props => {
	const { attributes, setAttributes, clientId, isSelected } = props;
	const { message, icon, isDismiss } = attributes;

	useEffect(() => tabController(), [isSelected]);

	return <>
		<Settings attributes={attributes} setAttributes={setAttributes} />

		<div {...useBlockProps()}>
			<Style attributes={attributes} id={`block-${clientId}`} />

			<div className={prefix}>
				<div className='alert'>
					{icon?.class && <i className={`alertIcon ${icon?.class}`}></i>}

					<RichText className='alertMessage' tagName='span' value={message} onChange={val => setAttributes({ message: val })} placeholder={__('Alert Message', 'b-blocks')} inlineToolbar />

					{isDismiss && <Tooltip text='Hide will only work in frontend' placement='top' position='top'>
						<i className='alertClose fa fa-times-circle'></i>
					</Tooltip>}
				</div>
			</div>
		</div>
	</>;
};
export default Edit;