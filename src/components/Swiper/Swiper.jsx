import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const SWIPER_ID = 'swiper';

export default function Swiper({
  children,
  onRight = () => {},
  onLeft = () => {},
  onUp = () => {},
  onDown = () => {},
}) {
  const [target, setTarget] = useState(null);
  const [xDown, setXDown] = useState(null);
  const [yDown, setYDown] = useState(null);

  useEffect(() => {
    setTarget(document.getElementById(SWIPER_ID));
  }, []);

  useEffect(() => {
    function handleTouchStart(e) {
      setXDown(e.touches[0].clientX);
      setYDown(e.touches[0].clientY);
    }

    function handleTouchMove(e) {
      if (!xDown || !yDown) {
        return;
      }

      let xUp = e.touches[0].clientX;
      let yUp = e.touches[0].clientY;

      let xDiff = xDown - xUp;
      let yDiff = yDown - yUp;

      /* Здесь берутся модули движения по оси абсцисс и ординат (почему модули? потому что если движение сделано влево или вниз, то его показатель будет отрицательным) и сравнивается, чего было больше: движения по абсциссам или ординатам. Нужно это для того, чтобы, если пользователь провел вправо, но немного наискосок вниз, сработал именно коллбэк для движения вправо, а ни как-то иначе */
      if (Math.abs(xDiff) > Math.abs(yDiff)) {
        /* Отлавливаем разницу в движении */
        if (xDiff > 0) {
          /* Коллбек на swipe влево */
          onLeft();
        } else {
          /* Коллбек на swipe вправо */
          onRight();
        }
      } else {
        /* Это, в общем-то, не надо, ведь только влево-вправо собираемся двигать */
        if (yDiff > 0) {
          /* swipe вверх */
          onUp();
        } else {
          /* swipe вниз */
          onDown();
        }
      }
      /* Свайп был, обнуляем координаты */
      setXDown(null);
      setYDown(null);
    }

    // Вешаем на прикосновение функцию handleTouchStart
    target?.addEventListener('touchstart', handleTouchStart, { passive: true });
    // А на движение пальцем по экрану - handleTouchMove
    target?.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      target?.removeEventListener('touchstart', handleTouchStart, {
        passive: true,
      });
      target?.removeEventListener('touchmove', handleTouchMove, {
        passive: true,
      });
    };
  }, [target, xDown, yDown, onRight, onLeft, onUp, onDown]);

  return <div id={SWIPER_ID}>{children}</div>;
}

Swiper.propTypes = {
  children: PropTypes.element.isRequired,
  onRight: PropTypes.func,
  onLeft: PropTypes.func,
  onUp: PropTypes.func,
  onDown: PropTypes.func,
};
