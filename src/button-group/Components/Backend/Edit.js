import { useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';

import { tabController } from '../../../../../bpl-tools/utils/functions';
import { sanitizeURL } from '../../../../../bpl-tools/utils/common';

import Settings from './Settings/Settings';
import Style from '../Common/Style';
import { prefix } from '../../utils/data';

const Edit = props => {
	const { attributes, setAttributes, clientId, isSelected } = props;
	const { btnType, btnOne, btnOneLink, btnTwo, btnTwoLink, isSep, sepType, sepText, sepIcon } = attributes;

	useEffect(() => tabController(), [isSelected]);

	return <>
		<Settings attributes={attributes} setAttributes={setAttributes} />

		<div {...useBlockProps()}>
			<Style attributes={attributes} id={`block-${clientId}`} />

			<div className={prefix}>
				<div className='bBlocksBtn firstBtn'>
					<RichText className={`btnOne btn-${btnType}`} tagName='a' href={sanitizeURL(btnOneLink)} value={btnOne} onChange={val => setAttributes({ btnOne: val })} placeholder={__('First Button', 'b-blocks')} inlineToolbar />

					{isSep && <div className='btnSeparator'>
						{'text' === sepType ? <span>{sepText}</span> : 'icon' === sepType && sepIcon?.class ? <i className={sepIcon?.class}></i> : ''}
					</div>}
				</div>

				<div className='bBlocksBtn secondBtn'>
					<RichText className={`btnTwo btn-${btnType}`} tagName='a' href={sanitizeURL(btnTwoLink)} value={btnTwo} onChange={val => setAttributes({ btnTwo: val })} placeholder={__('Second Button', 'b-blocks')} inlineToolbar />
				</div>
			</div>
		</div>
	</>;
};
export default Edit;