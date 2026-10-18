import { BOX, cleanSvg } from '../../utils/functions';

export const ButtonIcon = ( { svg } ) => {
	const clean = cleanSvg( svg );
	return clean ? <span className={ `${ BOX }-btn-icon` } aria-hidden='true' dangerouslySetInnerHTML={ { __html: clean } } /> : null;
};

const ButtonContent = ( { icon = {}, children } ) => <>
	{ 'after' !== icon.position && <ButtonIcon svg={ icon.svg } /> }
	{ children }
	{ 'after' === icon.position && <ButtonIcon svg={ icon.svg } /> }
</>;

export default ButtonContent;
