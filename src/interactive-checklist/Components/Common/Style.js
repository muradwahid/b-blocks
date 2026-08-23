import { generateCSS } from '../../../../../bpl-tools/Advanced/generateCSS';
import { getBackgroundCSS, getBorderBoxCSS, getBoxCSS, getTypoCSS, isValidCSS } from '../../../../../bpl-tools/utils/getCSS';

const Style = ( { attributes, id, isBackend = false } ) => {
	const { heading = {}, checkbox = {}, item = {}, progress = {}, advanced } = attributes;

	const accent = checkbox.accent || '#4f46e5';
	const cbSize = checkbox.size || '20px';
	const progressSize = progress.typography?.fontSize?.desktop || '12px';

	const mainSl = `#${ id }`;
	const wrapperSl = `${ mainSl } .bBlocks-interactive-checklist-wrapper`;
	const headingSl = `${ wrapperSl } .bBlocks-interactive-checklist-heading`;
	const progressTextSl = `${ wrapperSl } .bBlocks-interactive-checklist-progress-text`;
	const trackSl = `${ wrapperSl } .bBlocks-interactive-checklist-progress-track`;
	const fillSl = `${ wrapperSl } .bBlocks-interactive-checklist-progress-fill`;
	const listSl = `${ wrapperSl } .bBlocks-interactive-checklist-list`;
	const itemSl = `${ wrapperSl } .bBlocks-interactive-checklist-item`;
	const labelSl = `${ wrapperSl } .bBlocks-interactive-checklist-label`;
	const checkboxSl = `${ wrapperSl } .bBlocks-interactive-checklist-checkbox`;
	const boxSl = `${ wrapperSl } .bBlocks-interactive-checklist-box`;
	const resetSl = `${ wrapperSl } .bBlocks-interactive-checklist-reset`;

	return <style
		dangerouslySetInnerHTML={ {
			__html: `
			${ getTypoCSS( '', heading.typography ).googleFontLink }
			${ getTypoCSS( '', item.typography ).googleFontLink }
			${ wrapperSl }{
				${ isValidCSS( 'color', item.color ) }
			}
			${ getTypoCSS( headingSl, heading.typography ).styles }
			${ headingSl }{
				${ isValidCSS( 'color', heading.color ) }
				${ getBackgroundCSS( heading.bg ) }
				${ getBorderBoxCSS( heading.border ) }
				${ isValidCSS( 'border-radius', getBoxCSS( heading.borderRadius ) ) }
				${ isValidCSS( 'padding', getBoxCSS( heading.padding ) ) }
			}
			${ getTypoCSS( '', progress.typography ).googleFontLink }
			${ getTypoCSS( progressTextSl, progress.typography ).styles }
			${ trackSl }{
				${ isValidCSS( 'height', progress.height ) }
				${ getBackgroundCSS( progress.trackBg ) }
			}
			${ fillSl }{
				${ progress.fillBg?.color || progress.fillBg?.gradient || progress.fillBg?.image?.url ? getBackgroundCSS( progress.fillBg ) : `background: ${ accent };` }
			}
			${ listSl }{ gap: ${ item.gap || '12px' }; }
			${ getTypoCSS( labelSl, item.typography ).styles }
			${ labelSl }{
				${ isValidCSS( 'color', item.color ) }
				padding-left: calc(${ cbSize } + 12px);
			}
			${ checkboxSl }{ width: ${ cbSize }; height: ${ cbSize }; }
			${ boxSl }{
				width: ${ cbSize };
				height: ${ cbSize };
				border-color: ${ accent };
			}
			${ boxSl }::after{
				${ isValidCSS( 'background-color', checkbox.checkColor ) }
			}
			${ checkboxSl }:checked + .bBlocks-interactive-checklist-box,
			${ itemSl }.is-checked .bBlocks-interactive-checklist-box{
				background: ${ accent };
				border-color: ${ accent };
			}
			${ checkboxSl }:focus-visible + .bBlocks-interactive-checklist-box{
				outline: 2px solid ${ accent };
				outline-offset: 2px;
			}
			${ resetSl }{
				color: ${ accent };
				font-size: ${ progressSize };
			}
			${ resetSl }:focus-visible{ outline: 2px solid ${ accent }; }
			${ generateCSS( id, advanced, isBackend, false ) }
			`,
		} }
	/>;
};
export default Style;
