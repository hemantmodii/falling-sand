// src/P5Wrapper.jsx
import React, { useRef, useEffect } from 'react';
import p5 from 'p5';

const P5Wrapper = ({ sketch }) => {
  const sketchRef = useRef();

  useEffect(() => {
    const p5Instance = new p5(sketch, sketchRef.current);
    return () => {
      p5Instance.remove();
    };
  }, [sketch]);

  return <div ref={sketchRef} style={{ width: '100%', height: '100%' }}></div>;
};

export default P5Wrapper;
