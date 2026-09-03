import { useBlockProps } from '@wordpress/block-editor';
import { withSelect } from '@wordpress/data';

import { updateAttributes } from '../../../../../bpl-tools/utils/functions';

import { wrapperClasses } from '../../utils/data';
import Style from '../Common/Style';
import ComparisonTable from '../Frontend/ComparisonTable';
import Settings from './Settings/Settings';

const Edit = (props) => {
	const { attributes, setAttributes, clientId } = props;

	const isPremium = typeof bBlocksPremiumChecker !== 'undefined' ? bBlocksPremiumChecker : false;
	const updateObj = updateAttributes(attributes, setAttributes);

	const blockProps = useBlockProps({
		id: `block-${clientId}`,
		className: wrapperClasses(attributes)
	});

	return <>
		<Settings {...{ ...props, updateObj, isPremium }} />

		<div {...blockProps}>
			<Style attributes={attributes} id={`block-${clientId}`} isBackend={true} />
			<div>
				<ComparisonTable attributes={attributes} isBackend={true} />
			</div>
		</div>
	</>;
};

export default withSelect((select) => {
	const { getDeviceType } = select('core/editor');

	return {
		device: getDeviceType()?.toLowerCase()
	};
})(Edit);
