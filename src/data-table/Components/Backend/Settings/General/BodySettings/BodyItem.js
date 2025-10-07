import { __ } from '@wordpress/i18n';
import { __experimentalInputControl as InputControl, __experimentalNumberControl as NumberControl } from '@wordpress/components';

import { BtnGroup, MediaArea } from '../../../../../../../../bpl-tools/Components';
import starIcon from '../../../../../../../assets/icons/starIcon.svg';
import { panelStarIcon, pencilIcon, xMarkIcon } from '../../../../../utils/icons';

const BodyItem = ({ updateHeading, value, index, secondIndx, removeColumn, ...props }) => {
	const typeOptions = [
		{ label: 'Edit', icon: pencilIcon, value: 'edit' },
		{ label: 'Icon', icon: panelStarIcon, value: 'icon' },
	];

	return <div className='panel-body-main-container'>
		<div className='panel-body-title-container' {...props}>
			<div className='panel-body-title'>
				<p
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
					}}
					onClick={() =>
						updateHeading(index, secondIndx, 'toggle', !value.toggle)
					}
				>
					<div
						dangerouslySetInnerHTML={{
							__html: value.text || `Content ${secondIndx + 1}`,
						}}
					></div>
				</p>
				<div
					onClick={() => removeColumn(index, secondIndx)}
					className='panel-body-single-icon'
				>
					{xMarkIcon}
				</div>
			</div>
		</div>
		{value.toggle && (
			<div className='table-body-control-body-wrapper'>
				<NumberControl label={__('Col Span', 'b-blocks')} labelPosition='edge' onChange={(value) => updateHeading(index, secondIndx, 'clSpan', value)} step={1} min={1} max={10} value={value.clSpan} />

				<NumberControl className='mt10' label={__('Row Span', 'b-blocks')} labelPosition='edge' onChange={(value) => updateHeading(index, secondIndx, 'rowSpan', value)} step={1} min={1} max={10} value={value.rowSpan} />

				<BtnGroup label={__('Content Type', 'b-blocks')} options={typeOptions} value={value.contentType} onChange={(val) => updateHeading(index, secondIndx, 'contentType', val)} isIcon={true} />

				{value.contentType === 'edit' && (
					<InputControl value={value.text} onChange={(value) => updateHeading(index, secondIndx, 'text', value)} />
				)}

				{value.contentType === 'icon' && (
					<MediaArea types={['image/svg+xml']} default={starIcon} value={{ url: value.icon }} onChange={(value) => updateHeading(index, secondIndx, 'icon', value.url)} />
				)}
			</div>
		)}
	</div>
};

export default BodyItem;
