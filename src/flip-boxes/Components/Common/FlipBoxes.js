import { prefix } from '../../utils/data';

const FlipBoxes = ({ attributes, isBackend = false, custom }) => {
	const { boxes, columns, isIcon, isDesc, isBtn, isLinkNewTab } = attributes;

	return <div className={`${prefix} columns-${columns.desktop} columns-tablet-${columns.tablet} columns-mobile-${columns.mobile}`}>
		{boxes.map((item, index) => {
			const { isFrontUpIcon = false, frontIcon = {}, upFrontIcon = {}, isBackUpIcon = false, backIcon = {}, upBackIcon = {}, frontTitle, backTitle, desc, btn, btnLink } = item;

			return <div key={index} onClick={() => isBackend && custom.setActiveIndex(index)} className={`flipBox ${isBackend && index === custom.activeIndex ? 'bPlNowEditing' : ''}`} id={`flipBox-${index}`}>
				<div className='box front'>
					<div className='frontContent'>
						{isIcon && <>
							{isFrontUpIcon ? <img className={upFrontIcon?.id ? `flipIcon frontIcon` : null} src={upFrontIcon?.url} alt={upFrontIcon?.alt} /> : frontIcon?.class && <i className={`flipIcon frontIcon ${frontIcon?.class}`} />}
						</>}

						{frontTitle && <h3 className='flipTitle flipFrontTitle'>{frontTitle}</h3>}

						{isDesc && desc && <p className='flipDescription'>{desc}</p>}
					</div>
				</div>

				<div className='box back'>
					<div className='backContent'>
						{isIcon && <>
							{isBackUpIcon ? <img className={upBackIcon?.id ? `flipIcon backIcon` : null} src={upBackIcon?.url} alt={upBackIcon?.alt} /> : backIcon?.class && <i className={`flipIcon backIcon ${backIcon?.class}`} />}
						</>}

						{backTitle && <h3 className='flipTitle flipBackTitle'>{backTitle}</h3>}

						{isBtn && btn && <a href={btnLink} className='flipBtn' target={isLinkNewTab ? '_blank' : '_self'} rel='noreferrer noopener'>{btn}</a>}
					</div>
				</div>
			</div>;
		})}
	</div>
}
export default FlipBoxes;