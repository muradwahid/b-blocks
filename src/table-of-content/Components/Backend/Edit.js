import { useBlockProps } from '@wordpress/block-editor';
import { generateCSS } from '../../../../../bpl-tools/Advanced/generateCSS';
import SmoothScroll from '../Common/SmoothScroll';
import { useHeadingDetect } from '../hooks/useHeadingDetect';
import Settings from './Settings/Settings';
import List from './TableContents/List';
import Slide from './TableContents/Slide';
import TableContents from './TableContents/TableContents';
import Timeline from './TableContents/Timeline';

const Edit = props => {
  const { attributes, setAttributes, clientId } = props;
  const { minimize } = attributes;
  const { theme, advanced } = attributes;
  const { headingContent, headingTags } = useHeadingDetect();
  const id = `block-${clientId}`;

  return (
    <>
      <Settings {...{ attributes, setAttributes }} />

      <div {...useBlockProps()} >
        <style dangerouslySetInnerHTML={{ __html: `${generateCSS(id, advanced, true)}` }} ></style>
        <div>
          <SmoothScroll />
          {(() => {
            switch (theme) {
              case "slide":
                return <Slide attributes={attributes} setAttributes={setAttributes} id={id} key={headingContent + headingTags} />;
              case "timeline":
                return <Timeline attributes={attributes} setAttributes={setAttributes} id={id} key={headingContent + headingTags} />;
              case "list":
                return <List attributes={attributes} setAttributes={setAttributes} id={id} key={headingContent + headingTags} />;
              default:
                return <TableContents key={minimize.toggle + headingContent + headingTags + advanced?.animation?.type} setAttributes={setAttributes} attributes={attributes} id={id} />;
            }
          })()}
        </div>
      </div>
    </>
  );
}
export default Edit;