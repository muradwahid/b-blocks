import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { PanelRow, __experimentalGradientPicker as Gradient } from '@wordpress/components';

// Variables
import Title from './Title';
import BtnGroup from './BtnGroup';
import BColor from './BColor';
import options from '../Const/options';
const { gradients, bgTypes } = options;

const ColorsControl = props => {
    const { colors, onChange, defaults = {} } = props;

    const defaultVal = { color: '#333', bgType: 'solid', bg: '#0000', gradient: 'linear-gradient(135deg, #4527a4, #8344c5)' }

    const def = type => defaults[type] || defaultVal[type];

    useEffect(() => {
        const allStyles = `${colors?.color ? `color: ${colors?.color};` : ''}
        ${colors?.gradient || colors?.bg ? `background: ${'gradient' === colors?.bgType ? colors?.gradient : colors?.bg};` : ''}`

        const initialObj = { color: colors?.color || def('color'), bgType: colors?.bgType || def('bgType'), bg: colors?.bg || def('bg'), gradient: colors?.gradient || def('gradient') }

        onChange({ ...colors, ...initialObj, ['styles']: allStyles.replace(/\s+/g, ' ').trim() });
    }, [colors?.color, colors?.bgType, colors?.bg, colors?.gradient]);

    return (
        <div>
            <BColor className='mt-20p mb-5p' label={__('Color:', 'b-blocks')} value={colors?.color} onChange={val => onChange({ ...colors, ['color']: val })} defaultColor={def('color')} />

            <PanelRow className='mt-20p mb-5p'>
                <Title mt='0' mb='0'>{__('Background:', 'b-blocks')}</Title>
                <BtnGroup options={bgTypes} myValue={colors?.bgType} setState={val => onChange({ ...colors, ['bgType']: val })} classes='bBlocksSizeType' size='small' />
            </PanelRow>

            {'gradient' === colors?.bgType ? <Gradient value={colors?.gradient} onChange={val => onChange({ ...colors, ['gradient']: val })} gradients={gradients} /> : <BColor label={__('Background Color:', 'b-blocks')} value={colors?.bg} onChange={val => onChange({ ...colors, ['bg']: val })} defaultColor={def('bg')} />}
        </div>
    );
};

export default ColorsControl;