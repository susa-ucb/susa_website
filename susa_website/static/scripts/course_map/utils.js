/**
 * Find the magnitude of the segment between two points.
 * @params x1, y1, x2, y2 The coordinates of the points (x1, y1) (x2, y2).
 * @return The magnitude of the segment between the points.
 */
function mag(x1, y1, x2, y2) {
  return Math.sqrt((y2 - y1) ** 2 + (x2 - x1) ** 2)
}

/**
 * Find the midpoint of the segment between two points.
 * @params p1, p2 Two points of the format [x, y].
 * @return The midpoint of the segment connecting p1 and p2.
 */
function midpoint(p1, p2) {
    return [(p1[0] + p2[0])/2, (p1[1] + p2[1])/2]
}

/**
 * Adjust two points based on a scaling of the segment formed between two points
 * on the center.
 * @params x1, y1, x2, y2 The coordinates of the points (x1, y1) (x2, y2).
 * @return The points of the rescaled line segment.
 */
function scaleSegment(x1, y1, x2, y2) {
  const magn = mag(x1, y1, x2, y2);
  const prop1 = (magn - 35) / magn;
  const prop2 = (magn - 45) / magn;
  const x_1p = x2 - (x2 - x1) * prop1;
  const y_1p = y2 - (y2 - y1) * prop1;
  const x_2p = x1 + (x2 - x1) * prop2;
  const y_2p = y1 + (y2 - y1) * prop2;
  return [x_1p, y_1p, x_2p, y_2p];
}

/**
 * Return a circle coordinate generating function based on a center and radius
 * @params center The coordinates of the center [x, y]
 * @params radius The desired radius
 * @return a circle generating function
 */
function circleGen(c, r) {
  const cx = c[0];
  const cy = c[1];
  function circleCoord(rad) {
    const deg = Math.PI * rad;
    return [cx + Math.cos(deg) * r, cy - Math.sin(deg) * r];
};
  return circleCoord;
}
