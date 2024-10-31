import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import star from 'assets/star.png';
import s from './CursorInteraction.module.css';

const CANVAS_ID = 'canvas';

export default function CursorInteraction({ children }) {
  const [canvas, setCanvas] = useState(null);
  const [staticCoords, setStaticCoords] = useState(true);
  const [pageX, setPageX] = useState(null);
  const [pageY, setPageY] = useState(null);
  const [xCoordinate, setXCoordinate] = useState(null);
  const [yCoordinate, setYCoordinate] = useState(null);

  useEffect(() => {
    setCanvas(document.getElementById(CANVAS_ID));
  }, []);

  useEffect(() => {
    function handleMouseMove(e) {
      setStaticCoords(false);

      setPageX(e.pageX);
      setPageY(e.pageY);

      setTimeout(() => {
        setXCoordinate(e.pageX);
        setYCoordinate(e.pageY);
      }, 300);
    }

    if (pageX === xCoordinate && pageY === yCoordinate) {
      setStaticCoords(true);
    }

    canvas?.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      canvas?.removeEventListener('mousemove', handleMouseMove, {
        passive: true,
      });
    };
  }, [canvas, pageX, pageY, xCoordinate, yCoordinate]);

  return (
    <div id={CANVAS_ID} className={s.canvas}>
      {children}

      <img
        src={star}
        alt="star"
        className={staticCoords ? s.activStar : s.star}
        style={{ top: yCoordinate - 60, left: xCoordinate - 60 }}
      />

      <img
        src={star}
        alt="star"
        className={staticCoords ? s.activStar : s.star}
        style={{ top: yCoordinate - 60, left: xCoordinate + 30 }}
      />

      <img
        src={star}
        alt="star"
        className={staticCoords ? s.activStar : s.star}
        style={{ top: yCoordinate + 30, left: xCoordinate - 60 }}
      />

      <img
        src={star}
        alt="star"
        className={staticCoords ? s.activStar : s.star}
        style={{ top: yCoordinate + 30, left: xCoordinate + 30 }}
      />
    </div>
  );
}

CursorInteraction.propTypes = {
  magicBoxSize: PropTypes.number,
  children: PropTypes.node,
};
