import { registerBlockType } from "@wordpress/blocks";

import "./editor.scss";
import metadata from "./block.json";
import Edit from "./Components/Backend/Edit";
import { isBlockEnabled } from '../utils/functions';
import { tableOfContentIcon } from '../utils/blocksIcon';

isBlockEnabled(metadata.name) && registerBlockType(metadata, {
    icon: tableOfContentIcon,
    edit: Edit,
});
