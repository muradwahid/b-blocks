import SVG from 'react-inlinesvg';
import { placeholderImg } from '../../../utils/data';
import { Fragment } from 'react';


const Hotspot = ({ attributes }) => {
	const { hotspot, image, preset } = attributes;
	return <>
		<div
			// style={{
			// 	background: `url(${image.url || placeholderImg})`,
			// 	backgroundRepeat: 'no-repeat',
			// 	backgroundPosition: 'center',
			// 	backgroundSize: 'cover',
			// 	backgroundAttachment: 'local',
			// }}
			className='b-blocks-hotspot-image-wrapper'
		>
			<img
				src={image?.url || placeholderImg}
				alt={image?.alt || 'Hotspot Image'}
				className='b-blocks-hotspot-image'
			/>
			{hotspot.map((element, i) => <Fragment key={i}>
					{element.spotOption === 'text' && (
						<a
							{...(element.spotLink ? { href: element.spotLink } : {})}
							target={`${element.newWindow ? '_blank' : ''}`}
						>
							<div
								style={{
									position: 'absolute',
									// left: `${element.position.x}%`,
									// top: `${element.position.y}%`,
									cursor: 'pointer',
								}}
								className='b-blocks-bphb-hotspot-container'
								id={`b-blocks-bphb-hotspot-container-${i}`}
							>
								<div
									className={`b-blocks-bphb-hotspot ${preset === 'default'
										? 'circle'
										: preset === 'themetwo'
											? 'two'
											: preset === 'themethree'
												? 'three'
												: preset === 'themefour'
													? 'fourth'
													: 'fifth'
										}`}
								>
									{element.tooltip && (
										<div
											className={`b-blocks-tooltip-reader ${preset === 'default'
												? 'one'
												: preset === 'themetwo'
													? 'two'
													: preset === 'themethree'
														? 'three'
														: preset === 'themefour'
															? 'fourth'
															: 'fifth'
												} b-blocks-tooltip-${element.tooltipPosition}`}
										>
											<div
												className='b-blocks-bphb-tooltip-content'
												dangerouslySetInnerHTML={{ __html: element.tooltip }}
											></div>
										</div>
									)}
									<span
										className='b-blocks-imghp-text-icon'
										dangerouslySetInnerHTML={{ __html: element.spotText }}
									></span>
								</div>
							</div>
						</a>
					)}
					{element.spotOption === 'icon' && (
						<a
							{...(element.spotLink ? { href: element.spotLink } : {})}
							target={`${element.newWindow ? '_blank' : ''}`}
						>
							<div
								style={{
									position: 'absolute',
									// left: `${element.position.x}%`,
									// top: `${element.position.y}%`,
									cursor: 'pointer',
								}}
								className='b-blocks-bphb-hotspot-container'
								id={`b-blocks-bphb-hotspot-container-${i}`}
							>
								<div
									className={`b-blocks-bphb-hotspot ${preset === 'default'
										? 'circle'
										: preset === 'themetwo'
											? 'two'
											: preset === 'themethree'
												? 'three'
												: preset === 'themefour'
													? 'fourth'
													: 'fifth'
										}`}
								>
									{element.tooltip && (
										<div
											className={`b-blocks-tooltip-reader ${preset === 'default'
												? 'one'
												: preset === 'themetwo'
													? 'two'
													: preset === 'themethree'
														? 'three'
														: preset === 'themefour'
															? 'fourth'
															: 'fifth'
												} b-blocks-tooltip-${element.tooltipPosition}`}
										>
											<div
												className='bphb-tooltip-content'
												dangerouslySetInnerHTML={{ __html: element.tooltip }}
											></div>
										</div>
									)}
									{element.icon.type === 'upload' && (
										element.icon.type === 'upload' && <span className='b-blocks-imghp-upload-icon' dangerouslySetInnerHTML={{ __html: element.icon.url.upload }}></span>
									)}
									{element.icon.type === 'library' && (
										<span
											className='b-blocks-imghp-library-icon'
											dangerouslySetInnerHTML={{
												__html: element.icon.url.library,
											}}
										></span>
									)}
									<SVG src={element.icon} height='auto' />
								</div>
							</div>
						</a>
					)}
					{element.spotOption === 'image' && (
						<a
							{...(element.spotLink ? { href: element.spotLink } : {})}
							target={`${element.newWindow ? '_blank' : ''}`}
						>
							<div
								style={{
									position: 'absolute',
									// left: `${element.position.x}%`,
									// top: `${element.position.y}%`,
									cursor: 'pointer',
								}}
								className='b-blocks-bphb-hotspot-container'
								id={`b-blocks-bphb-hotspot-container-${i}`}
							>
								<div
									className={`b-blocks-bphb-hotspot ${preset === 'default'
										? 'circle'
										: preset === 'themetwo'
											? 'two'
											: preset === 'themethree'
												? 'three'
												: preset === 'themefour'
													? 'fourth'
													: 'fifth'
										}`}
								>
									{element.tooltip && (
										<div
											className={`b-blocks-tooltip-reader ${preset === 'default'
												? 'one'
												: preset === 'themetwo'
													? 'two'
													: preset === 'themethree'
														? 'three'
														: preset === 'themefour'
															? 'fourth'
															: 'fifth'
												} b-blocks-tooltip-${element.tooltipPosition}`}
										>
											<div
												className='b-blocks-bphb-tooltip-content'
												dangerouslySetInnerHTML={{ __html: element.tooltip }}
											></div>
										</div>
									)}
									{element.image && (
										<img
											src={element.image}
											style={{
												width: '100%',
												height: '100%',
												borderRadius: 'inherit',
												objectFit: 'pointer',
											}}
											alt=''
										/>
									)}
								</div>
							</div>
						</a>
					)}
				</Fragment> )}
		</div>
	</>
};
export default Hotspot;
