import { __ } from '@wordpress/i18n';
import { forwardRef } from 'react';
import { RichText } from '@wordpress/block-editor';

const Box = (props, ref) => {
	const { is, boxClass, isLabels, label, isBackend = false, onChange } = props;

	return is && <div className={`countdownItem ${boxClass}`}>
		<span className='digit' ref={ref}>00</span>
		{isLabels && <>
			{isBackend ? <RichText className='label' tagName='span' value={label} onChange={val => onChange(val)} placeholder={__('Label', 'b-blocks')} /> : label && <label className='label' dangerouslySetInnerHTML={{ __html: label }} />}
		</>}
	</div>;
};
export default forwardRef(Box);