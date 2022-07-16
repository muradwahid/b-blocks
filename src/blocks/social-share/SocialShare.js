const SocialShare = ({ attributes, isBackend = false, custom }) => <ul className='bBlocksSocialShare'>
	{attributes.socials?.map((item, index) => {
		const { network, isUpIcon, icon, upIcon } = item;

		return <li
			key={index}
			onClick={() => isBackend && custom.setActiveIndex(index)}
			className={`icon icon-${index} ${isBackend && index === custom.activeIndex ? 'bBlocksNowEditing' : ''}`}
			data-social={network}>
			{isUpIcon ? <img className={upIcon?.id ? `wp-image-${upIcon?.id}` : null} src={upIcon?.url} alt={upIcon?.alt} /> : icon?.class && <i className={icon?.class}></i>}
		</li>;
	})}
</ul>;
export default SocialShare;