import { longArrowToRightIcon } from '../../../services/utils/icons';
import { childPrefix } from '../../../services/utils/data';
import { sanitizeURL } from '../../../utils/functions';

const Service = ({ attributes, children }) => {
	const { title, isIcon, isUpIcon, icon, upIcon, isLink, link, linkIn } = attributes;

	return <div className={childPrefix}>
		{'service' === linkIn && <a className='serviceLink' href={sanitizeURL(link)}></a>}

		<div className='bgLayer'></div>

		{isIcon && <div className='icon'>
			{isUpIcon ? <img src={upIcon?.url} alt={upIcon?.alt} /> : icon?.class && <i className={icon?.class}></i>}
		</div>}

		{children}

		{isLink && 'button' === linkIn && <div className='link'>
			{link ? <a href={sanitizeURL(link)}>{longArrowToRightIcon(title)}</a> : <a>{longArrowToRightIcon(title)}</a>}
		</div>}
	</div>
}
export default Service;