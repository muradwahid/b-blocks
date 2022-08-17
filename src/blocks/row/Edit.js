import { __ } from '@wordpress/i18n';
import { useEffect } from '@wordpress/element';
import { compose } from '@wordpress/compose';
import { withSelect, withDispatch } from '@wordpress/data';
import { InnerBlocks } from '@wordpress/block-editor';
import { Button, Dashicon } from '@wordpress/components';

import { tabController } from '../../../../Components/Helper/functions';

import Settings from './Settings';
import Style from './Style';
import { toFixed, updateChildWidth } from './utils/functions';
import { colOptions } from './utils/options';

let defaultLayout = { desktop: [33.33, 33.33, 33.34], tablet: [50, 50, 50], mobile: [100, 100, 100] };

const Edit = props => {
	const { className, attributes, setAttributes, clientId, isSelected, innerBlocks } = props;
	const { columns } = attributes;

	useEffect(() => { clientId && setAttributes({ cId: clientId.substring(0, 10) }); }, [clientId]); // Set & Update clientId to cId

	useEffect(() => tabController(), [isSelected]);

	const updateColumns = type => {
		const newColumns = type === 'add' ? columns + 1 : columns - 1;
		const columnFixedWidth = 6 === newColumns ? 16.66 : toFixed(100 / newColumns);

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

	const generateTemplate = columns => {
		return [...Array(columns)]?.map((data, index) => {
			const width = {
				desktop: defaultLayout.desktop[index],
				tablet: defaultLayout.tablet[index],
				mobile: defaultLayout.mobile[index]
			};
			return ['b-blocks/column', { width }];
		});
	}

	return <>
		<Settings attributes={props.attributes} setAttributes={setAttributes} clientId={clientId} />

		<div className={className} id={`bBlocksRow-${clientId}`}>
			<Style attributes={attributes} clientId={clientId} isBackend={true} />

			{!columns ? <div className='columnLayoutContainer'>
				<h3><Dashicon icon='layout' /> {__('Select a column layout', 'b-blocks')}</h3>

				<div className='columnLayouts'>
					{colOptions.map((data, index) => <Button key={index} showTooltip label={data.label} tooltipPosition='top' onClick={() => {
						setAttributes({ columns: data.columns });
						defaultLayout = data.layout;
					}}>
						{data.layout.desktop.map((d, dIndex) => <i key={dIndex} style={{ width: d + '%' }} />)}
					</Button>)}
				</div>
			</div> : <div className={`bBlocksRow has-${columns}-columns ${!isSelected ? 'notSelected' : ''}`}>
				<InnerBlocks allowedBlocks={['b-blocks/column']} template={generateTemplate(columns)} renderAppender={() => columns < 6 && isSelected ? <InnerBlocks.DefaultBlockAppender /> : null} />
			</div>}
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