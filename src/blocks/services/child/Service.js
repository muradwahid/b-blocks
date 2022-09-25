import { __ } from '@wordpress/i18n';
import { RichText } from '@wordpress/block-editor';

import icons from '../../../utils/icons';

const Service = ({ attributes, isBackend = false, custom }) => {
	const { isIcon, isUpIcon, icon, upIcon, isTitle, title, isDesc, desc, isLink, link, linkIn } = attributes;

	return <div className='bBlocksService'>
		{'service' === linkIn && <a className='serviceLink' href={link}></a>}

		<div className='bgLayer'></div>

		{isIcon && <div className='icon'>
			{isUpIcon ? <img src={upIcon?.url} alt={upIcon?.alt} /> : icon?.class && <i className={icon?.class}></i>}
		</div>}

		{isTitle && <>
			{isBackend ? <RichText className='title' tagName='h3' value={title} onChange={val => custom.setAttributes({ title: val })} placeholder={__('Service Title', 'b-blocks')} inlineToolbar /> : title && <>
				{'title' === linkIn ? <a href={link}><h3 className='title' dangerouslySetInnerHTML={{ __html: title }} /></a> : <h3 className='title' dangerouslySetInnerHTML={{ __html: title }} />}
			</>}
		</>}

		{isDesc && <>
			{isBackend ? <RichText className='description' tagName='p' value={desc} onChange={val => custom.setAttributes({ desc: val })} placeholder={__('Service Description', 'b-blocks')} inlineToolbar /> : desc && <p className='description' dangerouslySetInnerHTML={{ __html: desc }} />}
		</>}

		{isLink && 'button' === linkIn && <div className='link'><a href={link}>{icons.longArrowToRight}</a></div>}
	</div>
}
export default Service;