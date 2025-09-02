import { isSet } from '../../../../utils/common';
import './style.scss';
const Radial = ({ duration = 1.2, size = 80, color = '#74ebd5' }) => {

  const styles = {
    ...(isSet(duration) && { "--b-blocks-radial-transition-duration": duration + 's' }),
    ...(isSet(size) && { "--b-blocks-radial-size": size + 'px' }),
    ...(isSet(color) && { "--b-blocks-radial-color": color })
  };
  return (
    <div style={styles} className="spark-radial-container">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="radial-spark"
          style={{ transform: `rotate(${i * 30}deg)` }}
        />
      ))}
    </div>
  );
};

export default Radial;