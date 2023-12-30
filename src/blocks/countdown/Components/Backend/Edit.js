import { useEffect } from 'react';
import { __ } from '@wordpress/i18n';
import { InnerBlocks, RichText } from '@wordpress/block-editor';
import { Tooltip } from '@wordpress/components';

import { tabController } from '../../../../../../Components/utils/functions';

import Settings from './Settings/Settings';
import Style from '../Common/Style';
import Countdown from '../Common/Countdown';
import { closeIcon } from '../../utils/icons';
import usePremiumInEditor from '../../../../hooks/usePremiumInEditor';

const Edit = props => {
	const { className, attributes, setAttributes, clientId, isSelected } = props;
	const { destDate } = attributes;

	useEffect(() => { clientId && setAttributes({ cId: clientId.substring(0, 10) }); }, [clientId]); // Set & Update clientId to cId

	useEffect(() => tabController(), [isSelected]);

	const { isPremium = false } = usePremiumInEditor();

	useEffect(() => {
		'' === destDate && setAttributes({
			destDate: new Date(new Date().setDate(new Date().getDate() + 2))
		});
	}, [destDate]); // Set Initial Date

	return <>
		<Settings attributes={attributes} setAttributes={setAttributes} isPremium={isPremium} />

		<div className={className} id={`bBlocksCountdown-${clientId}`}>
			<Style attributes={attributes} clientId={clientId} />

			<Countdown attributes={attributes} Box={Box} closeEl={<Tooltip text='Hide will only work in frontend' placement='top' position='top'>{closeIcon}</Tooltip>}>
				<div className='countdownExpired'>
					<InnerBlocks template={[
						['core/heading', {
							content: 'Oops! the offers just expired!',
							textAlign: 'center',
							level: 3,
							style: {
								color: { text: '#dc3545' }
							}
						}],

						['core/paragraph', {
							content: `But don't worry! we will announce next offer as soon as possible. Stay with us.`,
							style: {
								color: { text: '#222' }
							}
						}]
					]} />
				</div>
			</Countdown>
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