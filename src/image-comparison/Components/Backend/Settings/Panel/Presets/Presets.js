import './style.scss'
import { Tooltip } from '@wordpress/components';
const Presets = ({ value, options, onChange, isPremium = false,setIsProModalOpen }) => {
    return <div className='icb-preset-items-wrapper'>
            {options.map((item, i) => <Tooltip position='top' text={`${item.label}`} key={i} delay={100}>
                <div onClick={() => (item.value !== 'default' && !isPremium && item.isPro) ? setIsProModalOpen(true):onChange(item.value)} className={`icb-preset-item  ${value === item.value ? 'active' : ''} ${(item.value !== 'default' && !isPremium && item.isPro) ? 'icb-premium' : ''}`} >
                    <img src={item.img} />
                    <div className='icb-preset-badge'>Pro</div>
                </div>
            </Tooltip>)}
        </div> 
};

export default Presets;