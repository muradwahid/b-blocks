import { longArrowToRightIcon } from '../../../services/utils/icons';
import { childPrefix } from '../../../services/utils/data';

const Service = ({ attributes, children }) => {
	const { isIcon, isUpIcon, icon, upIcon, isLink, link, linkIn } = attributes;

	return <div className={childPrefix}>
		{'service' === linkIn && <a className='serviceLink' href={link}></a>}

		<div className='bgLayer'></div>

		{isIcon && <div className='icon'>
			{isUpIcon ? <img src={upIcon?.url} alt={upIcon?.alt} /> : icon?.class && <i className={icon?.class}></i>}
		</div>}

		{children}

		{isLink && 'button' === linkIn && <div className='link'><a href={link}>{longArrowToRightIcon}</a></div>}
	</div>
}
export default Service;