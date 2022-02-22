import { __ } from '@wordpress/i18n';
import { forwardRef } from '@wordpress/element';
import { RichText } from '@wordpress/block-editor';

const Box = (props, ref) => {
	const { is, boxClass, isLabels, label, onChange } = props

	return is && <div className={`countdownItem ${boxClass}`}>
		<span className='digit' ref={ref}>00</span>
		{isLabels && <RichText className='label' tagName='span' value={label} onChange={val => onChange(val)} placeholder={__('Label', 'b-blocks')} />}
	</div>;
};
export default forwardRef(Box);