import { useState, useEffect, createContext } from '@wordpress/element';

import Settings from './settings';

export const IndexContext = createContext();

const Edit = props => {
	const { className, attributes: { socials, alignment, background, size, padding, margin, border, shadow }, setAttributes, clientId } = props;

	useEffect(() => { clientId && setAttributes({ cId: clientId.substring(0, 10) }); }, [clientId]); // Set & Update clientId to cId

	const [activeIndex, setActiveIndex] = useState(0);

	return <>
		<IndexContext.Provider value={setActiveIndex}>
			<Settings attributes={props.attributes} setAttributes={setAttributes} />
		</IndexContext.Provider>

		<div className={className} id={`bBlocksSocialShare-${clientId}`}>
			<style dangerouslySetInnerHTML={{
				__html: `
				#bBlocksSocialShare-${clientId}{
					text-align: ${alignment};
				}
				#bBlocksSocialShare-${clientId} ul.bBlocksSocialShare li.icon{
					${background?.styles || 'background-color: #0000;'}
					width: calc( ${size} + ${padding} + ${padding} );
					height: calc( ${size} + ${padding} + ${padding} );
					margin: 0 calc( ${margin} / 2 );
					${border?.styles || 'border-radius: 50%;'}
					box-shadow: ${shadow?.styles || 'none'};
				}
				#bBlocksSocialShare-${clientId} ul.bBlocksSocialShare li.icon i{
					font-size: ${size};
				}
				#bBlocksSocialShare-${clientId} ul.bBlocksSocialShare li.icon img{
					width: ${size};
				}
			`}} />
			<style>
				{socials?.map((item, index) => `#bBlocksSocialShare-${clientId} ul.bBlocksSocialShare li.icon-${index} i{
					${item?.icon?.styles || `color: ${item?.icon?.color || '#4527a4'};`}
				}`)}
			</style>

			<ul className='bBlocksSocialShare'>
				{socials?.map((item, index) => {
					const { network, isUpIcon, icon, upIcon } = item;

					return <li key={index} onClick={() => setActiveIndex(index)} className={`icon icon-${index} ${index === activeIndex ? 'bBlocksNowEditing' : ''}`} data-social={network}>
						{isUpIcon ? <img className={upIcon?.id ? `wp-image-${upIcon?.id}` : null} src={upIcon?.url} alt={upIcon?.alt} /> : icon?.class && <i className={icon?.class}></i>}
					</li>;
				})}
			</ul>
		</div>
	</>;
};
export default Edit;