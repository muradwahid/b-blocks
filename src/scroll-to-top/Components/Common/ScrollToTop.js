import { useEffect, useMemo, useState } from 'react';

const ScrollToTop = (props) => {
  const { attributes, doc = document, win = window, isBackend = false } = props;
  const { scroll, icon, styles } = attributes;
  const { scrollType } = scroll;
  const { progress } = styles;
  const [scrollPercent, setScrollPercent] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  const config = {
    strokeWidth: progress.strokeSize,
    color: progress.color,
    bgColor: progress.strokeBg,
    bg: progress.bg
  };

  const radius = useMemo(() => 50 - (config.strokeWidth / 2), [config.strokeWidth]);
  const circumference = useMemo(() => 2 * Math.PI * radius, [radius]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = win?.pageYOffset || doc?.documentElement?.scrollTop || doc?.body?.scrollTop || 0;
      const scrollHeight = doc?.documentElement?.scrollHeight - doc?.documentElement?.clientHeight;
      const scrolled = scrollHeight === 0 ? 0 : (scrollTop / scrollHeight) * 100;
      setScrollPercent(Math.min(100, Math.max(0, scrolled)));
      if (!isBackend && scrollTop > 80) {
        setIsMounted(true);
      }else{
        setIsMounted(false);
      }
    };

    win?.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => win?.removeEventListener('scroll', handleScroll);
  }, [doc, win]);

  const svgOffset = circumference - (scrollPercent / 100) * circumference;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return <div className='b-blocks-scroll-to-top-main-wrapper' onClick={scrollToTop} style={{ ...(!isBackend ? { opacity: isMounted ? 1 : 0 } : {}) }}>
    <div className={`b-blocks-scroll-to-top-wrapper ${scrollType === 'progress' ? 'b-blocks-scroll-to-top-progress-wrapper' : ''}`}>
      {(scrollType === 'icon' || scrollType === 'progress') && <div className='b-blocks-scroll-to-top-icon' dangerouslySetInnerHTML={{ __html: icon.svg }} />}
      {scrollType === 'progress' && <svg viewBox="0 0 100 100" >
        <circle
          cx="50" cy="50" r={radius}
          fill={config.bg}
          stroke={config.bgColor}
          strokeWidth={config.strokeWidth}
        />
        <circle
          cx="50" cy="50" r={radius}
          fill="transparent"
          stroke={config.color}
          strokeWidth={config.strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={svgOffset}
          strokeLinecap="round"
          className="b-blocks-scroll-to-top-progress-circle"
        />
      </svg>}
      {scrollType === 'text' && <div className='b-blocks-scroll-to-top-text' dangerouslySetInnerHTML={{ __html: icon.text }} />}
    </div>
  </div>
};

export default ScrollToTop;