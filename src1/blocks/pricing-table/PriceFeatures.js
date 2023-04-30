
import featureState from './icons/state.svg';

const PriceFeatures = ({ features }) => {
	return <div className='priceFeatures'>
		{features?.map((feature, index) => {
			const { isEnable, label } = feature;

			return <div key={index} className='priceFeature'>
				{isEnable ? <svg className='priceFeatureEnabled'>
					<use xlinkHref={`${featureState}#enabled`}></use>
				</svg> : <svg className='priceFeatureDisabled'>
					<use xlinkHref={`${featureState}#disabled`}></use>
				</svg>}

				<span className='priceFeatureLabel' dangerouslySetInnerHTML={{ __html: label }} />
			</div>;
		})}
	</div>
}
export default PriceFeatures;