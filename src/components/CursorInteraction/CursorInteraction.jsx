import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import star from 'assets/star.png';
import s from './CursorInteraction.module.css';

const CANVAS_ID = 'canvas';

export default function CursorInteraction({ children }) {
  const [canvas, setCanvas] = useState(null);
  const [staticCoords, setStaticCoords] = useState(true);
  const [xCoordinate, setXCoordinate] = useState(null);
  const [yCoordinate, setYCoordinate] = useState(null);

  useEffect(() => {
    setCanvas(document.getElementById(CANVAS_ID));
  }, []);

  useEffect(() => {
    function handleMouseMove(e) {
      setStaticCoords(false);

      setTimeout(() => {
        setXCoordinate(e.clientX);
        setYCoordinate(e.clientY);
      }, 300);

      setTimeout(() => {
        setStaticCoords(true);
      }, 310);
    }

    canvas?.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      canvas?.removeEventListener('mousemove', handleMouseMove, {
        passive: true,
      });
    };
  }, [canvas, xCoordinate, yCoordinate]);

  return (
    <div id={CANVAS_ID} className={s.canvas}>
      {children}

      <div
        className={staticCoords ? s.activMagicBox : s.magicBox}
        style={{ top: yCoordinate - 50, left: xCoordinate - 50 }}
      >
        <img
          src={star}
          alt="star"
          className={s.star}
          style={{ top: 0, left: 0 }}
        />

        <img
          src={star}
          alt="star"
          className={s.star}
          style={{ top: 0, right: 0 }}
        />

        <img
          src={star}
          alt="star"
          className={s.star}
          style={{ bottom: 0, left: 0 }}
        />

        <img
          src={star}
          alt="star"
          className={s.star}
          style={{ bottom: 0, right: 0 }}
        />
      </div>
    </div>
  );
}

CursorInteraction.propTypes = {
  children: PropTypes.node,
};
