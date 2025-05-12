import { PanelBody, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { ItemsPanel } from '../../../../../../../bpl-tools/Components';
import HeaderSettings from './HeaderSettings';

const Header = ({ attributes, setAttributes, updateObj, headingIdx, setHeadingIdx }) => {
    const { headings, tableSort } = attributes;
    const newItem = {
        id: Number([headings.length - 1].id) + 1,
        clName: `Table Header ${headings.length + 1}`,
        clSpan: "1",
        width: "0%",
        enableIcon: false,
        icon: "",
        image: "",
        iconType: "icon",
        size: 20,
        toggle: false,
    }
    const itemProps = { attributes, setAttributes, arrKey: 'headings', title: 'clName', updateObj, newItem, design: 'sortable', activeIndex: headingIdx, setActiveIndex: setHeadingIdx };

    return <PanelBody className='bPlPanelBody' title={__("Table Header", "b-blocks")} initialOpen={true}>
        <ToggleControl label={__("Enable Table Sorting", "b-blocks")} onChange={(value) => setAttributes({ tableSort: value })} checked={tableSort} />

        <ItemsPanel {...itemProps} ItemSettings={HeaderSettings} />

    </PanelBody>;
}
export default Header;