import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

export default function Swiper({ children, onRight, onLeft, onUp, onDown }) {
  useEffect(() => {
    // Вешаем на прикосновение функцию handleTouchStart
    document.addEventListener('touchstart', handleTouchStart, false);
    // А на движение пальцем по экрану - handleTouchMove
    document.addEventListener('touchmove', handleTouchMove, false);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart, false);
      document.removeEventListener('touchmove', handleTouchMove, false);
    };
  });

  let xDown = null;
  let yDown = null;

  function handleTouchStart(e) {
    xDown = e.touches[0].clientX;
    yDown = e.touches[0].clientY;
  }

  function handleTouchMove(e) {
    if (!xDown || !yDown) {
      return;
    }

    let xUp = e.touches[0].clientX;
    let yUp = e.touches[0].clientY;

    let xDiff = xDown - xUp;
    let yDiff = yDown - yUp;

    // Здесь берутся модули движения по оси абсцисс и ординат (почему модули? потому что если движение сделано влево или вниз, то его показатель будет отрицательным) и сравнивается, чего было больше: движения по абсциссам или ординатам. Нужно это для того, чтобы, если пользователь провел вправо, но немного наискосок вниз, сработал именно коллбэк для движения вправо, а ни как-то иначе.
    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      /* отлавливаем разницу в движении */
      if (xDiff > 0) {
        /* коллбек на swipe влево */
        onLeft();
      } else {
        /* коллбек на swipe вправо */
        onRight();
      }
    } else {
      // Это, в общем-то, не надо, ведь только влево-вправо собираемся двигать
      if (yDiff > 0) {
        /* swipe вверх */
        onUp();
      } else {
        /* swipe вниз */
        onDown();
      }
    }
    /* свайп был, обнуляем координаты */
    xDown = null;
    yDown = null;
  }

  return <>{children}</>;
}

Swiper.propTypes = {
  children: PropTypes.node,
  onRight: PropTypes.func,
  onLeft: PropTypes.func,
  onUp: PropTypes.func,
  onDown: PropTypes.func,
};
