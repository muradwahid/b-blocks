import { sanitizeHTML } from '../../../../../bpl-tools/utils/common';

import { enabledIcon, disabledIcon } from '../../utils/icons';

const PriceFeatures = ({ features }) => {
	return <div className='priceFeatures'>
		{features?.map((feature, index) => {
			const { isEnable, label } = feature;

			return <div key={index} className='priceFeature'>
				{isEnable ? enabledIcon : disabledIcon}

				<span className='priceFeatureLabel' dangerouslySetInnerHTML={{ __html: sanitizeHTML(label) }} />
			</div>;
		})}
	</div>
}
export default PriceFeatures;