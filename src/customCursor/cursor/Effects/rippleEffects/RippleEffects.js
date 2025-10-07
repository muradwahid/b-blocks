import { isSet } from '../../../utils/common';
import './style.scss';
/**
 * RippleEffects component renders different ripple effects based on the type prop.
 * @param {Object} props - Component properties.
 * @param {string} props.type - Type of ripple effect ('circle', 'double', 'wave', 'pulse').
 * @returns {JSX.Element} The ripple effect element.
 */
const RippleEffects = ({ type, ...props }) => {
  const { duration, size, background, secondaryBgColor, borderColor, secondaryBorderColor, tertiaryBorderColor, borderWidth } = props;

  const rippleStyle = {
    rippleCircle: {
      ...(isSet(size)) && { '--b-blocks-effect-ripple-size': size + 'px' },
      ...(isSet(background)) && { '--b-blocks-effect-ripple-background': background },
      ...(isSet(borderColor)) && { '--b-blocks-effect-ripple-border-color': borderColor },
      ...(isSet(borderWidth)) && { '--b-blocks-effect-ripple-border-width': borderWidth + 'px' },
      ...(isSet(duration)) && { '--b-blocks-effect-ripple-duration': duration + 's' }
    },
    rippleDouble: {
      fast: {
        ...(isSet(size)) && { '--b-blocks-effect-ripple-size': size + 'px' },
        ...(isSet(background)) && { '--b-blocks-effect-ripple-background': background },
        ...(isSet(borderColor)) && { '--b-blocks-effect-ripple-border-color': borderColor },
        ...(isSet(borderWidth)) && { '--b-blocks-effect-ripple-border-width': borderWidth + 'px' },
        ...(isSet(duration)) && { '--b-blocks-effect-ripple-duration': duration + 's' }
      },
      slow: {
        ...(isSet(size)) && { '--b-blocks-effect-ripple-size': size + 'px' },
        ...(isSet(secondaryBgColor)) && { '--b-blocks-effect-ripple-background': secondaryBgColor },
        ...(isSet(secondaryBorderColor)) && { '--b-blocks-effect-ripple-border-color': secondaryBorderColor },
        ...(isSet(borderWidth)) && { '--b-blocks-effect-ripple-border-width': borderWidth + 'px' },
        ...(isSet(duration)) && { '--b-blocks-effect-ripple-slow-duration': (duration * 1.41).toFixed(2) + 's' }
      }
    },
    rippleWave: {
      wave1: {
        ...(isSet(size)) && { '--b-blocks-effect-ripple-wave-size': size + 'px' },
        ...(isSet(duration)) && { '--b-blocks-effect-ripple-duration': duration + 's' },
        ...(isSet(borderColor)) && { '--b-blocks-effect-ripple-border-color': borderColor },
        ...(isSet(borderWidth)) && { '--b-blocks-effect-ripple-border-width': borderWidth + 'px' },
      },
      wave2: {
        ...(isSet(size)) && { '--b-blocks-effect-ripple-wave-size': size + 'px' },
        ...(isSet(duration)) && { '--b-blocks-effect-ripple-duration': duration + 's' },
        ...(isSet(secondaryBorderColor)) && { '--b-blocks-effect-ripple-border-color': secondaryBorderColor },
        ...(isSet(borderWidth)) && { '--b-blocks-effect-ripple-border-width': borderWidth + 'px' },
      },
      wave3: {
        ...(isSet(size)) && { '--b-blocks-effect-ripple-wave-size': size + 'px' },
        ...(isSet(duration)) && { '--b-blocks-effect-ripple-duration': duration + 's' },
        ...(isSet(tertiaryBorderColor)) && { '--b-blocks-effect-ripple-border-color': tertiaryBorderColor },
        ...(isSet(borderWidth)) && { '--b-blocks-effect-ripple-border-width': borderWidth + 'px' },
      }
    },
    ripplePulse: {
      ...(isSet(size)) && { '--b-blocks-effect-ripple-size': size + 'px' },
      ...(isSet(background)) && { '--b-blocks-effect-ripple-background': background },
      ...(isSet(duration)) && { '--b-blocks-effect-ripple-duration': duration + 's' },
      ...(isSet(borderWidth)) && { '--b-blocks-effect-ripple-border-width': borderWidth + 'px' },
      ...(isSet(borderColor)) && { '--b-blocks-effect-ripple-border-color': borderColor },
    }
  }

  switch (type) {
    case 'rippleCircle':
      return <div style={rippleStyle.rippleCircle} className="b-blocks-ripple-circle" />;
    case "rippleDouble":
      return (
        <>
          <div style={rippleStyle.rippleDouble.fast} className="b-blocks-ripple-circle b-blocks-ripple-fast" />
          <div style={rippleStyle.rippleDouble.slow} className="b-blocks-ripple-circle b-blocks-ripple-slow" />
        </>
      );
    case "rippleWave":
      return (
        <>
          <div style={rippleStyle.rippleWave.wave1} className="b-blocks-ripple-wave b-blocks-wave-1" />
          <div style={rippleStyle.rippleWave.wave2} className="b-blocks-ripple-wave b-blocks-wave-2" />
          <div style={rippleStyle.rippleWave.wave3} className="b-blocks-ripple-wave b-blocks-wave-3" />
        </>
      );
    case "tsunami":
      return <>
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="b-blocks-ripple"
            style={{ animationDelay: `${i * 0.25}s` }}
          />
        ))}
      </>
    case 'ripplePulse':
      return <div style={rippleStyle.ripplePulse} className="b-blocks-ripple-pulse" />;
  }
};

export default RippleEffects;