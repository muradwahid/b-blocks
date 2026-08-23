import ContentStyleOptions from './ContentStyleOptions';
import MediaStyleOptions from './MediaStyleOptions';

const Style = (props) => {
  return <>
    <MediaStyleOptions {...props} />
    <ContentStyleOptions {...props} />
  </>
};

export default Style;