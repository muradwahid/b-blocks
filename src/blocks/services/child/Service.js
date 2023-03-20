import icons from '../../../utils/icons';

const Service = ({ attributes, children }) => {
	const { isIcon, isUpIcon, icon, upIcon, isLink, link, linkIn } = attributes;

	return <div className='bBlocksService'>
		{'service' === linkIn && <a className='serviceLink' href={link}></a>}

		<div className='bgLayer'></div>

		{isIcon && <div className='icon'>
			{isUpIcon ? <img src={upIcon?.url} alt={upIcon?.alt} /> : icon?.class && <i className={icon?.class}></i>}
		</div>}

		{children}

		{isLink && 'button' === linkIn && <div className='link'><a href={link}>{icons.longArrowToRight}</a></div>}
	</div>
}
export default Service;