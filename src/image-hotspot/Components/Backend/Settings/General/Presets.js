import { PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { defaultTheme, themeFive, themeFour, themeThree, themeTwo } from '../../../../utils/options';
import { tooltipFive, tooltipFour, tooltipOne, tooltipThree, tooltipTwo } from '../../../../utils/tooltipOptions';

const Presets = ({ attributes, setAttributes }) => {
	const { preset } = attributes;
	const images = [
		{ value: 'default', img: 'https://templates.bplugins.com/wp-content/uploads/2025/03/default.png' },
		{ value: 'themetwo', img: 'https://templates.bplugins.com/wp-content/uploads/2025/03/Screenshot-2025-03-13-160416.png' },
		{ value: 'themethree', img: 'https://templates.bplugins.com/wp-content/uploads/2025/03/Screenshot-2025-03-13-160945.png' },
		{ value: 'themefour', img: 'https://templates.bplugins.com/wp-content/uploads/2025/03/Screenshot-2025-03-13-161051.png' },
		{ value: 'themefive', img: 'https://templates.bplugins.com/wp-content/uploads/2025/03/Screenshot-2025-03-13-161736.png' },
	];

	return <PanelBody className='bPlPanelBody' initialOpen={false} title={__('Presets', 'b-blocks')} >
		<span>Templates</span>

		<div className='presets-container'>
			{images.map((e, i) => (
				<div
					key={i}
					onClick={() => {
						const value = e.value;
						setAttributes({
							preset: value,
							spots:
								value === 'default'
									? defaultTheme
									: value === 'themetwo'
										? themeTwo
										: value === 'themethree'
											? themeThree
											: value === 'themefour'
												? themeFour
												: themeFive,
							tooltip:
								value === 'default'
									? tooltipOne
									: value === 'themetwo'
										? tooltipTwo
										: value === 'themethree'
											? tooltipThree
											: value === 'themefour'
												? tooltipFour
												: tooltipFive,
						});
					}}
					className={`single-preset ${preset === e.value ? 'active' : ''}`}
				>
					<div className='preset-tooltip-container'>
						<div className='preset-tooltip'>
							<i className='fa-solid fa-caret-down'></i>
							<span>Design {i + 1}</span>
						</div>
					</div>
					<img src={e.img} alt='' />
				</div>
			))}
		</div>
	</PanelBody>
};
export default Presets;
