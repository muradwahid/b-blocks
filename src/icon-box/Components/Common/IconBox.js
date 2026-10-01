import { useMemo } from 'react';

import { sanitizeSVG } from '../../../../../bpl-tools/utils/common';
import { prefix } from '../../utils/data';

const IconBox = ({ attributes }) => {
	const { icon, animation } = attributes;
	const { type, hover = {} } = animation;

	const svg = useMemo(() => sanitizeSVG(icon?.svg), [icon?.svg]);

	return <div className={`${prefix} b-blocks-icon-box-animation ${type} ${hover?.type}`} dangerouslySetInnerHTML={{ __html: svg }} />

}
export default IconBox;