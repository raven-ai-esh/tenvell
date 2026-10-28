const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

// Only the painted glass moves. The element's layout and pointer plane stay fixed.
export function glassMotion(rect, point, { kind = "control", reduced = false, editing = false } = {}) {
  const width = Math.max(1, Number(rect.width) || 1);
  const height = Math.max(1, Number(rect.height) || 1);
  const x = clamp(((point.x - rect.left) / width - .5) * 2, -1, 1);
  const y = clamp(((point.y - rect.top) / height - .5) * 2, -1, 1);
  const fixed = reduced || editing || kind === "field";
  const pull = kind === "surface" ? 1.7 : kind === "row" ? .55 : kind === "chart" ? 1 : .9;
  const lift = kind === "surface" ? 1.8 : kind === "row" ? .4 : .7;
  return {
    lightX: 50 + x * 36,
    lightY: 42 + y * 30,
    x: fixed ? 0 : x * pull,
    y: fixed ? 0 : -lift + y * pull * .45,
    tilt: fixed ? 0 : x * (kind === "surface" ? .25 : .5),
  };
}
