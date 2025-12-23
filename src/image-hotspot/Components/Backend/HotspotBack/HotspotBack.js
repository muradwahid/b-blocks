import { useCallback, useState } from 'react';
import { produce } from 'immer';

import Draggable from './Draggable';
import { placeholderImg } from '../../../../utils/data';

const HotspotBack = ({ attributes, setAttributes, setActiveIdx, isSelected }) => {
	const { hotspot, image, preset, align } = attributes;
	const [wrapperEl, setWrapperEl] = useState(null);
	const setWrapperRef = useCallback(node => setWrapperEl(node), []);
	return <div ref={setWrapperRef} className='b-blocks-hotspot-image-wrapper' >
		<img src={image?.url || placeholderImg} alt={image?.alt || 'Hotspot Image'} className='b-blocks-hotspot-image' />

		{hotspot.map((el, i) =>
			<Draggable
				key={i}
				{...{setActiveIdx, preset, align, isSelected }}
				value={el.position.desktop}
				wrapperEl={wrapperEl}
				element={el}
				index={i}
				onChange={(val) =>
					setAttributes({
						hotspot: produce(hotspot, (draft) => {
							draft[i].position.desktop = val;
						}),
					})
				}
			/>
		)}
	</div>
};
export default HotspotBack;
