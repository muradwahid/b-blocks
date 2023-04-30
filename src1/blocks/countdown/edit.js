import { useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import { RichText } from '@wordpress/block-editor';

// Settings Components
import { tabController } from '../../../../Components/utils/functions';

import Settings from './Settings';
import Style from './Style';
import Countdown from './Countdown';

const Edit = props => {
	const { className, attributes, setAttributes, clientId, isSelected } = props;
	const { destDate } = attributes;

	useEffect(() => { clientId && setAttributes({ cId: clientId.substring(0, 10) }); }, [clientId]); // Set & Update clientId to cId

	useEffect(() => tabController(), [isSelected]);

	useEffect(() => {
		'' === destDate && setAttributes({
			destDate: new Date(new Date().setDate(new Date().getDate() + 2))
		});
	}, [destDate]); // Set Initial Date

	return <>
		<Settings attributes={attributes} setAttributes={setAttributes} />

		<div className={className} id={`bBlocksCountdown-${clientId}`}>
			<Style attributes={attributes} clientId={clientId} />

			<Countdown attributes={attributes} Box={Box} isBackend={true} custom={{ setAttributes }} />
		</div>
	</>;
};
export default Edit;

const Box = (props) => {
	const { is, boxClass, digit, isLabels, label, onChange } = props;

	return is && <div className={`countdownItem ${boxClass}`}>
		<span className='digit'>{digit}</span>
		{isLabels && <RichText className='label' tagName='span' value={label} onChange={val => onChange(val)} placeholder={__('Label', 'countdown-time')} />}
	</div>;
};