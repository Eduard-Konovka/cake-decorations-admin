export function setScrollPosition(top = 0) {
  window.scrollTo({
    top,
    behavior: 'smooth',
  });
}
