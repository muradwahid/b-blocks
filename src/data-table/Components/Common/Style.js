import generateCSS from '../../../../../bpl-tools/Advanced/generateCSS';
import { getBoxCSS } from '../../../../../bpl-tools/utils/getCSS';

const Style = ({ attributes, id, isBackend = false }) => {
	const { table, headerStyle, bodyStyle, advanced } = attributes;

	const mainSl = `#${id}`;
	const blockSl = `${mainSl} .bpdt-dataTable-wrapper`;
	const tableContainer = `${blockSl} .bpdt-table-wrapper`;
	const tableBody = `${blockSl} .bpdt-table-body`;

	return <style>
		{`
		${generateCSS(id, advanced, isBackend)}
		${blockSl}{
			display:grid;
			justify-items:${table.alignment === 'left'
				? 'start'
				: table.alignment === 'center'
					? 'center'
					: 'end'
			};
		}
		${blockSl} .bpdt-dataTable{
			width:${table.width.desktop};
		}
		${tableContainer}{
			border-collapse:${table.borderSeparator ? 'separate' : 'collapse'};
		}
		${tableContainer} thead>tr>th:first-child{
			border-radius:${headerStyle.bRadius}px 0 0 0;
		}
		${tableContainer} thead>tr>th:last-child{
			border-radius:0 ${headerStyle.bRadius}px 0 0;
		}
		${tableContainer} thead>tr>th{
				padding:${getBoxCSS(headerStyle.padding.desktop)};
		color:${headerStyle.color.normal};
		background-color:${headerStyle.bg.normal};
		border:${headerStyle.border.normal.width}px ${headerStyle.borderType.normal
			} ${headerStyle.border.normal.color};
		text-align:${headerStyle.titleAlign === 'left'
				? 'left'
				: headerStyle.titleAlign === 'center'
					? 'center'
					: 'right'
			};
		}
		${tableContainer} thead>tr>th:hover{
			color:${headerStyle.color.hover};
			background-color:${headerStyle.bg.hover};
			border:${headerStyle.border.hover.width}px ${headerStyle.borderType.hover
			} ${headerStyle.border.hover.color};
		}
		${tableContainer} thead>tr>th :where(.bpdt-headerIcon,img){
			width:${headerStyle.iconSize.desktop}px;
			margin-right:${headerStyle.iconSpace.desktop}px;
		}
		${tableBody} tr>td{
			border:${bodyStyle.border.normal.width}px ${bodyStyle.borderType.normal
			} ${bodyStyle.border.normal.color};
					padding:${getBoxCSS(bodyStyle.padding.desktop)};
			text-align:${bodyStyle.textAlign.desktop === 'left'
				? 'left'
				: bodyStyle.textAlign.desktop === 'center'
					? 'center'
					: 'right'
			};
		}
		${tableBody} tr>td:hover{
			border:${bodyStyle.border.hover.width}px ${bodyStyle.borderType.hover
			} ${bodyStyle.border.hover.color};
		}
		${tableBody} tr>td a{
			color:${bodyStyle.linkColor.normal};
			cursor:pointer;
		}
		${tableBody} tr>td a:hover{
			color:${bodyStyle.linkColor.hover};
			
		}
		${tableBody} tr:nth-child(odd){
			color:${bodyStyle.oddCell.normal.color};
			background-color:${bodyStyle.oddCell.normal.bg || '#fff'};
		}
		${tableBody} tr:nth-child(odd)>td:hover{
			color:${bodyStyle.oddCell.hover.color};
			background-color:${bodyStyle.oddCell.hover.bg || '#fff'};
		}
		${tableBody} tr:nth-child(even){
			color:${bodyStyle.evenCell.normal?.color};
			background-color:${bodyStyle.evenCell.normal.bg || '#fff'};
		}
		${tableBody} tr:nth-child(even)>td:hover{
			color:${bodyStyle.evenCell.hover.color};
			background-color:${bodyStyle.evenCell.hover.bg || '#fff'};
		}
		${tableBody} .bpdt-bodyIcon{
			width:${bodyStyle.icon.size.desktop}px;
			fill:${bodyStyle.icon.color.normal};
			color:${bodyStyle.icon.color.normal};
		}
		${tableBody} .bpdt-bodyIcon:hover{
			fill:${bodyStyle.icon.color.hover};
			color:${bodyStyle.icon.color.hover};
		}

		@media only screen and (min-width:641px) and (max-width: 1024px) {
		${blockSl} .bpdt-dataTable{
			width:${table.width.tablet};
		}
		${tableContainer} thead>tr>th{
					padding:${getBoxCSS(headerStyle.padding.tablet)};
			}
		${tableContainer} thead>tr>th :where(.bpdt-headerIcon,img){
			width:${headerStyle.iconSize.tablet}px;
			margin-right:${headerStyle.iconSpace.tablet}px;
		}
		${tableBody} tr>td{
				padding:${getBoxCSS(bodyStyle.padding.tablet)};
			text-align:${bodyStyle.textAlign.tablet === 'left'
				? 'left'
				: bodyStyle.textAlign.tablet === 'center'
					? 'center'
					: 'right'
			};
		}
		${tableBody} .bpdt-bodyIcon{
			width:${bodyStyle.icon.size.tablet}px;
		}
		}

		@media only screen and (max-width: 640px) {
				${blockSl} .bpdt-dataTable{
			width:${table.width.mobile};
		}
		${tableContainer} thead>tr>th{
				padding:${getBoxCSS(headerStyle.padding.mobile)};
			}
		${tableContainer} thead>tr>th :where(.bpdt-headerIcon,img){
			width:${headerStyle.iconSize.mobile}px;
			margin-right:${headerStyle.iconSpace.mobile}px;
		}
		${tableBody} tr>td{
				padding:${getBoxCSS(bodyStyle.padding.mobile)};
			text-align:${bodyStyle.textAlign.mobile === 'left'
				? 'left'
				: bodyStyle.textAlign.mobile === 'center'
					? 'center'
					: 'right'
			};
		}
		${tableBody} .bpdt-bodyIcon{
			width:${bodyStyle.icon.size.mobile}px;
		}
		}
		`}
	</style>
};
export default Style;