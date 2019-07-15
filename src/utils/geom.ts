export function getBounds(map: any) {
  const extent = map.getProjExtent();
  const min = extent.getMin();
  const max = extent.getMax();
  const proj = map.getSpatialReference().getProjection();
  const metersPerDegree = proj.metersPerDegree || (6378137 * Math.PI / 180);
  const projCenter = map._getPrjCenter();
  const xmin = (min.x - projCenter.x) / metersPerDegree;
  const xmax = (max.x - projCenter.x) / metersPerDegree;
  const ymin = (min.y - projCenter.y) / metersPerDegree;
  const ymax = (max.y - projCenter.y) / metersPerDegree;
  const eastIter = Math.max(0, Math.ceil((xmax - 180) / 360));
  const westIter = Math.max(0, Math.ceil((xmin + 180) / -360));
  return {
    xmin,
    ymin,
    xmax,
    ymax,
    eastIter,
    westIter,
  };
}

export function proxyExtent(map: any) {
  const extent = map.getExtent();
  const { westIter } = getBounds(map);
  let xmax = extent.xmax;
  let xmin = extent.xmin;
  if (extent.xmax < 0) {
    xmax = 180 - extent.xmax;
  }

  if (westIter > 0 && xmin > 0) {
    xmin = 180 + extent.xmin;
  }

  return {
    xmin,
    ymin: extent.ymin,
    xmax,
    ymax: extent.ymax,
  };
}
