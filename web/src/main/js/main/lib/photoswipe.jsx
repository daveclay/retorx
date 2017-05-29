export const getThumbBoundsFn = index => {
  // find thumbnail element
  let thumbnail = document.querySelectorAll('#gallery img')[index];
  // get window scroll Y
  let pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
  // optionally get horizontal scroll
  // get position of element relative to viewport
  let rect = thumbnail.getBoundingClientRect();
  // w = width

  // Good guide on how to get element coordinates:
  // http://javascript.info/tutorial/coordinates
  return {x: rect.left, y: rect.top + pageYScroll, w: rect.width};
}
