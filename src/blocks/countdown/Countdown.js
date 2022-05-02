import { useState, useEffect, useRef } from '@wordpress/element';

import Box from './Box';

const Countdown = ({ attributes, isBackend = false, wp }) => {
	const { destDate, boxIsInline, isLabels, isDays, daysLabel, isHours, hoursLabel, isMinutes, minutesLabel, isSeconds, secondsLabel, isSep } = attributes;

	const [secondsCount, setSecondsCount] = useState(0);
	useEffect(() => {
		const interval = setInterval(() => {
			setSecondsCount(seconds => seconds + 1);
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	const dest = new Date(destDate).getTime(); // Convert Destination Date in time (milliseconds)
	const daysRef = useRef(null);
	const hoursRef = useRef(null);
	const minutesRef = useRef(null);
	const secondsRef = useRef(null);
	useEffect(() => {
		const now = new Date().getTime(); // Convert Current Date in time (milliseconds)
		const diff = dest > now ? (dest - now) / 1000 : 0; // Different time in seconds

		const days = Math.floor(diff / (24 * 60 * 60));
		const hours = Math.floor((diff % (24 * 60 * 60)) / (60 * 60));
		const minutes = Math.floor((diff % (60 * 60)) / 60);
		const seconds = Math.floor(diff % 60);

		daysRef.current ? daysRef.current.innerHTML = (1 === days.toString().length ? ('0' + days).slice(-2) : days) : null;
		hoursRef.current ? hoursRef.current.innerHTML = ('0' + hours).slice(-2) : null;
		minutesRef.current ? minutesRef.current.innerHTML = ('0' + minutes).slice(-2) : null;
		secondsRef.current ? secondsRef.current.innerHTML = ('0' + seconds).slice(-2) : null;
	}, [dest, secondsCount, daysRef.current, hoursRef.current, minutesRef.current, secondsRef.current]);

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