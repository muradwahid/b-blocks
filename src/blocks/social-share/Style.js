const Style = ({ attributes, clientId }) => {
	const { socials, alignment, background, size, padding, margin, border, shadow } = attributes;

	return <>
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
			`.replace(/\s+/g, ' ')
		}} />

		<style>
			{socials?.map((item, index) => `
				#bBlocksSocialShare-${clientId} ul.bBlocksSocialShare li.icon-${index} i{
					${item?.icon?.styles || `color: ${item?.icon?.color || '#4527a4'};`}
				}`.replace(/\s+/g, ' ')
			)}
		</style>
	</>
}
export default Style;