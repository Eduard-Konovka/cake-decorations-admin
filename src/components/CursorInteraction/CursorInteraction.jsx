import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import star from 'assets/star.png';
import s from './CursorInteraction.module.css';

const CANVAS_ID = 'canvas';
const CENTERING = -15;
const DIAMETER = 90;

export default function CursorInteraction({
  starQuantity = 15,
  rotationSpeed = 3,
  plume = 300,
  children,
}) {
  const [canvas, setCanvas] = useState(null);
  const [staticCoords, setStaticCoords] = useState(true);
  const [starOffsets, setStarOffsets] = useState([]);
  const [pageX, setPageX] = useState(null);
  const [pageY, setPageY] = useState(null);
  const [xCoordinate, setXCoordinate] = useState(null);
  const [yCoordinate, setYCoordinate] = useState(null);
  const [torque, setTorque] = useState(0);

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
      }, plume);
    }

    if (pageX === xCoordinate || pageY === yCoordinate) {
      setStaticCoords(true);
    }

    canvas?.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      canvas?.removeEventListener('mousemove', handleMouseMove, {
        passive: true,
      });
    };
  }, [plume, canvas, pageX, pageY, xCoordinate, yCoordinate]);

  useEffect(() => {
    const timeoutID = setTimeout(() => {
      if (torque >= 5.25) {
        setTorque(-1);
      } else {
        setTorque(prevValue => prevValue + 0.01);
      }
    }, rotationSpeed);

    return () => {
      clearTimeout(timeoutID);
    };
  }, [rotationSpeed, torque]);

  useEffect(() => {
    function getStarOffset() {
      const starOffsets = [];

      for (let i = 0; i < starQuantity; i++) {
        // if (i % 2 === 1) {
        //   starOffsets.push(getRandomFloat());
        // } else {
        //   starOffsets.push(i);
        // }

        starOffsets.push(i);
      }

      setStarOffsets(starOffsets);
    }

    function getRandomFloat(min = 0, max = 5.26) {
      return Math.random() * (max - min + 0.01) + min;
    }

    getStarOffset();
  }, [starQuantity]);

  return (
    <div id={CANVAS_ID} className={s.canvas}>
      {children}

      {starOffsets.length > 0 &&
        starOffsets.map((offset, idx) => (
          <img
            key={offset + idx}
            src={star}
            alt="star"
            className={s.star}
            style={{
              top:
                yCoordinate +
                CENTERING +
                DIAMETER * Math.sin(staticCoords ? torque + offset : offset),
              left:
                xCoordinate +
                CENTERING +
                DIAMETER * Math.cos(staticCoords ? torque + offset : offset),
            }}
          />
        ))}
    </div>
  );
}

CursorInteraction.propTypes = {
  starQuantity: PropTypes.number,
  rotationSpeed: PropTypes.number,
  plume: PropTypes.number,
  children: PropTypes.node.isRequired,
};
