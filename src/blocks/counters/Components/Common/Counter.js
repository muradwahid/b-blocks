const Counter = ({ attributes, counter, index, labelEl, isBackend = false, custom = {} }) => {
	const { isIcon, iconPosition } = attributes;
	const { icon, number } = counter;
	const { start, end, prefix, suffix } = number;

	const iconEl = icon?.class && <i className={icon.class}></i>;

	return <div onClick={() => isBackend ? custom.setActiveIndex(index) : null} className={`${isBackend && index === custom.activeIndex ? 'bBlocksNowEditing' : ''}`} id={`bBlocksCounter-${index}`}>
		<div className='bBlocksCounter'>
			{isIcon && 'top' === iconPosition && <div className='counterIcon'>{iconEl}</div>}

			<div className='counterNumber'>
				<span className='prefix'>{prefix}</span>
				<span className='number' data-count-start={start} data-count-end={end}>{start}</span>
				<span className='suffix'>{suffix}</span>
			</div>

			{'label' === iconPosition ? <div className='counterIconLabel'>{iconEl}{labelEl}</div> : labelEl}
		</div>
	</div>
}
export default Counter;