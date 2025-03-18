import {__experimentalBorderBoxControl as BorderBoxControl,Flex,PanelBody,TabPanel, __experimentalUnitControl as UnitControl,} from "@wordpress/components";
import { compose } from "@wordpress/compose";
import { withSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import React, { Fragment } from "react";
import {BoxControl,ColorControl,Device} from "../../../../../../../bpl-tools/Components";
import { updateData } from "../../../../../../../bpl-tools/utils/functions";
const SpotsStyle = ({ setAttributes, attributes, device }) => {
  const { spots } = attributes;
  return (
    <PanelBody className="bPlPanelBody" initialOpen={true} title={__("Spots", "b-blocks")} >
        <UnitControl
          label={<Flex>{__("Width", "b-blocks")} <Device /></Flex>}
          labelPosition='edge'
          units={[{ label: "PX", value: "px" }]}
          isUnitSelectTabbable
          value={spots.width[device]}
          min={1}
          max={700}
          onChange={(value) =>
            setAttributes({
              spots: updateData(spots, value, "width", device),
            })
          }
        />
        <UnitControl
          label={<Flex>{__("Height", "b-blocks")}<Device /></Flex>}
        labelPosition='edge'
        className='mt10'
          units={[{ label: "PX", value: "px" }]}
          isUnitSelectTabbable
          value={spots.height[device]}
          min={1}
          max={700}
          onChange={(value) =>
            setAttributes({
              spots: updateData(spots, value, "height", device),
            })
          }
        />
        <UnitControl
          label={<Flex>{__("Icon Size", "b-blocks")} <Device/></Flex>}
        labelPosition='edge'
        className='mt10'
          units={[{ label: "PX", value: "px" }]}
          isUnitSelectTabbable
          value={spots.iconSize[device]}
          min={1}
          max={200}
          onChange={(value) =>
            setAttributes({
              spots: updateData(spots, value, "iconSize", device),
            })
          }
        />

        <BoxControl
        label={<Flex>{__("Padding", "b-blocks")} <Device /></Flex>}
        className='mt10'
          values={spots.padding[device]}
          resetValues={{
            left: "0px",
            right: "0px",
            top: "0px",
            bottom: "0px",
          }}
          onChange={(value) =>
            setAttributes({
              spots: updateData(spots, value, "padding", device),
            })
          }
        />

      <BorderBoxControl
        label={__("Border", "b-blocks")}
        value={spots.border}
        onChange={(value) =>
          setAttributes({ spots: updateData(spots, value, "border") })
        }
      />

        <BoxControl
        label={<Flex>{__("Border Radius", "b-blocks")} <Device /></Flex>}
        className='mt10'
          values={spots.borderRadius[device]}
          resetValues={{
            left: "5px",
            right: "5px",
            top: "5px",
            bottom: "5px",
          }}
          onChange={(value) =>
            setAttributes({
              spots: updateData(spots, value, "borderRadius", device),
            })
          }
        />  
      <TabPanel className="bPlTabPanel small mt10" activeClass='activeTab' tabs={[{ title: "Normal", name: "normal" },
        { title: "Hover", name: "hover" },]} >
        {({ name }) => <Fragment>
          {name === "normal" && <Fragment>
            <ColorControl
              label="Text/Icon Color"
              value={spots.iconColor}
              colors={[
                { name: "red", color: "#f00" },
                { name: "white", color: "#fff" },
                { name: "blue", color: "#00f" },
              ]}
              onChange={(value) =>
                setAttributes({
                  spots: { ...spots, iconColor: value },
                })
              }
            />
            <ColorControl
              label="Background Color"
              value={spots.bgColor}
              colors={[
                { name: "red", color: "#f00" },
                { name: "white", color: "#fff" },
                { name: "blue", color: "#00f" },
              ]}
              onChange={(value) =>
                setAttributes({
                  spots: { ...spots, bgColor: value },
                })
              }
            />
          </Fragment>}
          {
            name === "hover" && <Fragment>
              <ColorControl
                label="Text Color"
                value={spots.hoverColor.icon}
                colors={[
                  { name: "red", color: "#f00" },
                  { name: "white", color: "#fff" },
                  { name: "blue", color: "#00f" },
                ]}
                onChange={(value) =>
                  setAttributes({
                    spots: {
                      ...spots,
                      hoverColor: {
                        ...spots.hoverColor,
                        icon: value,
                      },
                    },
                  })
                }
              />
              <ColorControl
                label="Background Color"
                value={spots.hoverColor.bg}
                colors={[
                  { name: "red", color: "#f00" },
                  { name: "white", color: "#fff" },
                  { name: "blue", color: "#00f" },
                ]}
                onChange={(value) =>
                  setAttributes({
                    spots: {
                      ...spots,
                      hoverColor: {
                        ...spots.hoverColor,
                        bg: value,
                      },
                    },
                  })
                }
              />
              <ColorControl
                label="Border Color"
                value={spots.hoverColor.border}
                colors={[
                  { name: "red", color: "#f00" },
                  { name: "white", color: "#fff" },
                  { name: "blue", color: "#00f" },
                ]}
                onChange={(value) =>
                  setAttributes({
                    spots: {
                      ...spots,
                      hoverColor: {
                        ...spots.hoverColor,
                        border: value,
                      },
                    },
                  })
                }
              />
            </Fragment>
          }
        </Fragment>}
      </TabPanel>
    </PanelBody>
  );
};

export default compose(
  withSelect((select) => {
    const { getDeviceType } = select("core/editor");

    return {
      device: getDeviceType()?.toLowerCase(),
    };
  })
)(SpotsStyle);
