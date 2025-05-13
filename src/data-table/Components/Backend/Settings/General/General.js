import React from "react";
import { HelpPanel } from "../../../../../../../bpl-tools/Components";
import BodySettings from "./BodySettings/BodySettings";
import Header from './Header';

const General = (props) => {
    const { attributes, setAttributes, firstIdx } = props;
    return <>
        <HelpPanel slug="b-blocks" docsLink="https://bplugins.com/docs/data-table/guides/general" />
        <Header {...props} />

        <BodySettings firstIdx={firstIdx} attributes={attributes} setAttributes={setAttributes} />
    </>
};
export default General;
