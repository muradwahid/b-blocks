import { useEffect, useRef } from 'react';

import Box from './Box';
import useCountdown from './utils/useCountdown';
import { getTwoFixed } from './utils/functions';

const Countdown = ({ attributes, isBackend = false, wp }) => {
	const { destDate, boxIsInline, isLabels, isDays, daysLabel, isHours, hoursLabel, isMinutes, minutesLabel, isSeconds, secondsLabel, isSep } = attributes;

	const destTime = new Date(destDate).getTime();
	const { days, hours, minutes, seconds } = useCountdown(destTime, isDays, isHours, isMinutes);

	const daysRef = useRef(null);
	const hoursRef = useRef(null);
	const minutesRef = useRef(null);
	const secondsRef = useRef(null);
	useEffect(() => {
		daysRef.current ? daysRef.current.innerHTML = getTwoFixed(days) : null;
		hoursRef.current ? hoursRef.current.innerHTML = getTwoFixed(hours) : null;
		minutesRef.current ? minutesRef.current.innerHTML = getTwoFixed(minutes) : null;
		secondsRef.current ? secondsRef.current.innerHTML = getTwoFixed(seconds) : null;
	}, [seconds, daysRef.current, hoursRef.current, minutesRef.current, secondsRef.current]);

	// Classes
	const boxClass = `${boxIsInline ? 'inline' : ''}`;

	return <div className='countdownItems'>
		<Box
			ref={daysRef}
			is={isDays}
			boxClass={`countdownDays ${boxClass}`}
			isLabels={isLabels} label={daysLabel}
			isBackend={isBackend}
			onChange={val => isBackend && wp.setAttributes({ daysLabel: val })}
		/>
		{isSep && isDays && (isHours || isMinutes || isSeconds) && <span className='separator'></span>}

		<Box
			ref={hoursRef}
			is={isHours}
			boxClass={`countdownHours ${boxClass}`}
			isLabels={isLabels}
			label={hoursLabel}
			isBackend={isBackend}
			onChange={val => isBackend && wp.setAttributes({ hoursLabel: val })}
		/>
		{isSep && isHours && (isMinutes || isSeconds) && <span className='separator'></span>}

		<Box
			ref={minutesRef}
			is={isMinutes}
			boxClass={`countdownMinutes ${boxClass}`}
			isLabels={isLabels}
			label={minutesLabel}
			isBackend={isBackend}
			onChange={val => isBackend && wp.setAttributes({ minutesLabel: val })}
		/>
		{isSep && isMinutes && isSeconds && <span className='separator'></span>}

		<Box
			ref={secondsRef}
			is={isSeconds}
			boxClass={`countdownSeconds ${boxClass}`}
			isLabels={isLabels}
			label={secondsLabel}
			isBackend={isBackend}
			onChange={val => isBackend && wp.setAttributes({ secondsLabel: val })}
		/>
	</div>
}
export default Countdown;