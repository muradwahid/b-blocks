import { __ } from '@wordpress/i18n';
import { RichText } from '@wordpress/block-editor';

const Counters = ({ attributes, isBackend = false, custom }) => {
	const { counters = [], columns, isIcon, iconPosition, isLabel } = attributes;

	return <div className={`bBlocksCounters columns-${columns.desktop} columns-tablet-${columns.tablet} columns-mobile-${columns.mobile}`}>
		{counters?.map((item, index) => {
			const { icon, number, label } = item;

			const iconEl = icon?.class && <i className={icon.class}></i>;
			const labelEl = isLabel && <>
				{isBackend ? <RichText className='counterLabel' tagName='p' value={label.text} onChange={val => custom.updateCounter('label', val, 'text')} placeholder={__('Label', 'counters-block')} inlineToolbar /> : label.text && <RichText.Content className='counterLabel' tagName='p' value={label.text} />}
			</>

			return <div key={index} onClick={() => isBackend && custom.setActiveIndex(index)} className={`${isBackend && index === custom.activeIndex ? 'bBlocksNowEditing' : ''}`} id={`bBlocksCounter-${index}`}>
				<div className='bBlocksCounter'>
					{isIcon && 'top' === iconPosition && <div className='counterIcon'>{iconEl}</div>}

					<div className='counterNumber'>
						<span className='prefix'>{number.prefix}</span>
						<span className='number' data-count-start={number.start} data-count-end={number.end}>{number.start}</span>
						<span className='suffix'>{number.suffix}</span>
					</div>

					{'label' === iconPosition ? <div className='counterIconLabel'>{iconEl}{labelEl}</div> : labelEl}
				</div>
			</div>;
		})}
	</div>
}
export default Counters;