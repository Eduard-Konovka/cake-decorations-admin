import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import s from './CursorInteraction.module.css';

const CONTAINER_ID = 'cursorInteractionContainer';
const X_CENTERING = -10;
const Y_CENTERING = -9;
const colorsData = [
  '#80ffff',
  '#800000',
  '#ff8080',
  '#ff0000',

  '#ff80ff',
  '#008000',
  '#80ff80',
  '#00ff00',

  '#ffff80',
  '#000080',
  '#8080ff',
  '#0000ff',

  '#000000',
  '#808080',
  '#ffffff',
];
let stopTimeout;

export default function CursorInteraction({
  diameter = 40,
  starQuantity = 20,
  starColorsData = colorsData,
  rotationSpeed = 3,
  plume = 300,
  children,
}) {
  const [container, setContainer] = useState(null);
  const [isMovingOfMouse, setIsMovingOfMouse] = useState(false);
  const [starColors, setStarColors] = useState([]);
  const [starOffsets, setStarOffsets] = useState([]);
  const [ringThicknessOffsets, setRingThicknessOffsets] = useState([]);
  const [pageX, setPageX] = useState(null);
  const [pageY, setPageY] = useState(null);
  const [xCoordinate, setXCoordinate] = useState(null);
  const [yCoordinate, setYCoordinate] = useState(null);
  const [torque, setTorque] = useState(0);
  const [trails, setTrails] = useState([]);

  useEffect(() => setContainer(document.getElementById(CONTAINER_ID)), []);

  useEffect(() => {
    const starOffsets = [];

    for (let i = 0; i < starQuantity; i++) {
      starOffsets.push(i);
    }

    setStarOffsets(starOffsets);
  }, [starQuantity]);

  useEffect(() => {
    const ringOffsets = [];

    for (let i = 0; i < starQuantity; i++) {
      const offset = getRandomIntInclusive(0, diameter);

      ringOffsets.push(offset);
    }

    setRingThicknessOffsets(ringOffsets);
  }, [starQuantity, diameter]);

  useEffect(() => {
    const starColorsArr = [];

    for (let i = 0; i < starQuantity; i++) {
      const color = getRandomIntInclusive(0, starColorsData.length - 1);

      starColorsArr.push(starColorsData[color]);
    }

    setStarColors(starColorsArr);
  }, [starQuantity, starColorsData]);

  useEffect(() => {
    function handleMouseMove(e) {
      setIsMovingOfMouse(true);

      setPageX(e.pageX);
      setPageY(e.pageY);

      setTimeout(() => {
        setXCoordinate(e.pageX);
        setYCoordinate(e.pageY);
      }, plume);

      clearTimeout(stopTimeout);

      stopTimeout = setTimeout(() => {
        setIsMovingOfMouse(false);
      }, plume + 100);

      // FIXME
      const newTrail = {
        x: e.pageX,
        y: e.pageY,
        id: Date.now(),
      };

      setTrails(prevTrails => [...prevTrails, newTrail]);
    }

    container?.addEventListener('mousemove', handleMouseMove, {
      passive: true,
    });

    return () => {
      container?.removeEventListener('mousemove', handleMouseMove, {
        passive: true,
      });
    };
  }, [plume, container, pageX, pageY, xCoordinate, yCoordinate]);

  useEffect(() => {
    const timeoutID = setTimeout(() => {
      setTorque(prevValue => prevValue + 0.01);
    }, rotationSpeed);

    return () => {
      clearTimeout(timeoutID);
    };
  }, [rotationSpeed, torque]);

  useEffect(() => {
    const intervalID = setInterval(() => {
      // We remove old traces, leaving a maximum of 10 elements
      setTrails(prevTrails => prevTrails.slice(-10));
    }, 100);

    return () => clearInterval(intervalID);
  }, []);

  function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  return (
    <div id={CONTAINER_ID} className={s.container}>
      {children}

      {starOffsets.length > 0 &&
        starOffsets.map((offset, idx) => (
          <div
            key={offset + idx}
            className={s.star}
            style={{
              left:
                xCoordinate +
                X_CENTERING +
                (diameter + ringThicknessOffsets[idx]) *
                  Math.cos(isMovingOfMouse ? offset : torque + offset),
              top:
                yCoordinate +
                Y_CENTERING +
                (diameter + ringThicknessOffsets[idx]) *
                  Math.sin(isMovingOfMouse ? offset : torque + offset),
              backgroundColor: starColors[idx],
            }}
          />
        ))}

      {trails.map(trail => (
        <div
          key={trail.id}
          className={s.trail}
          style={{
            left: trail.x - 10 + 'px',
            top: trail.y - 10 + 'px',
          }}
        />
      ))}
    </div>
  );
}

CursorInteraction.propTypes = {
  diameter: PropTypes.number,
  starQuantity: PropTypes.number,
  starColorsData: PropTypes.array,
  rotationSpeed: PropTypes.number,
  plume: PropTypes.number,
  children: PropTypes.node.isRequired,
};
