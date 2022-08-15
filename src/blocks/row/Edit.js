import { useEffect } from '@wordpress/element';
import { compose } from '@wordpress/compose';
import { withSelect, withDispatch } from '@wordpress/data';
import { InnerBlocks } from '@wordpress/block-editor';

import Settings from './Settings';
import Style from './Style';
import { twoFixed, updateChildWidth } from './functions';

const Edit = props => {
	const { className, attributes, setAttributes, clientId, isSelected, innerBlocks } = props;
	const { columns } = attributes;

	useEffect(() => { clientId && setAttributes({ cId: clientId.substring(0, 10) }); }, [clientId]); // Set & Update clientId to cId

	const updateColumns = type => {
		const newColumns = type === 'add' ? columns + 1 : columns - 1;
		const columnFixedWidth = twoFixed(100 / newColumns);

		setAttributes({ columns: newColumns });

		updateChildWidth(clientId, columnFixedWidth);
	}

	useEffect(() => {
		if (columns < innerBlocks.length) {
			updateColumns('add')
		} else if (columns > innerBlocks.length) {
			updateColumns('delete')
		}
	}, [innerBlocks.length]);

	return <>
		<Settings attributes={props.attributes} setAttributes={setAttributes} clientId={clientId} />

		<div className={className} id={`bBlocksRow-${clientId}`}>
			<Style attributes={attributes} clientId={clientId} isBackend={true} />

			<div className={`bBlocksRow has-${columns}-columns ${!isSelected ? 'notSelected' : ''}`}>
				<InnerBlocks allowedBlocks={['b-blocks/column']} template={[['b-blocks/column'], ['b-blocks/column'], ['b-blocks/column']]} renderAppender={() => columns < 6 && isSelected ? <InnerBlocks.ButtonBlockAppender /> : null} />
			</div>
		</div>
	</>;
};
export default compose(
	withSelect((select, props) => {
		const { clientId } = props;
		const { getBlocks } = select('core/block-editor');

		return {
			innerBlocks: getBlocks(clientId)
		};
	}),

	withDispatch((dispatch) => {
		return {
			updateAttributes: (id, args) => dispatch('core/block-editor').updateBlockAttributes(id, args)
		}
	})
)(Edit);