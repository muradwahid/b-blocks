const FlipBoxes = ({ attributes, isBackend = false, custom }) => {
	const { boxes, columns, isIcon, isDesc, isBtn, isLinkNewTab } = attributes;

	return <div className={`bBlocksFlipBoxes columns-${columns.desktop} columns-tablet-${columns.tablet} columns-mobile-${columns.mobile}`}>
		{boxes.map((item, index) => {
			const { frontIcon, backIcon, frontTitle, backTitle, desc, btn, btnLink } = item;

			return <div key={index} onClick={() => isBackend && custom.setActiveIndex(index)} className={`bBlocksFlipBox ${isBackend && index === custom.activeIndex ? 'bBlocksNowEditing' : ''}`} id={`bBlocksFlipBox-${index}`}>
				<div className='box front'>
					<div className='frontContent'>
						{isIcon && frontIcon?.class && <i className={`flipIcon frontIcon ${frontIcon?.class}`}></i>}

						{frontTitle && <h3 className='flipTitle flipFrontTitle'>{frontTitle}</h3>}

						{isDesc && desc && <p className='flipDescription'>{desc}</p>}
					</div>
				</div>

				<div className='box back'>
					<div className='backContent'>
						{isIcon && backIcon?.class && <i className={`flipIcon backIcon ${backIcon?.class}`}></i>}

						{backTitle && <h3 className='flipTitle flipBackTitle'>{backTitle}</h3>}

						{isBtn && btn && <a href={btnLink} className='flipBtn' target={isLinkNewTab ? '_blank' : '_self'} rel='noreferrer noopener'>{btn}</a>}
					</div>
				</div>
			</div>;
		})}
	</div>
}
export default FlipBoxes;