import { isSet } from "../../../../utils/common";
import "./style.scss";

const SparkSimple = ({ duration, easing = 'ease-out', size = 40, color = '#ff6b6b' }) => {

  const styles = {
    ...(isSet(duration) && { "--b-blocks-simple-transition-duration": duration + 'ms' }),
    ...(isSet(easing) && { "--b-blocks-simple-timing-function": easing }),
    ...(isSet(size) && { "--b-blocks-simple-size": size + 'px' }),
    ...(isSet(color) && { "--b-blocks-simple-color": color })
  };
  return (
    <div style={styles} className="spark-simple-container">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="spark-line"
          style={{ transform: `rotate(${i * 60}deg)` }}
        />
      ))}
    </div>
  );
};

export default SparkSimple;
