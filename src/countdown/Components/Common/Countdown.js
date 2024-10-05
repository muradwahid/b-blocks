import CountdownBoxes from './CountdownBoxes';
import useCountdown from '../../hook/useCountdown';
import { prefix } from '../../utils/data';

const Countdown = ({ attributes, Box, closeEl, children }) => {
	const { destDate, isResponsive, isExpired, prefixText, suffixButtonText, suffixButtonUrl, addID, addClass, isDismiss } = attributes;

	const destTime = new Date(destDate).getTime();
	const { expired } = useCountdown(destTime);

	return <div className={`${prefix} ${addClass}`} id={addID}>
		{isExpired && expired ? children : <>
			{prefixText && <p className='prefixText' dangerouslySetInnerHTML={{ __html: prefixText }} />}

			<div className={`countdownItems ${isResponsive ? `${prefix}Responsive` : ''}`}>
				<CountdownBoxes attributes={attributes} Box={Box} />
			</div>

			{suffixButtonText && <a className='suffixButton' href={suffixButtonUrl}>{suffixButtonText}</a>}
		</>}

		{isDismiss && closeEl}
	</div>
}
export default Countdown;