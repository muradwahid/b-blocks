const Slider = ({ attributes }) => {
	const { slides = [], isPage, isPrevNext, isTitle, isDesc, isBtn } = attributes;

	return <div className='bBlocksSlider'>
		<div className='swiper-wrapper'>
			{slides.map((item, index) => {
				const { position, title, description, btnText } = item;

				return <div key={index} className={`slide slide-${index} swiper-slide`}>
					<div className={`sliderContent ${position?.split(' ')?.join('-')}`}>
						{isTitle && title && <h2 className='sliderTitle' dangerouslySetInnerHTML={{ __html: title }} />}
						{isDesc && description && <p className='sliderDescription' dangerouslySetInnerHTML={{ __html: description }} />}
						{isBtn && btnText && <a className='sliderBtn' dangerouslySetInnerHTML={{ __html: btnText }} />}
					</div>
				</div>;
			})}
		</div>

		{isPage && <div className='swiper-pagination'></div>}

		{isPrevNext && <><div className='swiper-button-prev'></div><div className='swiper-button-next'></div></>}
	</div>
}
export default Slider;